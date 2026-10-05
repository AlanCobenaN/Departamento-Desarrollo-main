import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  // GitHub Pages publica el sitio en .../Departamento-Desarrollo-main/, no en
  // la raiz del dominio, asi que todas las rutas llevan esa carpeta delante.
  // BASE_PATH lo define el workflow de despliegue. En local se queda en "/",
  // que es lo que necesita http://localhost:5173.
  base: process.env.BASE_PATH || "/",
  plugins: [react(), tailwindcss()],

  build: {
    rollupOptions: {
      // Tres paginas y tres entradas. El acceso y el panel van en login/ y
      // panel-de/ y no en rutas de React porque en GitHub Pages una carpeta
      // es una ruta de verdad: /login/ se sirve sin ningun truco, mientras que
      // una ruta de router que no exista en disco daria 404 al recargarla o
      // al compartirla.
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        login: fileURLToPath(new URL("./login/index.html", import.meta.url)),
        "panel-de": fileURLToPath(new URL("./panel-de/index.html", import.meta.url)),
      },
    },
  },

  server: {
    // inicio.mjs pasa --port y --strictPort, asi que el puerto definitivo sale
    // de ahi. Este 5173 es solo el valor por defecto si se arranca con
    // `npm run dev:frontend` a pelo.
    port: 5173,
  },

  // No hay proxy hacia la API. El frontend la llama por su URL absoluta
  // (VITE_API_URL) y es la propia API en PHP la que responde con los cabeceros
  // CORS, igual que hara en produccion. En desarrollo ocurre lo mismo que en
  // el sitio publicado, que es lo que evita descubrir tarde un problema de
  // CORS que solo existe en produccion.
});
