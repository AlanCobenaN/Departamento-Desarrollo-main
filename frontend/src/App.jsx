import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Services from "./components/Services.jsx";
import TechRing from "./components/TechRing.jsx";
import Projects from "./components/Projects.jsx";
import Gallery from "./components/Gallery.jsx";
import WhatsappForm from "./components/WhatsappForm.jsx";
import Footer from "./components/Footer.jsx";
import BackToTop from "./components/BackToTop.jsx";
import { SiteProvider, useSite } from "./contexts/SiteContext.jsx";
import { A11yProvider } from "./contexts/AccessibilityContext.jsx";
import { ContenidoProvider, useContenido } from "./content/ContenidoContext.jsx";
import { fetchProjects } from "./utils/api.js";
import { coverForAll } from "./utils/cover.js";
import { applyProjectLang } from "./utils/i18n.js";
import { coverFor } from "./utils/cover.js";

function Layout() {
  const { t, lang } = useSite();
  const contenido = useContenido();
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    fetchProjects()
      .then(setRaw)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const projects = useMemo(() => {
    const guardados = contenido?.proyectos;
    if (Array.isArray(guardados) && guardados.length > 0 && lang === "es") {
      return guardados.map((p, i) => ({
        id: `panel-${i}`,
        nombre: p.nombre,
        resumen: p.descripcion,
        categoria: p.categoria,
        tecnologias: Array.isArray(p.tecnologias) ? p.tecnologias : [],
        cover: p.foto && p.foto.trim() ? p.foto.trim() : coverFor({ nombre: p.nombre, categoria: p.categoria }, i),
        url: "",
      }));
    }
    if (raw.length === 0 && !(Array.isArray(guardados) && guardados.length > 0)) {
      // keep loading state logic; but if we have overrides loaded? no, overrides come from contexto
    }
    return coverForAll(applyProjectLang(raw, lang));
  }, [contenido, raw, lang]);

  const isFromOverrides = contenido?.proyectos?.length > 0 && lang === "es";
  const projLoading = isFromOverrides ? false : loading;
  const projError = isFromOverrides ? null : error;

  return (
    <div className="flex min-h-screen flex-col bg-fcvt-light text-fcvt-dark dark:bg-fcvt-darker dark:text-fcvt-dark">
      <a href="#contenido" className="skip-link">
        {t("nav.saltar")}
      </a>

      <Navbar />

      <main id="contenido" className="flex-1">
        <Hero projectCount={projLoading ? 0 : projects.length} />
        <Services />
        <TechRing />
        <Projects
          projects={projects}
          loading={projLoading}
          error={projError}
          onRetry={error && !isFromOverrides ? load : undefined}
        />
        {projects.length > 0 && <Gallery projects={projects} />}
        <WhatsappForm />
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}

export default function App() {
  return (
    <A11yProvider>
      <SiteProvider>
        <ContenidoProvider>
          <Layout />
        </ContenidoProvider>
      </SiteProvider>
    </A11yProvider>
  );
}