# Sitio web — Facultad de Ciencias de la Vida y Tecnologías (ULEAM)

Web del equipo interno de desarrollo de la FCVT, de la Universidad Laica
Eloy Alfaro de Manabí.

## Puesta en marcha

```bash
./inicio
```

`inicio` deja todo listo y levanta los dos servicios a la vez. Antes
comprueba que Node sea el adecuado, crea los `.env` que falten a partir de
los `.env.example`, instala las dependencias si no están, y avisa si los
puertos ya están ocupados en vez de arrancar en otro sitio sin decirlo.

Para arrancar en otro puerto: `FRONT_PORT=5175 ./inicio`.

Equivale a `npm install && npm run dev`, que se puede seguir usando:

```bash
npm install
npm run dev
```

- Frontend (Vite) → http://localhost:5173
- API (Express) → http://localhost:4000

## Estructura

| Carpeta | Contenido |
|---|---|
| `frontend/` | React + Vite + Tailwind 4 |
| `backend/` | API REST Express con el catálogo de proyectos |
| `assets/` | Logos institucionales |

## Otros comandos

| Comando | Qué hace |
|---|---|
| `npm run build` | Compila el frontend a `frontend/dist/` |
| `npm run preview` | Sirve la compilación en local |
| `npm test` | Tests del backend |

## Configuración

Copiar `frontend/.env.example` y `backend/.env.example` a `.env` para cambiar
puertos o la URL de la API. Sin `.env` se usan los valores por defecto de
desarrollo.