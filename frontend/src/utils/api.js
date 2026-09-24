import projectsFallback from "../data/projects.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

function normalize(payload) {
  if (payload && Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return projectsFallback;
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
    return projectsFallback;
  } finally {
    clearTimeout(timeoutId);
  }
}
