import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Login from "./pages/Login.jsx";
import { SiteProvider } from "./contexts/SiteContext.jsx";
import { A11yProvider } from "./contexts/AccessibilityContext.jsx";

// Entrada propia de la pagina de acceso. Comparte el CSS y los dos contextos
// con la portada a proposito: si el visitante cambia de tema, idioma o ajustes
// de accesibilidad alli, esta pagina arranca igual y en el mismo idioma.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <A11yProvider>
      <SiteProvider>
        <Login />
      </SiteProvider>
    </A11yProvider>
  </StrictMode>,
);
