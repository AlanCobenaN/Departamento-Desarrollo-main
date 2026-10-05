/**
 * Validación de correos institucionales.
 */

export const DOMINIOS = ["live.uleam.edu.ec", "uleam.edu.ec"];

export const EMAIL_RE = new RegExp(
  `^[^\\s@]+@(${DOMINIOS.map((d) => d.replace(/\./g, "\\.")).join("|")})$`,
  "i"
);

/**
 * Comprueba si un correo pertenece a los dominios institucionales permitidos.
 * @param {string} correo
 * @returns {boolean}
 */
export function esCorreoInstitucional(correo) {
  if (typeof correo !== "string") return false;
  const limpio = correo.trim();
  if (!limpio) return false;
  return EMAIL_RE.test(limpio);
}