/**
 * Persistencia del contenido del panel en localStorage.
 *
 * Todo lo que se edita en el panel (servicios, tecnologías, proyectos,
 * galería, WhatsApp y pie de página) se guarda en este almacén. Solo se usa
 * en desarrollo: el panel publicado está cerrado hasta que haya backend.
 * Al recargar la página, la portada leerá esos datos y los aplicará en
 * castellano.
 *
 * Importante: esto solo afecta al navegador que lo usa. En GitHub Pages no
 * hay una base de datos, así que no hay estado compartido entre personas.
 */

const CLAVE = "fcvt-panel";

/**
 * Lee el estado guardado.
 * @returns {any|null}
 */
export function leer() {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }
  try {
    const bruto = window.localStorage.getItem(CLAVE);
    if (!bruto) return null;
    const datos = JSON.parse(bruto);
    return datos && typeof datos === "object" ? datos : null;
  } catch {
    return null;
  }
}

/**
 * Guarda el estado.
 * @param {any} datos
 * @returns {boolean}
 */
export function guardar(datos) {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(datos));
    return true;
  } catch {
    return false;
  }
}

/**
 * Borra el contenido guardado (restablece el sitio).
 * @returns {boolean}
 */
export function borrar() {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }
  try {
    window.localStorage.removeItem(CLAVE);
    return true;
  } catch {
    return false;
  }
}
