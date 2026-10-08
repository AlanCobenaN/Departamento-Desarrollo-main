import { useMemo } from "react";
import { useSite } from "../contexts/SiteContext.jsx";
import { useContenido } from "../content/ContenidoContext.jsx";
import Reveal from "./Reveal.jsx";

/** Icono por defecto cuando el panel deja el campo vacío. */
const ICONO_SERVICIO = "fa-solid fa-laptop-code";

export default function Services() {
  const { t } = useSite();
  const contenido = useContenido();

  const AREAS = useMemo(
    () => [
      { n: "01", icon: "fa-solid fa-laptop-code", key: "web" },
      { n: "02", icon: "fa-solid fa-mobile-screen-button", key: "mobile" },
      { n: "03", icon: "fa-solid fa-robot", key: "automation" },
      { n: "04", icon: "fa-solid fa-server", key: "support" },
    ],
    []
  );

  const areas = useMemo(() => {
    const guardados = contenido?.servicios;
    if (Array.isArray(guardados) && guardados.length > 0) {
      return guardados.map((a, i) => ({
        n: String(i + 1).padStart(2, "0"),
        icon: typeof a.icono === "string" && a.icono.trim() ? a.icono.trim() : ICONO_SERVICIO,
        titulo: a.titulo,
        desc: a.descripcion,
      }));
    }
    return AREAS.map((area) => ({
      n: area.n,
      icon: area.icon,
      titulo: t(`services.${area.key}.title`),
      desc: t(`services.${area.key}.desc`),
    }));
  }, [contenido, AREAS, t]);

  return (
    <section
      id="servicios"
      className="border-t border-fcvt-lighter bg-fcvt-lighter/40 py-16 sm:py-20 dark:border-white/10 dark:bg-fcvt-darker/60"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-fcvt-accent">
              {t("services.eyebrow")}
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-fcvt-dark sm:text-4xl">
              {t("services.title")}
            </h2>
            <p className="mt-3 text-base text-fcvt-gray">{t("services.subtitle")}</p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map((area, i) => (
            <Reveal key={area.n} delay={100 + i * 80}>
              <article className="group flex h-full flex-col rounded-xl bg-fcvt-white p-6 shadow-sm ring-1 ring-fcvt-lighter transition hover:-translate-y-1 hover:shadow-md dark:bg-white/5 dark:ring-white/10">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-fcvt-primary/10 text-fcvt-primary dark:bg-fcvt-accent/20 dark:text-fcvt-accent">
                    <i className={area.icon} aria-hidden="true" />
                  </span>
                  <span className="text-xs font-semibold tracking-widest text-fcvt-gray/80 dark:text-fcvt-gray/70">
                    {area.n}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-fcvt-dark">{area.titulo}</h3>
                <p className="mt-2 text-sm text-fcvt-gray">{area.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}