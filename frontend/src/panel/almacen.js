/**
 * Persistencia del contenido del panel en localStorage.
 *
 * Todo lo que se edita en el panel (servicios, tecnologías, proyectos,
 * galería, WhatsApp, pie de página y permisos) se guarda en este almacén.
 * Al recargar la página, la portada leerá esos datos y los aplicará en
 * castellano.
 *
 * Importante: esto solo afecta al navegador que lo usa. En GitHub Pages no
 * hay una base de datos, así que no hay permisos compartidos entre personas.
 */

const CLAVE = "fcvt-panel";

export const CUENTA_PROTOTIPO = {
  correo: "admin@uleam.edu.ec",
  contrasena: "admin123",
};

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

/**
 * Devuelve la lista de cuentas permitidas.
 *
 * Si no hay nada guardado, devuelve la cuenta del prototipo para que el
 * inicio de sesión siga funcionando.
 * @param {any} permisos
 * @returns {Array<{correo: string, contrasena: string}>}
 */
export function cuentas(permisos) {
  if (Array.isArray(permisos) && permisos.length > 0) {
    return permisos;
  }
  return [{ ...CUENTA_PROTOTIPO }];
}

/**
 * Busca una cuenta por correo.
 * @param {string} correo
 * @param {any} permisos
 * @returns {{correo: string, contrasena: string}|null}
 */
export function buscarCuenta(correo, permisos) {
  if (typeof correo !== "string") return null;
  const limpio = correo.trim().toLowerCase();
  if (!limpio) return null;
  const lista = cuentas(permisos);
  return (
    lista.find((c) => String(c.correo).trim().toLowerCase() === limpio) ?? null
  );
}