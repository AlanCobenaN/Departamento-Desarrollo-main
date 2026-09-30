import { useMemo, useState } from "react";
import { useSite } from "../contexts/SiteContext.jsx";
import { coverFor } from "../utils/cover.js";
import Reveal from "./Reveal.jsx";

/** Solo son enlaces reales los que apuntan a un sitio http(s). */
function realUrl(url) {
  if (typeof url !== "string" || !/^https?:\/\/\S+$/i.test(url)) return null;
  return url;
}

/**
 * Listado de proyectos con búsqueda instantánea y filtro por categoría.
 * Ambos controles reducen la carga cognitiva: el usuario encuentra lo que
 * busca sin recorrer todas las tarjetas.
 */
export default function Projects({ projects = [], loading = false, error = null, onRetry }) {
  const { t } = useSite();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    const unique = new Set(projects.map((p) => p.categoria).filter(Boolean));
    return Array.from(unique).sort((a, b) => a.localeCompare(b, "es"));
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesCategory = category === "all" || p.categoria === category;
      if (!matchesCategory) return false;
      if (!q) return true;
      const haystack = [p.nombre, p.resumen, p.categoria, ...(p.tecnologias || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [projects, query, category]);

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
  };

  return (
    <section id="proyectos" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      {/* Encabezado de sección */}
      <Reveal className="max-w-2xl">
        <span className="text-xs font-bold uppercase tracking-wider text-fcvt-accent">
          {t("projects.title")}
        </span>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-fcvt-dark sm:text-4xl">
          {t("projects.subtitle")}
        </h2>
      </Reveal>

      {/* ---------- Controles ---------- */}
      {!loading && !error && projects.length > 0 && (
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Búsqueda */}
          <div className="relative w-full lg:max-w-xs">
            <label htmlFor="buscar" className="sr-only">
              {t("projects.buscar")}
            </label>
            <i
              className="fa-solid fa-magnifying-glass pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-fcvt-gray"
              aria-hidden="true"
            />
            <input
              id="buscar"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("projects.placeholder")}
              className="w-full rounded-lg border border-fcvt-lighter bg-fcvt-white py-2.5 pl-11 pr-4 text-sm text-fcvt-dark placeholder:text-fcvt-gray/70 focus:border-fcvt-primary focus:outline-none dark:bg-white/5 dark:text-fcvt-dark dark:placeholder:text-fcvt-gray/60"
            />
          </div>

          {/* Filtro por categoría */}
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t("projects.filtro")}>
            <button
              type="button"
              onClick={() => setCategory("all")}
              aria-pressed={category === "all"}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                category === "all"
                  ? "bg-fcvt-primary text-white dark:text-fcvt-darker"
                  : "bg-fcvt-lighter text-fcvt-gray hover:text-fcvt-primary dark:bg-white/10 dark:text-fcvt-gray"
              }`}
            >
              {t("projects.todas")}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                aria-pressed={category === cat}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  category === cat
                    ? "bg-fcvt-primary text-white dark:text-fcvt-darker"
                    : "bg-fcvt-lighter text-fcvt-gray hover:text-fcvt-primary dark:bg-white/10 dark:text-fcvt-gray"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Contador de resultados */}
      {!loading && !error && projects.length > 0 && (
        <p className="mt-4 text-sm text-fcvt-gray" role="status" aria-live="polite">
          <span className="font-bold text-fcvt-primary dark:text-fcvt-accent">
            {filtered.length}
          </span>{" "}
          {filtered.length === 1 ? t("projects.resultado") : t("projects.resultados")}
        </p>
      )}

      {/* ---------- Estados ---------- */}
      {loading && (
        <>
          <p className="sr-only" role="status">
            {t("projects.cargando")}
          </p>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <li
                key={i}
                className="overflow-hidden rounded-xl bg-fcvt-white ring-1 ring-fcvt-lighter dark:bg-white/5 dark:ring-white/10"
              >
                <div className="h-44 animate-pulse bg-fcvt-lighter dark:bg-white/10" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-fcvt-lighter dark:bg-white/10" />
                  <div className="h-3 w-full animate-pulse rounded bg-fcvt-lighter dark:bg-white/10" />
                  <div className="h-3 w-4/5 animate-pulse rounded bg-fcvt-lighter dark:bg-white/10" />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {!loading && error && (
        <div
          role="alert"
          className="mt-8 rounded-xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/30"
        >
          <i className="fa-solid fa-triangle-exclamation text-2xl text-red-500" aria-hidden="true" />
          <p className="mt-3 font-semibold text-red-700 dark:text-red-300">
            {t("projects.error")}
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 rounded-lg bg-fcvt-primary px-5 py-2.5 text-sm font-bold text-white dark:text-fcvt-darker transition hover:bg-fcvt-primary-dark"
            >
              <i className="fa-solid fa-rotate-right mr-2" aria-hidden="true" />
              {t("projects.reintentar")}
            </button>
          )}
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <p className="mt-10 rounded-xl bg-fcvt-lighter p-8 text-center text-fcvt-gray dark:bg-white/5">
          {t("projects.vacio")}
        </p>
      )}

      {/* Sin resultados tras filtrar */}
      {!loading && !error && projects.length > 0 && filtered.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-fcvt-lighter p-10 text-center dark:border-white/15">
          <i
            className="fa-solid fa-magnifying-glass text-2xl text-fcvt-gray/60"
            aria-hidden="true"
          />
          <p className="mt-3 text-fcvt-gray">{t("projects.vacio")}</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 rounded-lg bg-fcvt-primary px-5 py-2.5 text-sm font-bold text-white dark:text-fcvt-darker transition hover:bg-fcvt-primary-dark"
          >
            {t("projects.limpiar")}
          </button>
        </div>
      )}

      {/* ---------- Tarjetas ---------- */}
      {!loading && !error && filtered.length > 0 && (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => {
            const href = realUrl(project.url);
            return (
            <Reveal as="li" key={project.id} delay={Math.min(i, 5) * 80} className="group">
              <article className="flex h-full flex-col overflow-hidden rounded-xl bg-fcvt-white shadow-sm ring-1 ring-fcvt-lighter transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-fcvt-primary/30 dark:bg-white/5 dark:ring-white/10">
                <div className="relative h-44 overflow-hidden bg-fcvt-darker">
                  <img
                    src={project.cover}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      // Si la imagen de ejemplo no existe, se genera al vuelo.
                      e.currentTarget.src = coverFor(project, project.id || 0);
                    }}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {project.categoria && (
                    <span className="absolute left-3 top-3 rounded-md bg-fcvt-primary/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white dark:text-fcvt-darker">
                      {project.categoria}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-bold leading-snug text-fcvt-dark">
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition hover:text-fcvt-primary hover:underline dark:hover:text-fcvt-accent"
                      >
                        {project.nombre}
                      </a>
                    ) : (
                      project.nombre
                    )}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-fcvt-gray">
                    {project.resumen}
                  </p>

                  {project.tecnologias?.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {project.tecnologias.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-md bg-fcvt-light px-2 py-1 text-[11px] font-medium text-fcvt-gray ring-1 ring-fcvt-lighter dark:bg-white/10 dark:ring-white/10"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-auto pt-4 text-sm font-bold">
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-fcvt-primary transition hover:text-fcvt-primary-light hover:underline dark:text-fcvt-accent"
                      >
                        {t("projects.ver")}
                        <i className="fa-solid fa-arrow-up-right-from-square ml-1.5 text-[10px]" aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="text-fcvt-gray/70">{t("projects.proximamente")}</span>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
            );
          })}
        </ul>
      )}
    </section>
  );
}
