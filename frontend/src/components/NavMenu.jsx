import { useEffect, useRef, useState } from "react";
import site from "../config/branding.js";
import { useSite } from "../contexts/SiteContext.jsx";

const sections = [
  { href: "#inicio", key: "nav.inicio", icon: "fa-solid fa-house" },
  { href: "#servicios", key: "nav.servicios", icon: "fa-solid fa-layer-group" },
  { href: "#proyectos", key: "nav.proyectos", icon: "fa-solid fa-diagram-project" },
  { href: "#galeria", key: "nav.galeria", icon: "fa-solid fa-images" },
  { href: "#contacto", key: "nav.contacto", icon: "fa-solid fa-envelope" },
];

export default function NavMenu() {
  const { t, lang, toggleLang, dark, toggleTheme } = useSite();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);
  const returnFocus = useRef(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        returnFocus.current = true;
        setOpen(false);
      }
    };
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      panelRef.current?.focus();
    } else if (returnFocus.current) {
      returnFocus.current = false;
      buttonRef.current?.focus();
    }
  }, [open]);

  const closeReturningFocus = () => {
    returnFocus.current = true;
    setOpen(false);
  };

  return (
    <div className="absolute right-0 top-0 z-50 h-14" ref={wrapRef}>
      <button
        type="button"
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls="panel-navegacion"
        aria-label={open ? t("nav.cerrar") : t("nav.menu")}
        title={open ? t("nav.cerrar") : t("nav.menu")}
        className="flex h-full min-w-14 items-center justify-center rounded-bl-2xl bg-gradient-to-b from-fcvt-accent-from to-fcvt-accent-to pl-3 pr-3 text-lg text-fcvt-darker shadow-md transition hover:brightness-105"
      >
        <i className={open ? "fa-solid fa-xmark" : "fa-solid fa-bars"} aria-hidden="true" />
      </button>

      {open && (
        <div
          id="panel-navegacion"
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-label={t("nav.menu")}
          className="nav-panel absolute right-0 top-full z-50 max-h-[calc(100dvh-3.5rem)] w-[min(21rem,calc(100vw-1.5rem))] overflow-y-auto overscroll-contain rounded-xl rounded-tr-none border border-fcvt-lighter bg-fcvt-white shadow-2xl dark:border-white/15 dark:bg-fcvt-white"
        >
          <div className="flex items-center justify-between gap-3 border-b border-fcvt-lighter bg-fcvt-primary px-4 py-3 dark:border-white/10">
            <p className="flex items-center gap-2 text-sm font-bold text-white dark:text-fcvt-darker">
              <i className="fa-solid fa-bars" aria-hidden="true" />
              {site.shortName}
            </p>
            <button
              type="button"
              onClick={closeReturningFocus}
              aria-label={t("nav.cerrar")}
              className="flex h-6 w-6 items-center justify-center rounded text-white/80 transition hover:bg-white/20 hover:text-white dark:text-fcvt-darker/80 dark:hover:bg-black/10 dark:hover:text-fcvt-darker"
            >
              <i className="fa-solid fa-xmark text-xs" aria-hidden="true" />
            </button>
          </div>

          <p className="px-4 pb-1 pt-3 text-[11px] font-bold uppercase tracking-wider text-fcvt-gray">
            {t("nav.secciones")}
          </p>
          <ul className="px-2 pb-2">
            {sections.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-fcvt-dark transition hover:bg-fcvt-lighter hover:text-fcvt-primary dark:text-fcvt-dark dark:hover:bg-white/5 dark:hover:text-fcvt-accent"
                >
                  <i className={`${link.icon} w-4 shrink-0 text-center text-sm text-fcvt-primary dark:text-fcvt-accent`} aria-hidden="true" />
                  {t(link.key)}
                </a>
              </li>
            ))}
          </ul>

          <p className="border-t border-fcvt-lighter px-4 pb-1 pt-3 text-[11px] font-bold uppercase tracking-wider text-fcvt-gray dark:border-white/10">
            {t("nav.paginas")}
          </p>
          <ul className="px-2 pb-2">
            {site.pages.map((page) => (
              <li key={page.key}>
                <span
                  aria-disabled="true"
                  className="flex cursor-not-allowed items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-fcvt-gray/70 dark:text-fcvt-gray/80"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <i className={`${page.icon} w-4 shrink-0 text-center text-sm`} aria-hidden="true" />
                    <span className="truncate">{t(page.key)}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-fcvt-lighter px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-fcvt-gray dark:bg-white/10 dark:text-fcvt-dark">
                    {t("nav.proximamente")}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <div className="border-t border-fcvt-lighter px-2 py-2 sm:hidden dark:border-white/10">
            <p className="px-3 pb-1 pt-1 text-[11px] font-bold uppercase tracking-wider text-fcvt-gray">
              {t("nav.ajustes")}
            </p>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={t("nav.tema")}
              title={t("nav.tema")}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-fcvt-dark transition hover:bg-fcvt-lighter dark:text-fcvt-dark dark:hover:bg-white/5"
            >
              <i className={`${dark ? "fa-solid fa-sun" : "fa-solid fa-moon"} w-4 shrink-0 text-center text-sm text-fcvt-primary dark:text-fcvt-accent`} aria-hidden="true" />
              <span className="flex-1 text-left">{t("nav.temaCorto")}</span>
              <span className="text-xs font-bold text-fcvt-gray">{dark ? t("nav.oscuro") : t("nav.claro")}</span>
            </button>
            <button
              type="button"
              onClick={toggleLang}
              aria-label={t("nav.idioma")}
              title={t("nav.idioma")}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-fcvt-dark transition hover:bg-fcvt-lighter dark:text-fcvt-dark dark:hover:bg-white/5"
            >
              <i className="fa-solid fa-globe w-4 shrink-0 text-center text-sm text-fcvt-primary dark:text-fcvt-accent" aria-hidden="true" />
              <span className="flex-1 text-left">{t("nav.idioma")}</span>
              <span className="text-xs font-bold text-fcvt-gray">{lang === "es" ? "ES" : "EN"}</span>
            </button>
          </div>

          <div className="border-t border-fcvt-lighter p-3 dark:border-white/10">
            <span title={t("nav.proximamente")} className="block">
              <button
                type="button"
                aria-disabled="true"
                aria-describedby="nav-login-aviso"
                className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-fcvt-accent-from to-fcvt-accent-to px-4 py-2.5 text-sm font-extrabold text-fcvt-darker"
              >
                <i className="fa-solid fa-right-to-bracket" aria-hidden="true" />
                {t("nav.login")}
              </button>
              <span id="nav-login-aviso" className="sr-only">
                {t("nav.proximamente")}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
