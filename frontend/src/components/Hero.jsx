import site from "../config/branding.js";
import { useSite } from "../contexts/SiteContext.jsx";

/**
 * Portada: imagen real del slider del Aula Virtual (optimizada a JPG),
 * con degradado azul institucional para garantizar contraste del texto.
 */
export default function Hero({ projectCount = 0 }) {
  const { t } = useSite();

  const stats = [
    { icon: "fa-solid fa-layer-group", value: projectCount, label: t("hero.statProyectos") },
    { icon: "fa-solid fa-code", value: "12+", label: t("hero.statStack") },
    { icon: "fa-solid fa-location-dot", value: "Manta", label: t("hero.statCampus") },
  ];

  return (
    <section id="inicio" className="relative isolate overflow-hidden bg-fcvt-darker">
      {/* Fondo */}
      <img
        src={site.heroImage}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="animate-ken-burns absolute inset-0 -z-10 h-full w-full object-cover object-center"
      />
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
          <span
            style={{ "--enter-delay": "100ms" }}
            className="enter inline-flex items-center gap-2 rounded-full bg-fcvt-accent/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-fcvt-accent ring-1 ring-fcvt-accent/30"
          >
            <i className="fa-solid fa-code" aria-hidden="true" />
            {t("hero.badge")}
          </span>

          {/* Propuesta de valor: qué hacen y para quién */}
          <h1
            style={{ "--enter-delay": "250ms" }}
            className="enter mt-5 text-3xl font-extrabold leading-[1.15] text-white sm:text-4xl lg:text-[3.2rem]"
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
              className="animate-pulse-glow inline-flex items-center gap-2 rounded-lg bg-fcvt-accent px-6 py-3 text-sm font-bold text-fcvt-darker transition hover:bg-fcvt-accent/90"
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
                className={`${stat.icon} flex h-9 w-9 items-center justify-center rounded-lg bg-fcvt-accent/15 text-sm text-fcvt-accent`}
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
    </section>
  );
}
