import { useCallback, useEffect, useState } from "react";
import site from "../config/branding.js";
import { useSite } from "../contexts/SiteContext.jsx";
import { useA11y } from "../contexts/AccessibilityContext.jsx";

const SLIDE_MS = 7000;

/**
 * Portada: carrusel de fondos con degradado azul institucional para
 * garantizar contraste del texto.
 *
 * Accesible: el avance automatico se detiene al pasar el mouse, al enfocar
 * los controles y con la opcion "Eliminar animaciones" del menu de
 * accesibilidad, que es el mecanismo que pide WCAG 2.2.2 para contenido que
 * se mueve solo mas de cinco segundos.
 */
export default function Hero({ projectCount = 0 }) {
  const { t } = useSite();
  const { settings } = useA11y();
  const slides = site.heroSlides?.length
    ? site.heroSlides
    : [{ src: site.heroImage, alt: "" }];
  const count = slides.length;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const still = settings.reduceMotion;
  const go = useCallback((n) => setIndex(((n % count) + count) % count), [count]);

  // Avance automatico. Se omite si hay una sola imagen, si el usuario esta
  // sobre la seccion o si pidio quitar las animaciones.
  useEffect(() => {
    if (count < 2 || paused || still) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
    return () => clearInterval(id);
  }, [count, paused, still]);

  const stats = [
    { icon: "fa-solid fa-layer-group", value: projectCount, label: t("hero.statProyectos") },
    { icon: "fa-solid fa-code", value: "12+", label: t("hero.statStack") },
    { icon: "fa-solid fa-location-dot", value: "Manta", label: t("hero.statCampus") },
  ];

  return (
    <section
      id="inicio"
      className="relative isolate overflow-hidden bg-fcvt-darker"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Fondos: todos montados a la vez y cruzados con opacidad, para que el
          cambio no dependa de que la imagen siguiente haya terminado de
          cargar y se vea un hueco en blanco. */}
      <div
        aria-roledescription="carrusel"
        aria-label={t("hero.carrusel")}
        className="absolute inset-0 -z-10"
      >
        {slides.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            aria-hidden={i !== index}
            fetchPriority={i === 0 ? "high" : "low"}
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ease-out ${
              i === index ? "opacity-100" : "opacity-0"
            } ${still || i !== index ? "" : "animate-ken-burns"}`}
          />
        ))}
      </div>
      {/* Degradado: fuerte a la izquierda (donde va el texto), suave a la derecha */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-fcvt-darker via-fcvt-darker/92 to-fcvt-darker/45"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-fcvt-darker to-transparent"
      />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-24 lg:px-8">
        <div className="max-w-3xl">
          {/* Propuesta de valor: qué hacen y para quién */}
          <h1
            style={{ "--enter-delay": "150ms" }}
            className="enter text-3xl font-extrabold leading-[1.15] text-white sm:text-4xl lg:text-[3.2rem]"
          >
            {t("hero.title")}
          </h1>

          <p
            style={{ "--enter-delay": "400ms" }}
            className="enter mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
          >
            {t("hero.lead")}
          </p>

          {/* Un solo botón principal: reduce la carga cognitiva */}
          <div
            style={{ "--enter-delay": "550ms" }}
            className="enter mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#proyectos"
              className="animate-pulse-glow inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-fcvt-accent-from to-fcvt-accent-to px-6 py-3 text-sm font-bold text-fcvt-darker transition hover:from-fcvt-accent-from/90 hover:to-fcvt-accent-to/90"
            >
              {t("hero.primaryCta")}
              <i className="fa-solid fa-arrow-down text-xs" aria-hidden="true" />
            </a>
            <a
              href="#galeria"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              <i className="fa-regular fa-images text-sm" aria-hidden="true" />
              {t("hero.secondaryCta")}
            </a>
          </div>
        </div>

        {/* Datos de orientacion: dan contexto sin obligar a leer todo */}
        <dl className="mt-12 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              style={{ "--enter-delay": `${700 + i * 120}ms`, animationDelay: `${i * 0.7}s` }}
              className="enter animate-float flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
            >
              <i
                className={`${stat.icon} flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-fcvt-accent-from/15 to-fcvt-accent-to/15 text-sm text-fcvt-accent`}
                aria-hidden="true"
              />
              <div>
                <dd className="text-lg font-extrabold leading-none text-white">{stat.value}</dd>
                <dt className="mt-1 text-[11px] font-medium uppercase tracking-wide text-white/60">
                  {stat.label}
                </dt>
              </div>
            </div>
          ))}
        </dl>
      </div>

      {/* ---------- Avance del carrusel ----------
          La key cambia con la diapositiva, y eso es lo que reinicia la
          animacion de la barra. Se oculta si el avance automatico esta
          pausado o desactivado, para no prometer un cambio que no ocurre. */}
      {count > 1 && !paused && !still && (
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-10 h-1 bg-black/25">
          <div
            key={index}
            className="hero-progress h-full w-full bg-gradient-to-r from-fcvt-accent-from to-fcvt-accent-to"
            style={{ "--hero-slide-ms": `${SLIDE_MS}ms` }}
          />
        </div>
      )}

      {/* ---------- Controles del carrusel ----------
          Con una sola imagen no hay nada que cambiar, asi que no se pintan. */}
      {count > 1 && (
        <div className="absolute bottom-5 right-4 z-10 flex items-center gap-3 sm:right-6 lg:right-8">
          <div className="flex items-center gap-1.5" role="group" aria-label={t("hero.carrusel")}>
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white/80 transition hover:bg-black/50 hover:text-white"
              aria-label={t("hero.anterior")}
            >
              <i className="fa-solid fa-chevron-left text-[10px]" aria-hidden="true" />
            </button>
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => go(i)}
                aria-label={`${t("hero.irA")} ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-white" : "w-2 bg-white/45 hover:bg-white/70"
                }`}
              />
            ))}
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white/80 transition hover:bg-black/50 hover:text-white"
              aria-label={t("hero.siguiente")}
            >
              <i className="fa-solid fa-chevron-right text-[10px]" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
