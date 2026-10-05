import site from "../config/branding.js";
import { useSite } from "../contexts/SiteContext.jsx";
import { useContenido } from "../content/ContenidoContext.jsx";
import { useMemo } from "react";

const DEFAULT_EXPLORE = [
  { labelKey: "home", href: "#inicio" },
  { labelKey: "services", href: "#servicios" },
  { labelKey: "projects", href: "#proyectos" },
  { labelKey: "gallery", href: "#galeria" },
  { labelKey: "whatsapp", href: "#escribenos" },
];

const ICONO_RED = "fa-solid fa-link";

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useSite();
  const contenido = useContenido();

  const explore = useMemo(() => {
    const guardados = contenido?.pie?.explorar;
    if (Array.isArray(guardados) && guardados.length > 0) {
      return guardados.map((e, i) => ({
        id: e.id ?? `e-${i}`,
        href: e.href,
        label: e.etiqueta,
      }));
    }
    return DEFAULT_EXPLORE.map((e) => ({
      id: e.href,
      href: e.href,
      label: t(`footer.explore.${e.labelKey}`),
    }));
  }, [contenido, t]);

  const redes = useMemo(() => {
    const guardados = contenido?.pie?.redes;
    if (Array.isArray(guardados) && guardados.length > 0) {
      return guardados.map((r, i) => ({
        id: r.id ?? `r-${i}`,
        href: r.url && r.url.trim() ? r.url.trim() : "#",
        icon: typeof r.icono === "string" && r.icono.trim() ? r.icono.trim() : ICONO_RED,
        label: r.etiqueta,
        enabled: Boolean(r.url && r.url.trim()),
      }));
    }
    return site.socials.map((s) => ({
      id: s.icon,
      href: s.href,
      icon: s.icon,
      label: s.label,
      enabled: true,
    }));
  }, [contenido]);

  const email = contenido?.pie?.email || site.contact.email;
  const telefono = contenido?.pie?.telefono || site.contact.phone;
  const ubicacion = contenido?.pie?.ubicacion || site.city;

  return (
    <footer className="border-t border-fcvt-lighter bg-fcvt-white py-12 dark:border-white/10 dark:bg-fcvt-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="brand-shield-slot" aria-hidden="true" />
            <div>
              <p className="text-sm font-extrabold tracking-tight text-fcvt-dark">
                {site.faculty}
              </p>
              <p className="text-xs text-fcvt-gray">{site.university}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-fcvt-gray">
            {t("footer.description")}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-fcvt-dark">
            {t("footer.exploreTitle")}
          </h3>
          <ul className="mt-4 space-y-2">
            {explore.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className="text-sm text-fcvt-gray transition hover:text-fcvt-primary dark:hover:text-fcvt-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-fcvt-dark">
            {t("footer.contactTitle")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-fcvt-gray">
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-envelope w-4 shrink-0 text-fcvt-primary dark:text-fcvt-accent" aria-hidden="true" />
              <span>{email}</span>
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-phone w-4 shrink-0 text-fcvt-primary dark:text-fcvt-accent" aria-hidden="true" />
              <span>{telefono}</span>
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-location-dot w-4 shrink-0 text-fcvt-primary dark:text-fcvt-accent" aria-hidden="true" />
              <span>{ubicacion}</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-fcvt-dark">
            {t("footer.socialTitle")}
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {redes.map((r) => (
              <a
                key={r.id}
                href={r.href}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${
                  r.enabled
                    ? "bg-fcvt-primary/10 text-fcvt-primary hover:bg-fcvt-primary hover:text-white dark:bg-fcvt-accent/20 dark:text-fcvt-accent dark:hover:bg-fcvt-accent dark:hover:text-fcvt-dark"
                    : "cursor-not-allowed bg-fcvt-primary/10 text-fcvt-primary/40 dark:bg-fcvt-accent/10 dark:text-fcvt-accent/40"
                } transition`}
                aria-label={r.label}
                target={r.enabled && r.href !== "#" ? "_blank" : undefined}
                rel={r.enabled && r.href !== "#" ? "noopener noreferrer" : undefined}
              >
                <i className={r.icon} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-fcvt-lighter pt-6 text-center text-xs text-fcvt-gray dark:border-white/10">
        {t("footer.copy", { year })}
      </div>
    </footer>
  );
}