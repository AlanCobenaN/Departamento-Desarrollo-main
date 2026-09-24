import site from "../config/branding.js";

const socials = [
  { href: "#", icon: "fa-brands fa-facebook-f", label: "Facebook" },
  { href: "#", icon: "fa-brands fa-instagram", label: "Instagram" },
  { href: "#", icon: "fa-brands fa-linkedin-in", label: "LinkedIn" },
  { href: "#", icon: "fa-brands fa-github", label: "GitHub" },
];

export default function Footer() {
  return (
    <footer id="contacto" className="bg-fcvt-darker text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div className="max-w-md">
            <img
              src="/logos/logo-nombre-completo.png"
              alt={`${site.university} — ${site.faculty}`}
              className="h-12 w-auto"
            />
            <p className="mt-4 text-sm text-white/60">
              {site.slogan} Estamos ubicados en la Universidad de Manta, Ecuador.
            </p>
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="mr-3 mt-4 inline-flex"
                aria-label={social.label}
              >
                <i className={`${social.icon} text-xl text-white/70 hover:text-white`} />
              </a>
            ))}
          </div>

          <div className="text-sm">
            <h3 className="text-lg font-bold">Contáctanos</h3>
            <p className="mt-3 text-white/70">desarrollo@fcvt.uleam.edu.ec</p>
            <p className="mt-1 text-white/70">+593 5 262-0202</p>
            <p className="mt-1 text-white/70">Manta, Manabí, Ecuador</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.faculty} · {site.university}
          </p>
          <p>Diseñado con Tech Inspirado en el tema Academi del Aula Virtual.</p>
        </div>
      </div>
    </footer>
  );
}
