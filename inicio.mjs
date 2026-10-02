#!/usr/bin/env node

/**
 * inicio — levanta la API en PHP y el frontend en Node de una sola vez.
 *
 * Es un atajo de `npm run dev` con las comprobaciones que si no hay que hacer a
 * mano: herramientas instaladas, .env, dependencias, base de datos al alcance
 * y puertos libres.
 *
 *   node inicio.mjs
 *   FRONT_PORT=5175 node inicio.mjs
 *
 * Sustituye a un script de bash porque este proyecto se desarrolla en Windows,
 * donde hace falta WSL para ejecutar bash. En Node funciona igual en los tres
 * sistemas y no depende de lsof ni de ss para comprobar los puertos.
 */

import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.dirname(fileURLToPath(import.meta.url));
const ES_WINDOWS = process.platform === "win32";

// Puertos por defecto. Los definitivos salen de api/.env y de FRONT_PORT.
const API_POR_DEFECTO = 8000;
const FRONT_POR_DEFECTO = 5173;

const COLOR = {
  api: "\x1b[35m", // magenta
  web: "\x1b[36m", // cyan
  info: "\x1b[36m",
  ok: "\x1b[32m",
  error: "\x1b[31m",
  apagado: "\x1b[90m",
};

const info = (texto) => console.log(`${COLOR.info}▸${COLOR.apagado} ${texto}`);
const ok = (texto) => console.log(`${COLOR.ok}✓${COLOR.apagado} ${texto}`);
const fallo = (texto) => console.error(`${COLOR.error}✗ ${texto}${COLOR.apagado}`);
const die = (texto) => {
  fallo(texto);
  process.exit(1);
};

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

/** Ejecuta un comando y devuelve su salida, o null si no esta instalado. */
function capturar(comando, argumentos) {
  const resultado = spawnSync(comando, argumentos, {
    encoding: "utf8",
    shell: ES_WINDOWS,
  });

  if (resultado.error || resultado.status !== 0) {
    return null;
  }

  return `${resultado.stdout ?? ""}${resultado.stderr ?? ""}`.trim();
}

/** Lee pares CLAVE=VALOR de un .env sin depender de nada externo. */
function leerEnv(ruta) {
  const valores = {};

  if (!fs.existsSync(ruta)) {
    return valores;
  }

  for (const linea of fs.readFileSync(ruta, "utf8").split(/\r?\n/)) {
    const limpia = linea.trim();

    if (limpia === "" || limpia.startsWith("#") || !limpia.includes("=")) {
      continue;
    }

    const separador = limpia.indexOf("=");
    const clave = limpia.slice(0, separador).trim();
    let valor = limpia.slice(separador + 1).trim();

    if (valor.length >= 2 && (valor[0] === '"' || valor[0] === "'") && valor.at(-1) === valor[0]) {
      valor = valor.slice(1, -1);
    }

    valores[clave] = valor;
  }

  return valores;
}

/** Traduce "8.2.12" en [8, 2, 12] para poder comparar versiones. */
function partes(version) {
  return version.split(".").map((n) => Number.parseInt(n, 10) || 0);
}

/** true si la version es al menos la minima exigida. */
function alMenos(version, minima) {
  const [a, b, c] = partes(version);
  const [x, y, z] = partes(minima);

  if (a !== x) return a > x;
  if (b !== y) return b > y;
  return c >= z;
}

/**
 * Comprueba que un puerto este libre.
 *
 * El bind va sin host a proposito: asi es dual-stack y detecta tambien a quien
 * escucha solo en IPv6. Vite resuelve "localhost" a ::1, de modo que un
 * proceso atado a [::1]:5173 delata un puerto ocupado que un bind a 127.0.0.1
 * no veria, y Vite se mudaria al 5174 sin avisar.
 */
function puertoLibre(puerto) {
  return new Promise((resolve) => {
    const servidor = net.createServer();
    servidor.once("error", () => resolve(false));
    servidor.listen(puerto, () => servidor.close(() => resolve(true)));
  });
}

/** ¿Se puede abrir un socket TCP? Es la forma de saber si PostgreSQL responde. */
function puertoRespondiendo(host, puerto) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port: puerto });
    socket.setTimeout(1500);

    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });

    const abandonar = () => {
      socket.destroy();
      resolve(false);
    };

    socket.once("timeout", abandonar);
    socket.once("error", abandonar);
  });
}

// ---------------------------------------------------------------------------
// Comprobaciones previas
// ---------------------------------------------------------------------------

info("Comprobando herramientas...");

// Node. No hace falta comprobar que existe: este script corre en el. Se
// comprueba la version, que es lo que puede estar anticuado.
const [majorNode] = partes(process.versions.node);
if (majorNode < 18) {
  die(`Node ${process.versions.node} es demasiado antiguo. El proyecto pide >= 18.`);
}
ok(`Node ${process.versions.node}`);

// --- .env -------------------------------------------------------------------
// Van antes de comprobar PHP a proposito: si falta una herramienta, tener los
// archivos de configuracion a mano ayuda a saber que se espera de cada una.

for (const carpeta of ["api", "frontend"]) {
  const destino = path.join(RAIZ, carpeta, ".env");
  const origen = `${destino}.example`;

  if (!fs.existsSync(destino) && fs.existsSync(origen)) {
    fs.copyFileSync(origen, destino);
    ok(`Creado ${carpeta}/.env desde ${carpeta}/.env.example`);
  }
}

