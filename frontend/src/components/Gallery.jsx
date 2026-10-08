import { useCallback, useEffect, useMemo, useState } from "react";
import site from "../config/branding.js";
import { useSite } from "../contexts/SiteContext.jsx";
import { useContenido } from "../content/ContenidoContext.jsx";
import Reveal from "./Reveal.jsx";

export default function Gallery({ projects = [] }) {
  const { t } = useSite();
  const contenido = useContenido();
  const [index, setIndex] = useState(null);

  const items = useMemo(() => {
    const guardados = contenido?.galeria;
    if (Array.isArray(guardados) && guardados.length > 0) {
      return guardados.map((g, i) => ({
        id: `panel-galeria-${i}`,
        src: g.foto && g.foto.trim() ? g.foto.trim() : site.screens[0]?.file,
        title: g.titulo,
      }));
    }
    return [
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
  }, [contenido, projects, t]);

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
      className="border-t border-fcvt-lighter bg-fcvt-lighter/40 py-16 sm:py-20 dark:border-white/10 dark:bg-fcvt-darker/60"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-fcvt-accent">
              {t("gallery.eyebrow")}
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-fcvt-dark sm:text-4xl">
              {t("gallery.title")}
            </h2>
            <p className="mt-3 text-base text-fcvt-gray">{t("gallery.subtitle")}</p>
          </div>
        </Reveal>

        {items.length === 0 ? (
          <p className="mt-10 text-center text-sm text-fcvt-gray">{t("gallery.empty")}</p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((img, i) => (
              <Reveal key={img.id} delay={80 + i * 40}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  className="group aspect-[16/10] w-full overflow-hidden rounded-xl ring-1 ring-fcvt-lighter shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-fcvt-primary dark:ring-white/10"
                >
                  <img
                    src={img.src}
                    alt={img.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </button>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label={t("gallery.title")}
          onClick={close}
        >
          <div
            className="relative flex max-h-[90vh] max-w-6xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={items[index].src}
              alt={items[index].title}
              className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            />
            <div className="mt-4 max-w-4xl text-center text-sm text-white/90">
              {items[index].title}
            </div>

            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:left-4 sm:p-3"
              aria-label={t("gallery.anterior")}
            >
              <i className="fa-solid fa-chevron-left" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:right-4 sm:p-3"
              aria-label={t("gallery.siguiente")}
            >
              <i className="fa-solid fa-chevron-right" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={close}
              className="absolute right-2 top-2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:right-4 sm:top-4 sm:p-3"
              aria-label={t("gallery.cerrar")}
            >
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}