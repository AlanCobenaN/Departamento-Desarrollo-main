import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // GitHub Pages publica el sitio en .../Departamento-Desarrollo-main/, no en
  // la raiz del dominio, asi que todas las rutas llevan esa carpeta delante.
  // BASE_PATH lo define el workflow de despliegue. En local se queda en "/",
  // que es lo que necesita http://localhost:5173.
  base: process.env.BASE_PATH || "/",
  plugins: [react(), tailwindcss()],

  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
