// La API del catalogo es obligatoria. Antes habia un respaldo con los mismos
// ocho proyectos copiados a mano en el frontend, pero con PostgreSQL como
// fuente unica esa copia solo puede desincronizarse y acabar mostrando datos
// que ya no existen en la base.
//
// Si la API no responde, fetchProjects rechaza y App.jsx se encarga de
// mostrar el estado de error con su boton de reintentar.

// En desarrollo el servidor de PHP escucha en el 8000. En produccion no hay
// valor por defecto: VITE_API_URL se incrusta al compilar, y si falta es un
// fallo de configuracion que debe verse, no taparse con datos inventados.
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:8000/api" : null);

// Cuanto tiempo se espera antes de cortar. La base de datos esta en la misma
// red que la API, asi que cuatro segundos es holgado.
const TIMEOUT_MS = 4000;

// La portada muestra solo una seleccion. El recorte va aqui y no en la API:
// asi el catalogo completo sigue disponible para el buscador y para el futuro
// panel de administracion.
const FEATURED_LIMIT = 4;

/**
 * Lleva la respuesta de la API al formato que espera la vista.
 *
 * La API expone "descripcion" porque es el nombre historico del campo y
 * cambiarlo obligaria a tocar el backend y el frontend a la vez. La vista usa
 * "resumen", que se lee mejor, asi que se traduce en el borde.
 */
function normalizar(payload) {
  const lista = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : [];

  return lista
    .map((p) => ({
      ...p,
      resumen: p.resumen || p.descripcion || "",
      tecnologias: Array.isArray(p.tecnologias) ? p.tecnologias : [],
    }))
    .slice(0, FEATURED_LIMIT);
}

/**
 * Descarga el catalogo de proyectos desde la API PHP.
 *
 * @throws {Error} Si VITE_API_URL no esta definido, si la API no responde o si
 *                 devuelve algo que no es una lista de proyectos.
 */
export async function fetchProjects() {
  if (!API_URL) {
    throw new Error(
      "Falta VITE_API_URL. Sin ella el sitio no sabe donde vive la API.",
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${API_URL}/projects`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`El servidor respondió con estado ${response.status}.`);
    }

    return normalizar(await response.json());
  } catch (error) {
    console.warn(`[fcvt] No se pudo cargar el catálogo desde ${API_URL}.`, error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
