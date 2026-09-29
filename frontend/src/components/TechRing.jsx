import tech from "../data/tech.js";
import { useSite } from "../contexts/SiteContext.jsx";
import Reveal from "./Reveal.jsx";

const STEP = 360 / tech.length;

/**
 * Banda final de la sección "Qué hacemos": el anillo 3D con las tecnologías
 * que usa el equipo. Es CSS 3D puro (transform-style: preserve-3d), sin WebGL
 * y sin dependencias. Gira muy despacio y se detiene al pasar el mouse.
 */
export default function TechRing() {
  const { t } = useSite();

  return (
    <div className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-fcvt-accent">
            {t("tech.eyebrow")}
          </span>
          <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-fcvt-dark sm:text-3xl">
            {t("tech.title")}
          </h3>
          <p className="mt-3 text-base text-fcvt-gray">{t("tech.subtitle")}</p>
        </Reveal>

        <div className="tech-ring mt-6">
          <div className="tech-ring__stage">
            {tech.map((item, i) => (
              <div
                key={item.name}
                className="tech-ring__item"
                style={{ transform: `rotateY(${STEP * i}deg) translateZ(var(--ring-radius))` }}
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
    </div>
  );
}
