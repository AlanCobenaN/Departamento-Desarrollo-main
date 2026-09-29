import projectsFallback from "../data/projects.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// La portada muestra solo una selección. La API puede traer el catálogo
// completo, pero la landing enseña 4 destacados para no saturar.
const FEATURED_LIMIT = 4;

function normalize(payload) {
  const list =
    payload && Array.isArray(payload.data)
      ? payload.data
      : Array.isArray(payload)
        ? payload
        : projectsFallback;

  // La API usa "descripcion"; el respaldo local usa "resumen".
  // Se unifica el contrato para que la vista no dependa de la fuente.
  return list
    .map((p) => ({
      ...p,
      resumen: p.resumen || p.descripcion || "",
      tecnologias: Array.isArray(p.tecnologias) ? p.tecnologias : [],
    }))
    .slice(0, FEATURED_LIMIT);
}

/**
 * Descarga el catálogo de proyectos desde la API interna. Si el backend no
 * responde o devuelve un error, se cae a un respaldo local idéntico.
 */
export async function fetchProjects() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(`${API_URL}/projects`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`El servidor respondió con estado ${response.status}.`);
    }

    const body = await response.json();
    return normalize(body);
  } catch (error) {
    console.warn("[fcvt] No se pudo alcanzar la API, usando datos locales.", error);
    // Pasa por normalize igual que la API: así el respaldo respeta el mismo
    // contrato y el mismo tope de destacados.
    return normalize(projectsFallback);
  } finally {
    clearTimeout(timeoutId);
  }
}
