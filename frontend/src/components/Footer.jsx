import site from "../config/branding.js";
import { useSite } from "../contexts/SiteContext.jsx";
import Reveal from "./Reveal.jsx";

const explore = [
  { href: "#inicio", key: "nav.inicio" },
  { href: "#proyectos", key: "nav.proyectos" },
  { href: "#galeria", key: "nav.galeria" },
];

/**
 * Pie de pagina sobre azul institucional.
 * Usa el escudo BLANCO (transparente) para evitar el cuadro blanco
 * del logo con texto, que se ve mal sobre fondo oscuro.
 * Los datos de contacto son ejemplos, nunca reales.
 */
export default function Footer() {
  const { t } = useSite();

  return (
    <footer
      id="contacto"
      className="footer-grid relative overflow-hidden bg-fcvt-darker text-white"
    >
      {/* Filete dorado con barrido de luz */}
      <div className="h-1 w-full overflow-hidden bg-fcvt-accent/40" aria-hidden="true">
        <div className="animate-sheen h-full w-1/3 bg-fcvt-accent" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        {/* Marca */}
        <Reveal>
          <div className="flex items-center gap-3">
            <img src={site.logoShield} alt="" width="320" height="320" className="h-11 w-11" />
            <span className="text-lg font-extrabold leading-tight">
              {site.shortName}
              <span className="block text-[11px] font-medium uppercase tracking-wider text-fcvt-accent">
                {site.university}
              </span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            {site.faculty}
          </p>
          <p className="mt-4 text-xs text-white/40">{t("footer.placeholders")}</p>
        </Reveal>

        {/* Enlaces */}
        <nav aria-label={t("footer.explorar")}>
          <Reveal>
            <h2 className="text-sm font-bold uppercase tracking-wider text-fcvt-accent">
              {t("footer.explorar")}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {explore.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/75 transition hover:text-fcvt-accent"
                  >
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </nav>

        {/* Contacto */}
        <Reveal delay={200}>
          <h2 className="text-sm font-bold uppercase tracking-wider text-fcvt-accent">
            {t("footer.contactTitle")}
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li className="flex items-start gap-3">
              <i className="fa-solid fa-envelope mt-1 w-4 shrink-0 text-fcvt-accent" aria-hidden="true" />
              <span className="break-all">{site.contact.email}</span>
            </li>
            <li className="flex items-start gap-3">
              <i
                className="fa-solid fa-phone mt-1 w-4 shrink-0 text-fcvt-accent"
                aria-hidden="true"
              />
              <span>{site.contact.phone}</span>
            </li>
            <li className="flex items-start gap-3">
              <i
                className="fa-solid fa-location-dot mt-1 w-4 shrink-0 text-fcvt-accent"
                aria-hidden="true"
              />
              <span>{site.city}</span>
            </li>
          </ul>

          <h2 className="mt-8 text-sm font-bold uppercase tracking-wider text-fcvt-accent">
            {t("footer.follow")}
          </h2>
          <ul className="mt-3 flex gap-2">
            {site.socials.map((s) => {
              // Sin perfil configurado se muestra el icono desactivado, para no
              // mandar a la portada de la red.
              const isPlaceholder = !s.href || s.href === "#";
              const className = isPlaceholder
                ? "flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-lg bg-white/10 text-white/60"
                : "flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white";

              return (
                <li key={s.label}>
                  {isPlaceholder ? (
                    <span
                      title={s.label}
                      aria-label={s.label}
                      className={className}
                      aria-disabled="true"
                    >
                      <i className={s.icon} aria-hidden="true" />
                    </span>
                  ) : (
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.label}
                      aria-label={s.label}
                      className={className}
                    >
                      <i className={s.icon} aria-hidden="true" />
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>

      {/* Cierre del pie: solo identificación institucional */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-5 text-xs text-white/45 sm:px-6 lg:px-8">
          <i className="fa-solid fa-graduation-cap text-fcvt-accent" aria-hidden="true" />
          {site.faculty} · {site.city}
        </div>
      </div>
    </footer>
  );
}
