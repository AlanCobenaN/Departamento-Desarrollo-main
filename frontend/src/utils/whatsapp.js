import site from "../config/branding.js";

/**
 * Enlace de WhatsApp con el mensaje ya escrito.
 *
 * wa.me solo admite dígitos y con el prefijo del país (por eso el número está
 * en branding.js tal cual, sin + ni espacios). El texto va codificado porque
 * puede llevar saltos de línea, que en la URL son %0A.
 *
 * El número es un relleno (000000000), así que el enlace abre WhatsApp pero no
 * llega a escribir a nadie. Cuando haya uno real se cambia branding.js.
 */
export function waLink(text) {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(text)}`;
}

/** El número tal cual, para mostrarlo o para saber si sigue siendo el relleno. */
export const WA_PLACEHOLDER = "000000000";

/** True mientras el número sea el relleno: la interfaz avisa de que no llega a nadie. */
export const waIsPlaceholder = () => site.contact.whatsapp === WA_PLACEHOLDER;
