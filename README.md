# Sitio del Departamento de Desarrollo

Web del equipo de desarrollo del Departamento de Desarrollo de Estudios y
Construcciones ULEAM-EP.

React y Vite en el navegador, PHP detrás, PostgreSQL guardando.

## Qué hay aquí

```
frontend/               el sitio
  src/components/       cada sección es un componente: Navbar, Hero, Projects,
                        Gallery, WhatsappForm, Footer...
  src/config/branding.js  nombre, textos ES/EN y datos de contacto
  src/contexts/         tema, idioma y los ajustes de accesibilidad
  src/utils/            llamada a la API, portadas SVG, textos de los proyectos
  src/panel/            editores del panel de administración
  login/                página de acceso, con su propia entrada de build
  panel-de/             panel de administración, con su propia entrada de build
api/                    la API en PHP
  public/index.php      punto de entrada y rutas
  src/                  Controllers, Services, Repositories
  database/             schema.sql, seed.sql, migrate.php, export.php
```

Casi todo lo que se toca a menudo está en `frontend/src/config/branding.js`:
textos, nombre del sitio y número de WhatsApp.

## Acceso y panel

`/login/` y `/panel-de/` son páginas aparte, con su propia entrada de build,
porque en GitHub Pages una carpeta es una ruta de verdad y una ruta de router
daría 404 al recargarla.

Ahora mismo el acceso es un **prototipo**: solo pasa la cuenta
`admin@uleam.edu.ec` / `admin123`, que está escrita en
`frontend/src/pages/Login.jsx`. No es seguridad, es una puerta abierta para
poder probar el panel sin montar autenticación.

El panel deja cambiar servicios, tecnologías, proyectos, galería, contacto de
WhatsApp y pie de página, pero **no guarda nada**: al recargar vuelve todo a su
sitio. Los datos de partida están en `frontend/src/panel/datos.js`.

## Requisitos

Node 18 o superior, PHP 8.1 o superior con la extensión `pdo_pgsql`, y
PostgreSQL 14 o superior.

## Arrancar

```bash
npm install
npm run inicio
```

Queda en http://localhost:5173 y la API en http://localhost:8000/api.

`inicio.mjs` avisa si falta alguna de las tres herramientas, crea los `.env`
que falten a partir de los `.env.example` y levanta frontend y API con las
salidas etiquetadas.

PostgreSQL tiene que estar arrancado antes. Si no lo está:

```bash
postgres -D <carpeta-de-datos>
```

| Comando | Qué hace |
|---|---|
| `npm run build` | Compila el frontend a `frontend/dist` |
| `npm run preview` | Sirve la compilación en local |
| `npm run catalogo` | Exporta la base a `frontend/public/catalogo.json` |
| `npm run dev:api` | Solo la API |
| `npm run dev:frontend` | Solo el frontend |

## Base de datos

La base se crea una vez:

```bash
createdb fcvt
```

Y el esquema con los datos de ejemplo, cada vez que haga falta:

```bash
php api/database/migrate.php --seed
```

Sin `--seed` solo aplica el esquema. **El seed borra la tabla `proyectos`
antes de insertar**, así que no lo ejecutes en producción.

Va por PDO y lee el mismo `api/.env` que la API, así que carga exactamente lo
que leerá el sitio.

## API

| Endpoint | Devuelve |
|---|---|
| `GET /api/health` | Estado del servicio y de la conexión |
| `GET /api/projects` | Catálogo completo, en `{ ok, data }` |
| `GET /api/projects/{id}` | Un proyecto, o 404 en `{ ok: false, error: { message } }` |

Los proyectos salen de PostgreSQL. Si la API no responde, el sitio cae a
`frontend/public/catalogo.json`, que es una foto del catálogo exportada de la
base. Esa foto es lo que permite publicar el sitio sin la API alojada, pero es
una foto: **después de cambiar algo en la base hay que regenerarla** con
`npm run catalogo`.

## Despliegue

El frontend se publica solo en GitHub Pages con cada push a `main`.

**La API y la base no salen de GitHub Pages.** Es un hosting estático y no
ejecuta PHP ni tiene base de datos. Van en un hosting con PHP o en una máquina
propia.

Cuando esa API exista, crea la variable de repositorio **VITE_API_URL** en
*Settings → Secrets and variables → Actions → Variables* con su URL pública, y
el sitio pasará a consultarla. Hasta entonces el despliegue se avisa pero no se
detiene, porque la foto del catálogo cubre el hueco.
