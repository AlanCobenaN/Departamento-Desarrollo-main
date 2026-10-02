// La fuente de verdad es la API en PHP, que lee de PostgreSQL. Cuando no se
// puede consultar, el sitio cae a una foto del catalogo exportada de la base
// (frontend/public/catalogo.json, generada con `npm run catalogo`), de modo que
// la pagina nunca se queda a medias aunque la API todavia no este alojada.
//
// La foto es lo que permitio publicar en GitHub Pages sin montar todavia el
// backend. Es una foto y no una copia viva: si se edita un proyecto en la base
// hay que volver a exportarla, y mientras no se haga mandara ella.
//
// En desarrollo el servidor de PHP escucha en el 8000. En produccion no hay
// valor por defecto: VITE_API_URL se incrusta al compilar, y si falta se usa la
// foto en lugar de inventarse datos.
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:8000/api" : null);

// Vive en public/, asi que Vite lo copia tal cual a dist/ y se pide con la
// misma base que el resto de rutas del sitio publicado.
const CATALOGO_URL = `${import.meta.env.BASE_URL}catalogo.json`;

// Cuanto tiempo se espera antes de cortar. La base de datos esta en la misma
// red que la API, asi que cuatro segundos es holgado.
const TIMEOUT_MS = 4000;

// El recorte a los destacados va aqui y no en la API, para que la foto del
// catalogo guarde la lista entera y sea una copia fiel de la base. La API
// seguiria pudiendo devolver mas cosas en el futuro sin tocar este archivo.
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
 * Descarga el catalogo de proyectos.
 *
 * Se intenta primero la API. Si no hay URL configurada, si no responde o si
 * contesta algo que no es una lista, se cae a la foto exportada de la base.
 * Solo si tampoco se puede leer la foto se rechaza, y entonces App.jsx muestra
 * el estado de error con su boton de reintentar.
 *
 * @throws {Error} Si no hay API y tampoco se puede leer la foto del catalogo.
 */
export async function fetchProjects() {
  if (API_URL) {
    try {
      return await pedirCatalogo();
    } catch (error) {
      console.warn(
        `[fcvt] La API en ${API_URL} no respondio (${error.message}). Se usa la foto del catalogo.`,
      );
    }
  }

  return await pedirFoto();
}

/** Consulta la API PHP. Lanza si no contesta o si la respuesta no vale. */
async function pedirCatalogo() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${API_URL}/projects`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`estado ${response.status}`);
    }

    const proyectos = normalizar(await response.json());

    if (proyectos.length === 0) {
      throw new Error("la lista vino vacia");
    }

    return proyectos;
  } finally {
    clearTimeout(timeoutId);
  }
}

/** Lee la foto del catalogo que se publico junto al sitio. */
async function pedirFoto() {
  let respuesta;

  try {
    respuesta = await fetch(CATALOGO_URL, { cache: "no-cache" });
  } catch (error) {
    throw new Error(
      `No hay API disponible y tampoco se pudo leer ${CATALOGO_URL}. ` +
        "Genera la foto con npm run catalogo.",
    );
  }

  if (!respuesta.ok) {
    throw new Error(
      `${CATALOGO_URL} devolvio ${respuesta.status}. Genera la foto con npm run catalogo.`,
    );
  }

  const proyectos = normalizar(await respuesta.json());

  if (proyectos.length === 0) {
    throw new Error("la foto del catalogo esta vacia. Regenerala con npm run catalogo.");
  }

  console.info("[fcvt] Catalogo servido desde la foto local, no desde la API.");

  return proyectos;
}
