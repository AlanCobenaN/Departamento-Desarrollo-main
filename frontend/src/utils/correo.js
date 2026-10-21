/**
 * Validación de correos institucionales.
 */

export const DOMINIOS = ["live.uleam.edu.ec", "uleam.edu.ec"];

export const EMAIL_RE = new RegExp(
  `^[^\\s@]+@(${DOMINIOS.map((d) => d.replace(/\./g, "\\.")).join("|")})$`,
  "i"
);
