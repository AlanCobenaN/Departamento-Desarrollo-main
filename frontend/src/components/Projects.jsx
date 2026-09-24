import { coverFor } from "../utils/cover.js";

const CATEGORY_COLORS = {
  "Gestión Interna": "bg-fcvt-primary",
  "Portales Web": "bg-fcvt-blue",
  Educación: "bg-fcvt-teal",
  Móvil: "bg-fcvt-gold",
  Innovación: "bg-fcvt-olive",
};

function categoryClass(category) {
  return CATEGORY_COLORS[category] || "bg-fcvt-plum";
}

function Section({ id, children }) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {children}
    </section>
  );
}

function Heading() {
  return (
    <>
      <h2 className="text-center text-3xl font-extrabold text-fcvt-dark sm:text-4xl">
        Proyectos en desarrollo
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-fcvt-gray">
        El catálogo se sirve desde nuestra API interna y, si el servicio no está
        disponible, el sitio funciona con un respaldo local idéntico.
      </p>
    </>
  );
}

export default function Projects({ projects = [], loading = false, error = null }) {
  if (loading) {
    return (
      <Section id="proyectos">
        <Heading />
        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <li
              key={i}
              className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-fcvt-lighter"
            >
              <div className="h-44 animate-pulse bg-fcvt-lighter" />
              <div className="space-y-3 p-6">
                <div className="h-4 w-2/3 animate-pulse rounded bg-fcvt-lighter" />
                <div className="h-3 w-full animate-pulse rounded bg-fcvt-lighter" />
              </div>
            </li>
          ))}
        </ul>
      </Section>
    );
  }

  if (error) {
    return (
      <Section id="proyectos">
        <Heading />
        <div className="mt-10 rounded-xl bg-red-50 p-8 text-center ring-1 ring-red-200">
          <p className="text-red-700">No pudimos cargar los proyectos: {error}</p>
          <p className="mt-2 text-sm text-red-600">
            Verifica que el servidor API esté corriendo en el puerto 4000.
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section id="proyectos">
      <Heading />

      <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <li
            key={project.id}
            className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-fcvt-lighter transition hover:-translate-y-1 hover:shadow-lg"
          >
            <a href={project.url || "#"} className="block">
              <div className="relative h-44 overflow-hidden bg-fcvt-dark">
                <img
                  src={project.cover || coverFor(project, index)}
                  alt={`Portada de ${project.nombre}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                {project.categoria && (
                  <span
                    className={`absolute left-4 top-4 rounded px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white ${categoryClass(
                      project.categoria
                    )}`}
                  >
                    {project.categoria}
                  </span>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-fcvt-dark">{project.nombre}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fcvt-gray">
                  {project.resumen}
                </p>

                {project.tecnologias?.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.tecnologias.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full bg-fcvt-light px-3 py-1 text-xs font-medium text-fcvt-gray ring-1 ring-fcvt-lighter"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
