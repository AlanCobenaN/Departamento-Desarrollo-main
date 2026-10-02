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

Va por PDO y usa el mismo `api/.env` que la API, así que carga exactamente lo
que leerá el sitio.

## API

| Endpoint | Devuelve |
|---|---|
| `GET /api/health` | Estado del servicio y de la conexión |
| `GET /api/projects` | Catálogo completo, en `{ ok, data }` |
| `GET /api/projects/{id}` | Un proyecto, o 404 en `{ ok: false, error: { message } }` |

Los proyectos salen de PostgreSQL. No hay copia escrita a mano en el código:
si la API no responde, el sitio cae a `frontend/public/catalogo.json`, una foto
del catálogo exportada de la base.

## La foto del catálogo

Es lo que permite publicar el sitio antes de tener la API alojada en algún
sitio. Cuando la API esté desplegada, manda ella y la foto deja de usarse.

Es una foto y no una copia viva, así que **después de cambiar algo en la base
hay que regenerarla**:

```bash
npm run catalogo
```

## Despliegue

El frontend se publica solo en GitHub Pages con cada push a `main`.

**La API y la base no salen de GitHub Pages.** Es un hosting estático y no
ejecuta PHP ni tiene base de datos. Van en un hosting con PHP o en una máquina
propia.

Cuando esa API exista, crea la variable de repositorio **VITE_API_URL** en
*Settings → Secrets and variables → Actions → Variables* con su URL pública, y
el sitio pasará a consultarla. Hasta entonces el despliegue se avisa pero no se
detiene, porque la foto del catálogo cubre el hueco.
