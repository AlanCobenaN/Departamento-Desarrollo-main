import { useMemo } from "react";
import { useSite } from "../contexts/SiteContext.jsx";
import { useContenido } from "../content/ContenidoContext.jsx";
import Reveal from "./Reveal.jsx";

const ICONO_TECNOLOGIA = "fa-solid fa-code";

const TECH_DEFAULT = [
  { icon: "fa-brands fa-react", name: "React" },
  { icon: "fa-brands fa-node-js", name: "Node.js" },
  { icon: "fa-brands fa-js", name: "JavaScript" },
  { icon: "fa-brands fa-php", name: "PHP" },
  { icon: "fa-solid fa-database", name: "PostgreSQL" },
  { icon: "fa-brands fa-html5", name: "HTML5" },
  { icon: "fa-brands fa-css3-alt", name: "CSS3" },
  { icon: "fa-brands fa-github", name: "Git" },
  { icon: "fa-solid fa-gears", name: "API REST" },
  { icon: "fa-brands fa-docker", name: "Docker" },
];

export default function TechRing() {
  const { t } = useSite();
  const contenido = useContenido();

  const lista = useMemo(() => {
    const guardados = contenido?.tecnologias;
    if (Array.isArray(guardados) && guardados.length > 0) {
      return guardados.map((tch) => ({
        icon:
          typeof tch.icono === "string" && tch.icono.trim()
            ? tch.icono.trim()
            : ICONO_TECNOLOGIA,
        name: tch.nombre,
      }));
    }
    return TECH_DEFAULT.map((tch) => ({ ...tch }));
  }, [contenido]);

  const length = lista.length;
  const step = length === 0 ? 360 : 360 / length;
  const radius = 13.2; // porcentaje relativo al contenedor
  const size = 3.2; // diámetro de la burbuja

  if (length === 0) return null;

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

        <div className="mt-12 flex justify-center">
          <div
            className="relative aspect-square w-full max-w-xl"
            style={{
              fontSize: `${size}rem`,
            }}
          >
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-fcvt-primary text-white shadow-lg ring-2 ring-fcvt-primary/40 sm:h-36 sm:w-36">
                <span className="text-center text-sm font-bold uppercase tracking-widest">
                  <i className="fa-solid fa-code mb-1 block text-2xl" aria-hidden="true" />
                  FCVT
                </span>
              </div>
            </div>

            {lista.map((tech, i) => {
              const angle = i * step;
              const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
              const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
              return (
                <div
                  key={tech.name}
                  className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fcvt-white p-2 text-center shadow-sm ring-1 ring-fcvt-lighter transition-transform hover:scale-110 dark:bg-white/5 dark:ring-white/10"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: "3.2rem",
                    height: "3.2rem",
                  }}
                  title={tech.name}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center">
                    <i className={`${tech.icon} text-fcvt-primary dark:text-fcvt-accent`} aria-hidden="true" />
                    <span className="mt-0.5 text-[10px] font-semibold text-fcvt-gray/90 dark:text-fcvt-gray/80">
                      {tech.name.length > 10 ? `${tech.name.slice(0, 9)}…` : tech.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}