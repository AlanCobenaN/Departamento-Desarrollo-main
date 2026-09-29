import { useSite } from "../contexts/SiteContext.jsx";
import Reveal from "./Reveal.jsx";
import TechRing from "./TechRing.jsx";

/** Cuatro áreas de trabajo: el corazón de la landing. */
const AREAS = [
  { n: "01", icon: "fa-solid fa-laptop-code", key: "services.web" },
  { n: "02", icon: "fa-solid fa-mobile-screen-button", key: "services.mobile" },
  { n: "03", icon: "fa-solid fa-robot", key: "services.automation" },
  { n: "04", icon: "fa-solid fa-server", key: "services.support" },
];

/**
 * Sección "¿Qué hacemos?": responde la pregunta que el visitante se hace
 * nada más entrar — qué hace este equipo — sin obligarlo a leer los proyectos.
 */
export default function Services() {
  const { t } = useSite();

  return (
    <section id="servicios" className="bg-fcvt-white dark:bg-fcvt-white">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 sm:pb-10 sm:pt-20 lg:px-8">
        <Reveal className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-fcvt-accent">
            {t("services.eyebrow")}
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-fcvt-dark sm:text-4xl">
            {t("services.title")}
          </h2>
          <p className="mt-3 text-base text-fcvt-gray">{t("services.subtitle")}</p>
        </Reveal>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AREAS.map((area, i) => (
            <Reveal as="li" key={area.key} delay={i * 90}>
              <article className="group relative h-full overflow-hidden rounded-xl bg-fcvt-light p-6 ring-1 ring-fcvt-lighter transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-fcvt-primary/30 dark:bg-white/5 dark:ring-white/10">
                {/* Filete superior que se despliega al pasar el mouse */}
                <span
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-fcvt-accent transition-transform duration-300 group-hover:scale-x-100"
                  aria-hidden="true"
                />

                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-fcvt-primary/10 text-lg text-fcvt-primary transition group-hover:bg-fcvt-primary group-hover:text-white dark:bg-fcvt-accent/15 dark:text-fcvt-accent">
                    <i className={area.icon} aria-hidden="true" />
                  </span>
                  <span className="text-2xl font-extrabold text-fcvt-lighter dark:text-white/15">
                    {area.n}
                  </span>
                </div>

                <h3 className="mt-5 text-base font-bold leading-snug text-fcvt-dark">
                  {t(`${area.key}.title`)}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-fcvt-gray">
                  {t(`${area.key}.desc`)}
                </p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* Cierre de la misma sección: el stack con el que lo hacemos */}
      <TechRing />
    </section>
  );
}
