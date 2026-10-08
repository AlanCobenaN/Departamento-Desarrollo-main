import { useMemo } from "react";
import { useSite } from "../contexts/SiteContext.jsx";
import { useContenido } from "../content/ContenidoContext.jsx";
import tech from "../data/tech.js";
import Reveal from "./Reveal.jsx";

/** Icono por defecto cuando el panel deja el campo vacío. */
const ICONO_TECNOLOGIA = "fa-solid fa-code";

/**
 * Banda de tecnologías: el anillo 3D con las tecnologías que usa el equipo.
 *
 * Es CSS 3D puro (transform-style: preserve-3d), sin WebGL y sin
 * dependencias. Gira muy despacio y se detiene al pasar el mouse, que es el
 * mecanismo que pide WCAG 2.2.2 para contenido que se mueve solo mas de cinco
 * segundos. El giro y la pausa viven en index.css (.tech-ring__stage).
 *
 * Los datos salen del panel si alguien los ha editado y, si no, de
 * data/tech.js, que es la lista de partida.
 */
export default function TechRing() {
  const { t } = useSite();
  const contenido = useContenido();

  const lista = useMemo(() => {
    const guardados = contenido?.tecnologias;
    if (Array.isArray(guardados) && guardados.length > 0) {
      return guardados.map((item) => ({
        icon:
          typeof item.icono === "string" && item.icono.trim()
            ? item.icono.trim()
            : ICONO_TECNOLOGIA,
        name: item.nombre,
      }));
    }
    return tech;
  }, [contenido]);

  if (lista.length === 0) return null;

  const paso = 360 / lista.length;

  return (
    <section className="border-t border-fcvt-lighter bg-fcvt-white py-16 sm:py-20 dark:border-white/10 dark:bg-fcvt-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-fcvt-accent">
              {t("tech.eyebrow")}
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-fcvt-dark sm:text-4xl">
              {t("tech.title")}
            </h2>
            <p className="mt-3 text-base text-fcvt-gray">{t("tech.subtitle")}</p>
          </div>
        </Reveal>

        <div className="tech-ring mt-6">
          <div className="tech-ring__stage">
            {lista.map((item, i) => (
              <div
                key={item.name}
                className="tech-ring__item"
                style={{ transform: `rotateY(${paso * i}deg) translateZ(var(--ring-radius))` }}
              >
                <i className={`${item.icon} text-xl`} aria-hidden="true" />
                <span className="mt-2 block text-xs font-bold">{item.name}</span>
              </div>
            ))}
          </div>
          {/* Velo que difumina la mitad trasera del anillo */}
          <div className="tech-ring__veil" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
