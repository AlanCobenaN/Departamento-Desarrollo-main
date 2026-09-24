import site from "../config/branding.js";

export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-fcvt-dark text-white">
      <img
        src="/logos/logo-grande.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 m-auto h-full w-full object-cover opacity-20"
      />

      <div className="relative mx-auto flex min-h-[420px] max-w-7xl flex-col items-start justify-center px-4 py-20 sm:px-6 lg:px-8">
        <span className="inline-block rounded-full bg-fcvt-primary px-3 py-1 text-xs font-semibold uppercase tracking-widest">
          Equipo interno de desarrollo
        </span>
        <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl">
          {site.slogan}
        </h1>
        <p className="mt-5 max-w-xl text-lg text-white/80">
          Pertenecemos a la {site.faculty} de la {site.university} y creamos
          herramientas digitales para nuestra comunidad.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#proyectos"
            className="rounded bg-fcvt-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-fcvt-primary-dark"
          >
            Ver proyectos
          </a>
          <a
            href="#contacto"
            className="rounded border border-white/30 px-6 py-3 text-sm font-bold text-white transition hover:border-white hover:bg-white/10"
          >
            Hablemos
          </a>
        </div>
      </div>
    </section>
  );
}
