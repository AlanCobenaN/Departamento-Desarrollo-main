import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AdminPanel from "./pages/AdminPanel.jsx";
import { SiteProvider } from "./contexts/SiteContext.jsx";
import { A11yProvider } from "./contexts/AccessibilityContext.jsx";

// Entrada propia del panel de administracion, en su propia ruta y con su
// propia carga de pagina. Comparte el CSS y los dos contextos con la portada
// a proposito: si el visitante llega con el tema oscuro o el idioma cambiado,
// el panel arranca igual que el sitio.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <A11yProvider>
      <SiteProvider>
        <AdminPanel />
      </SiteProvider>
    </A11yProvider>
  </StrictMode>,
);