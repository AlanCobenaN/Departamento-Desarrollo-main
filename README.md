# Sitio FCVT

Web del equipo interno de desarrollo de la Facultad de Ciencias de la Vida y
Tecnologías (FCVT) de la ULEAM.

React y Vite en el navegador, PHP detrás, PostgreSQL guardando.

## Requisitos

Node 18 o superior, PHP 8.1 o superior con la extensión `pdo_pgsql`, y
PostgreSQL 14 o superior.

## Arrancar

```bash
npm install
npm run inicio
```

Queda en http://localhost:5173 y la API en http://localhost:8000/api.

`inicio.mjs` revisa que estén las tres herramientas, crea los `.env` que
falten a partir de los `.env.example`, avisa si un puerto ya está ocupado y
levanta frontend y API con las salidas etiquetadas.

PostgreSQL tiene que estar arrancado antes. Si no lo está:

```bash
postgres -D <carpeta-de-datos>
```

| Comando | Qué hace |
|---|---|
| `npm run build` | Compila el frontend a `frontend/dist` |
| `npm run preview` | Sirve la compilación en local |
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

Va por PDO y usa el mismo `api/.env` que la API, así que carga exactamente lo
que leerá el sitio.

## API

| Endpoint | Devuelve |
|---|---|
| `GET /api/health` | Estado del servicio y de la conexión |
| `GET /api/projects` | Catálogo completo, en `{ ok, data }` |
| `GET /api/projects/{id}` | Un proyecto, o 404 en `{ ok: false, error: { message } }` |

Los proyectos salen de PostgreSQL. No hay copia en el frontend: si la API no
responde, el sitio lo avisa en vez de mostrar un catálogo que puede estar
desfasado.

## Despliegue

El frontend se publica solo en GitHub Pages con cada push a `main`.

Hay que crear la variable de repositorio **VITE_API_URL** en
*Settings → Secrets and variables → Actions → Variables* con la URL pública de
la API. Sin ella el despliegue se detiene a propósito, porque el valor queda
incrustado en el JavaScript al compilar.

**La API y la base no salen de GitHub Pages.** Es un hosting estático y no
ejecuta PHP ni tiene base de datos. Van en un hosting con PHP o en una máquina
propia.
