import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Services from "./components/Services.jsx";
import Projects from "./components/Projects.jsx";
import Gallery from "./components/Gallery.jsx";
import Footer from "./components/Footer.jsx";
import BackToTop from "./components/BackToTop.jsx";
import { SiteProvider, useSite } from "./contexts/SiteContext.jsx";
import { A11yProvider } from "./contexts/AccessibilityContext.jsx";
import { fetchProjects } from "./utils/api.js";
import { coverForAll } from "./utils/cover.js";
import { applyProjectLang } from "./utils/i18n.js";

function Layout() {
  const { t, lang } = useSite();
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

  // El contenido de los proyectos también cambia de idioma.
  const projects = useMemo(() => coverForAll(applyProjectLang(raw, lang)), [raw, lang]);

  return (
    <div className="flex min-h-screen flex-col bg-fcvt-light text-fcvt-dark dark:bg-fcvt-darker dark:text-fcvt-dark">
      <a href="#contenido" className="skip-link">
        {t("nav.saltar")}
      </a>

      <Navbar />

      <main id="contenido" className="flex-1">
        <Hero projectCount={loading ? 0 : projects.length} />
        <Services />
        <Projects
          projects={projects}
          loading={loading}
          error={error}
          onRetry={error ? load : undefined}
        />
        {!loading && !error && <Gallery projects={projects} />}
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
        <Layout />
      </SiteProvider>
    </A11yProvider>
  );
}