const envApi = leerEnv(path.join(RAIZ, "api", ".env"));
const apiPort = Number.parseInt(process.env.API_PORT ?? envApi.API_PORT ?? "", 10) || API_POR_DEFECTO;
const frontPort = Number.parseInt(process.env.FRONT_PORT ?? "", 10) || FRONT_POR_DEFECTO;

// --- PHP --------------------------------------------------------------------

// Se pregunta con `php -v` y no con `php -r`. Cuando esta en marcha, Node
// construye la linea de comandos a traves de cmd y un ";" en el argumento
// cortaba la instruccion: PHP fallaba, y un PHP perfectamente instalado
// parecia que no lo estaba.
const versionPhp = capturar("php", ["-v"])?.match(/PHP\s+(\d+\.\d+\.\d+)/)?.[1] ?? null;

if (!versionPhp) {
  die(
    "PHP no esta instalado o no esta en el PATH.\n" +
      "  Windows: https://windows.php.net/download (marca el check box de Apache)\n" +
      "  Linux:   sudo apt install php-cli\n" +
      "  macOS:   brew install php",
  );
}

if (!alMenos(versionPhp, "8.1")) {
  die(`PHP ${versionPhp} es demasiado antiguo. El proyecto pide >= 8.1.`);
}
ok(`PHP ${versionPhp}`);

// --- PostgreSQL -------------------------------------------------------------
// El servidor de PHP avisa de un fallo de conexion, pero avisar antes es mas
// util que leer un error de PDO en la primera peticion.

const dbHost = envApi.DB_HOST ?? "127.0.0.1";
const dbPort = Number.parseInt(envApi.DB_PORT ?? "", 10) || 5432;

if (!(await puertoRespondiendo(dbHost, dbPort))) {
  die(
    `PostgreSQL no responde en ${dbHost}:${dbPort}.\n` +
      "  Esta levantado? Y la base existe?\n" +
      "    createdb fcvt\n" +
      `  Si la base esta en otro sitio, ajusta DB_HOST y DB_PORT en api/.env`,
  );
}
ok(`PostgreSQL en ${dbHost}:${dbPort}`);

// --- dependencias -----------------------------------------------------------

if (!fs.existsSync(path.join(RAIZ, "node_modules"))) {
  info("Faltan dependencias, instalando (puede tardar)...");
  spawnSync("npm", ["install", "--no-audit", "--no-fund"], {
    cwd: RAIZ,
    stdio: "inherit",
    shell: ES_WINDOWS,
  });
  ok("Dependencias instaladas");
}

// --- puertos ----------------------------------------------------------------

const ocupados = [];

for (const puerto of [apiPort, frontPort]) {
  if (!(await puertoLibre(puerto))) {
    ocupados.push(puerto);
  }
}

if (ocupados.length > 0) {
  die(
    `Puertos ocupados: ${ocupados.join(", ")}.\n` +
      "  Cierra lo que los este usando, o cambia API_PORT en api/.env / FRONT_PORT=... al llamar a este script.",
  );
}

// ---------------------------------------------------------------------------
// Arranque
// ---------------------------------------------------------------------------

// La URL que se anuncia se compone con API_PREFIX para que coincida con lo
// que de verdad sirve la API, y no con un /api fijo que mentiria en cuanto se
// cambie el prefijo en api/.env.
const prefijo = `/${(envApi.API_PREFIX ?? "/api").replace(/^\/+|\/+$/g, "")}`;
const rutaApi = prefijo === "/" ? "" : prefijo;

info(`API en http://localhost:${apiPort}${rutaApi}  ·  Frontend en http://localhost:${frontPort}`);
console.log("");

const hijos = [];

/** Lanza un hijo y prefija cada linea con su nombre para no mezclarlas. */
function lanzar(etiqueta, color, comando, argumentos) {
  const hijo = spawn(comando, argumentos, {
    cwd: RAIZ,
    env: process.env,
    shell: ES_WINDOWS,
    stdio: ["ignore", "pipe", "pipe"],
  });

  const prefijo = `${color}${etiqueta.padEnd(3)}${COLOR.apagado} │ `;

  for (const flujo of [hijo.stdout, hijo.stderr]) {
    flujo.setEncoding("utf8");
    flujo.on("data", (trozo) => {
      for (const linea of String(trozo).split(/\r?\n/)) {
        if (linea.trim() !== "") {
          console.log(prefijo + linea);
        }
      }
    });
  }

  hijo.on("error", (e) => {
    fallo(`No se pudo lanzar ${etiqueta}: ${e.message}`);
  });

  hijos.push(hijo);
  return hijo;
}

lanzar("api", COLOR.api, "php", ["-S", `localhost:${apiPort}`, "-t", path.join(RAIZ, "api", "public")]);

// --strictPort es lo que evita que Vite se mueva de puerto en silencio y deje
// la URL de arriba mintiendo.
lanzar("web", COLOR.web, "npm", [
  "run",
  "dev",
  "--workspace",
  "frontend",
  "--",
  "--port",
  String(frontPort),
  "--strictPort",
]);

// --- apagado limpio ---------------------------------------------------------

let cerrando = false;

function apagar() {
  if (cerrando) return;
  cerrando = true;

  for (const hijo of hijos) {
    if (hijo.exitCode !== null || hijo.signalCode !== null) continue;

    if (ES_WINDOWS) {
      // En Windows kill() solo termina el proceso inmediato, no el arbol.
      // taskkill /T se encarga de los nietos que lanza npm.
      spawnSync("taskkill", ["/pid", String(hijo.pid), "/T", "/F"], { shell: true });
    } else {
      hijo.kill("SIGTERM");
    }
  }

  process.exit(0);
}

process.on("SIGINT", apagar);
process.on("SIGTERM", apagar);
