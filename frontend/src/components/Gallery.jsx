import { useCallback, useEffect, useState } from "react";
import site from "../config/branding.js";
import { useSite } from "../contexts/SiteContext.jsx";
import Reveal from "./Reveal.jsx";

/**
 * Galeria visual con visor ampliado (lightbox).
 * Accesible: se cierra con Esc, navega con las flechas y devuelve el foco
 * a la miniatura que la abrio.
 */
export default function Gallery({ projects = [] }) {
  const { t } = useSite();
  const [index, setIndex] = useState(null);

  const items = [
    ...site.screens.map((s) => ({
      id: s.file,
      src: s.file,
      title: t(s.key),
    })),
    ...projects.map((p) => ({
      id: `proyecto-${p.id}`,
      src: p.cover,
      title: p.nombre,
    })),
  ];

  const open = index !== null;
  const close = useCallback(() => setIndex(null), []);

  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % items.length)),
    [items.length]
  );
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, next, prev]);

  return (
    <section
      id="galeria"
      className="border-t border-fcvt-lighter bg-fcvt-lighter/40 py-16 sm:py-20 dark:border-white/10 dark:bg-white/[0.02]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-fcvt-accent">
            {t("gallery.title")}
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-fcvt-dark sm:text-4xl">
            {t("gallery.subtitle")}
          </h2>
        </Reveal>

        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal as="li" key={item.id} delay={Math.min(i, 7) * 60}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group relative block w-full overflow-hidden rounded-lg bg-fcvt-darker ring-1 ring-fcvt-lighter transition hover:ring-2 hover:ring-fcvt-accent dark:ring-white/10"
                aria-label={`${t("gallery.title")}: ${item.title}`}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-fcvt-darker/0 opacity-0 transition group-hover:bg-fcvt-darker/40 group-hover:opacity-100">
                  <i className="fa-solid fa-expand text-white" aria-hidden="true" />
                </span>
              </button>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* ---------- Lightbox ---------- */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("gallery.title")}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label={t("gallery.cerrar")}
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label={t("gallery.anterior")}
          >
            <i className="fa-solid fa-chevron-left" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label={t("gallery.siguiente")}
          >
            <i className="fa-solid fa-chevron-right" aria-hidden="true" />
          </button>

          <figure
            className="max-h-full w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={items[index].src}
              alt={items[index].title}
              className="mx-auto max-h-[75vh] w-auto rounded-lg object-contain"
            />
            <figcaption className="mt-4 text-center">
              <p className="font-semibold text-white">{items[index].title}</p>
              <p className="mt-1 text-xs text-white/60">{t("gallery.ayuda")}</p>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
