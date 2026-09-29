import { useEffect, useState } from "react";
import site from "../config/branding.js";
import { useSite } from "../contexts/SiteContext.jsx";
import AccessibilityMenu from "./AccessibilityMenu.jsx";

const links = [
  { href: "#inicio", key: "nav.inicio" },
  { href: "#servicios", key: "nav.servicios" },
  { href: "#proyectos", key: "nav.proyectos" },
  { href: "#galeria", key: "nav.galeria" },
  { href: "#contacto", key: "footer.contactTitle" },
];

/**
 * Barra de navegación inspirada en el tema Academi:
 * fila 1 clara con la marca y los controles, fila 2 azul con la navegación.
 * Incluye scrollspy, menú móvil accesible y el menú de accesibilidad.
 */
export default function Navbar() {
  const { t, lang, toggleLang, dark, toggleTheme } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#inicio");

  // Sombra al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Marca el enlace de la sección visible
  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter(Boolean);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Cierra el menú móvil con Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? "shadow-lg shadow-fcvt-darker/20" : "shadow-none"
      }`}
    >
      {/* ---------- Fila 1: marca + controles ---------- */}
      <div className="border-b border-fcvt-lighter bg-white dark:border-white/10 dark:bg-fcvt-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Marca: mismo escudo del footer, sobre azulejo azul porque el
              logo es blanco puro y la fila 1 es clara */}
          <a href="#inicio" className="flex min-w-0 items-center gap-3" aria-label={site.name}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-fcvt-primary">
              {/* El PNG trae 69% de transparencia, así que se agranda para
                  que el escudo visible ocupe el azulejo */}
              <img
                src={site.logoShield}
                alt=""
                width="324"
                height="323"
                className="h-14 w-14 object-contain"
              />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-extrabold uppercase tracking-wide text-fcvt-primary dark:text-fcvt-dark">
                {site.name}
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
              className="flex items-center gap-1.5 rounded-full border border-fcvt-lighter px-3 py-1.5 text-xs font-bold text-fcvt-gray transition hover:border-fcvt-primary hover:text-fcvt-primary dark:border-white/15 dark:hover:text-fcvt-accent"
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
              className="flex h-8 w-8 items-center justify-center rounded-full border border-fcvt-lighter text-xs text-fcvt-gray transition hover:border-fcvt-primary hover:text-fcvt-primary dark:border-white/15 dark:hover:text-fcvt-accent"
              aria-label={t("nav.tema")}
              title={t("nav.tema")}
            >
              <i className={dark ? "fa-solid fa-sun" : "fa-solid fa-moon"} aria-hidden="true" />
            </button>

            {/* Menú móvil */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-fcvt-primary text-sm text-white transition hover:bg-fcvt-primary-dark md:hidden"
              aria-label={open ? t("nav.cerrar") : t("nav.menu")}
              aria-expanded={open}
              aria-controls="menu-movil"
            >
              <i className={open ? "fa-solid fa-xmark" : "fa-solid fa-bars"} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Fila 2: navegación azul institucional ---------- */}
      <div className="hidden bg-fcvt-primary md:block">
        <nav
          className="mx-auto flex h-12 max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8"
          aria-label={t("nav.principal")}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={active === link.href ? "page" : undefined}
              className={`relative py-2 text-sm font-semibold transition ${
                active === link.href ? "text-white" : "text-white/75 hover:text-white"
              }`}
            >
              {t(link.key)}
              <span
                className={`absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-fcvt-accent transition-all ${
                  active === link.href ? "w-full" : "w-0"
                }`}
              />
            </a>
          ))}
        </nav>
      </div>

      {/* ---------- Drawer móvil ---------- */}
      <div
        id="menu-movil"
        hidden={!open}
        className="border-t border-fcvt-lighter bg-white md:hidden dark:border-white/10 dark:bg-fcvt-white"
      >
        <nav className="mx-auto max-w-7xl px-4 py-2" aria-label={t("nav.principal")}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                active === link.href
                  ? "bg-fcvt-lighter text-fcvt-primary dark:bg-white/10 dark:text-fcvt-accent"
                  : "text-fcvt-gray hover:bg-fcvt-light dark:hover:bg-white/5"
              }`}
            >
              <i className="fa-solid fa-chevron-right text-[10px] opacity-50" aria-hidden="true" />
              {t(link.key)}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
