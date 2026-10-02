import { useEffect, useState } from "react";
import site from "../config/branding.js";
import { useSite } from "../contexts/SiteContext.jsx";
import AccessibilityMenu from "./AccessibilityMenu.jsx";
import NavMenu from "./NavMenu.jsx";

/**
 * Barra superior: marca a la izquierda; menú de navegación (hamburguesa),
 * accesibilidad, idioma y tema a la derecha.
 */
export default function Navbar() {
  const { t, lang, toggleLang, dark, toggleTheme } = useSite();
  const [scrolled, setScrolled] = useState(false);

  // Sombra al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`navbar-fcvt sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? "shadow-lg shadow-fcvt-darker/20" : "shadow-none"
      }`}
    >
      {/* ---------- Fila 1: marca + controles ---------- */}
      <div className="border-b border-fcvt-lighter bg-white dark:border-white/10 dark:bg-fcvt-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 pl-4 pr-16 sm:pl-6 lg:pl-8">
          {/* Marca: el escudo del footer, recoloreado con máscara CSS para
              que se vea sobre la fila clara sin necesitar un fondo */}
          <a href="#inicio" className="flex min-w-0 items-center gap-3" aria-label={site.faculty}>
            <span className="brand-shield-slot">
              <span className="brand-shield" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-extrabold uppercase tracking-wide text-fcvt-primary dark:text-fcvt-dark sm:text-sm">
                {site.faculty}
              </span>
              <span className="hidden truncate text-[11px] font-medium text-fcvt-gray sm:block">
                {site.university}
              </span>
            </span>
          </a>

          {/* Controles */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Menú de accesibilidad */}
            <AccessibilityMenu />

            {/* Idioma ES/EN */}
            <button
              type="button"
              onClick={toggleLang}
              className="hidden items-center gap-1.5 rounded-full border border-fcvt-lighter px-3 py-1.5 text-xs font-bold text-fcvt-gray transition hover:border-fcvt-primary hover:text-fcvt-primary dark:border-white/15 dark:hover:text-fcvt-accent sm:flex"
              aria-label={t("nav.idioma")}
              title={t("nav.idioma")}
            >
              <i className="fa-solid fa-globe text-[11px]" aria-hidden="true" />
              {lang === "es" ? "ES" : "EN"}
            </button>

            {/* Tema claro / oscuro */}
            <button
              type="button"
              onClick={toggleTheme}
              className="hidden h-8 w-8 items-center justify-center rounded-full border border-fcvt-lighter text-xs text-fcvt-gray transition hover:border-fcvt-primary hover:text-fcvt-primary dark:border-white/15 dark:hover:text-fcvt-accent sm:flex"
              aria-label={t("nav.tema")}
              title={t("nav.tema")}
            >
              <i className={dark ? "fa-solid fa-sun" : "fa-solid fa-moon"} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <NavMenu />
    </header>
  );
}
