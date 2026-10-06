# AGENTS.md

Sitio en React + Vite (`frontend/`), API en PHP (`api/`), PostgreSQL. npm workspaces: solo
`frontend` es workspace; `api/` **no tiene Composer ni vendor/** — el autoloader PSR-4 está
escrito a mano en `api/src/bootstrap.php`.

## Comandos

```bash
npm install                                   # una vez, desde la raíz del repo
npm run inicio                                # dev: API (:8000) + Vite (:5173), salida etiquetada
npm run build                                 # solo compila; sale en frontend/dist
npm run preview                               # sirve la compilación en local
npm run catalogo                              # reescribe frontend/public/catalogo.json desde Postgres
php api/database/migrate.php --seed           # esquema + datos de ejemplo; --seed TRUNCATEa `proyectos`
npm run dev --workspace frontend              # solo frontend (Vite usa entonces el puerto 5173)
npm run dev:api                               # solo la API (puerto 8000 fijo)
```

- `npm run inicio` (= `npm run dev`) **falla y se detiene** si Node < 18, PHP < 8.1, PostgreSQL
  no responde en `DB_HOST:DB_PORT` de `api/.env`, o un puerto está ocupado. También crea
  `api/.env` / `frontend/.env` que falten copiando los `.env.example`. La base se crea una vez:
  `createdb fcvt`.
- Puertos: API `API_PORT` en `api/.env` (8000), web variable de entorno `FRONT_PORT` (5173).

## Verificación

**No hay lint, typecheck, formateador ni tests** (no existe config de ESLint/Prettier/phpunit/
vitest en ningún sitio). Comprobación mínima: `npm run build`; en PHP, `php -l <archivo>`.
Para revisar el panel en los dos idiomas sin navegador se puede renderizar con esbuild +
`renderToString` y mirar el HTML: atajo manual, no hay fichero de tests que subir.

## Arquitectura

- **Tres entradas HTML reales**, no rutas de router: `frontend/index.html`,
  `frontend/login/index.html`, `frontend/panel-de-administrador/index.html` (entradas
  `src/main.jsx`, `src/login-main.jsx`, `src/panel-main.jsx`, registradas en
  `frontend/vite.config.js` → `build.rollupOptions.input`). Son carpetas porque GitHub Pages
  da 404 al recargar una ruta inexistente. Añadir una página = carpeta nueva +
  `index.html` + una entrada nueva en `vite.config.js`. El script antidesello en línea está
  **duplicado en los tres `index.html`** — cámbialo en los tres.
- **Sin proxy de Vite**: el frontend llama a la URL absoluta `VITE_API_URL`; el CORS lo responde
  PHP desde la lista `CLIENT_ORIGIN` de `api/.env`. Desarrollo y producción se comportan igual a
  propósito — no añadas un proxy.
- **Flujo de datos**: PostgreSQL → PHP (`GET /api/health`, `/api/projects`, `/api/projects/{id}`,
  enrutado al final de `api/public/index.php`, prefijo de ruta de `API_PREFIX`) →
  `frontend/src/utils/api.js` → cae en `frontend/public/catalogo.json` cuando la API no responde
  (timeout de 4s) o no hay URL configurada. El recorte a destacados (4 ítems) ocurre en
  `api.js`, no en la API. **Tras cambiar algo en la base, ejecuta `npm run catalogo`** o el
  sitio publicado sigue sirviendo la foto vieja.
- **El panel persiste en `localStorage`** con la clave `fcvt-panel`
  (`frontend/src/panel/almacen.js`): solo en ese navegador, sin cuentas ni estado compartido. El
  botón de restablecer borra esa clave. README, `panel/datos.js` y `pages/AdminPanel.jsx` lo
  cuentan ya igual.
- **El login es un prototipo**: las cuentas salen de la lista de permisos del panel; la de
  respaldo es `admin@uleam.edu.ec` / `admin123` (`CUENTA_PROTOTIPO` en `almacen.js`). Los
  dominios permitidos están en `utils/correo.js`.
- **i18n**: los textos de interfaz viven en `config/branding.js` (sitio) y `config/panelTexts.js`
  (panel, extendido en el mismo diccionario) — añade cada clave nueva en **`es` y `en`**.
  El *contenido* editado en el panel es solo en español y solo se aplica cuando `lang === "es"`
  (`content/ContenidoContext.jsx`); los textos ingleses de proyectos están codificados por id en
  `utils/i18n.js`.
- Las URLs de assets públicos escritas en JS deben pasar por `asset()` de `config/branding.js`
  (prefijo `import.meta.env.BASE_URL`) o darán 404 en GitHub Pages; las de CSS las reescribe
  Vite solo.
- `backend/` es un resto muerto de la API Express antigua (solo un `.env` suelto). La API es
  `api/`.

## Despliegue / CI

- Push a `main` → `.github/workflows/deploy.yml` compila **solo el frontend** y publica en
  GitHub Pages. PHP y PostgreSQL no se despliegan desde este repo. El trabajo se hace en ramas
  `feat/*` (ver PR #2 ya fusionado); cada push a `main` vuelve a desplegar el sitio público.
- El workflow usa `npm install`, **no `npm ci`**, a propósito: `package-lock.json` se generó en
  Windows y solo registra las variantes de Windows de los binarios nativos (rollup, lightningcss,
  esbuild, `@tailwindcss/oxide`); un paso posterior instala las de linux-x64. No lo "arregles"
  cambiándolo a `npm ci`.
- `BASE_PATH` lo inyecta el workflow (desde `configure-pages`) y se queda en `/` en local.
- `VITE_API_URL` se lee de las **variables** del repo en Actions (no de secrets) y se incrusta al
  compilar; si falta, el despliegue solo avisa y el sitio sirve `catalogo.json`.

## Gotchas locales

- El `frontend/.env` sin versionar de este checkout puede seguir diciendo
  `VITE_API_URL=http://localhost:4000` (puerto del Express antiguo). El valor correcto en
  desarrollo es `http://localhost:8000/api` (`frontend/.env.example`). Síntoma: la API nunca se
  consulta, sale un `console.warn` en consola y se usa la foto del catálogo.
- Comentarios, mensajes de commit y textos de interfaz en español. `.editorconfig`: 2 espacios,
  UTF-8, LF, newline final.
