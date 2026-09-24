const links = [
  { href: "#inicio", label: "Inicio" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#contacto", label: "Contacto" },
];

function toggleMobileMenu() {
  const drawer = document.getElementById("mobile-menu");
  if (drawer) drawer.classList.toggle("hidden");
}

export default function Navbar() {
  return (
    <header className="bg-fcvt-darker text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#inicio" className="flex items-center">
          <img
            src="/logos/logo-blanco-pequeno.png"
            alt="Equipo de Desarrollo FCVT — ULEAM"
            className="h-9 w-auto"
          />
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-white/75 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <button className="rounded bg-fcvt-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-fcvt-primary-dark">
            Iniciar sesión
          </button>
        </nav>

        <button
          type="button"
          onClick={toggleMobileMenu}
          className="text-white focus:outline-none md:hidden"
          aria-label="Abrir menú"
        >
          <i className="fa-solid fa-bars text-xl" />
        </button>
      </div>

      <div id="mobile-menu" className="hidden border-t border-white/10 px-4 pb-4 md:hidden">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="block py-2 text-sm font-semibold text-white/80 hover:text-white"
          >
            {link.label}
          </a>
        ))}
      </div>
    </header>
  );
}
