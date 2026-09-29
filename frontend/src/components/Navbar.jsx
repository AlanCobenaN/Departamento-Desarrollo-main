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

  // Marca el enlace de la sección visible.
  // Se calcula sobre el scroll en lugar de con IntersectionObserver porque las
  // secciones tienen alturas muy distintas: el ratio del observer no era
  // comparable entre ellas y la galería (la más alta) nunca ganaba, así que su
  // rallita no se pintaba. Aquí se elige la última sección cuyo inicio ya pasó
  // la línea de lectura, que es el criterio que espera el usuario.
  useEffect(() => {
    let frame = 0;

    const pick = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current = `#${links[0].href.slice(1)}`;

      for (const l of links) {
        const el = document.getElementById(l.href.slice(1));
        // getBoundingClientRect + scrollY da la posición real en el documento
        // aunque la sección cuelgue de un contenedor posicionado.
        if (el && el.getBoundingClientRect().top <= line) current = l.href;
      }

      // Al final del documento siempre se marca el último enlace, aunque la
      // sección sea más corta que el resto de la pantalla.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) current = links[links.length - 1].href;

      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(pick);
    };

    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
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
                aria-hidden="true"
                className={`absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-white transition-all duration-300 ${
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
