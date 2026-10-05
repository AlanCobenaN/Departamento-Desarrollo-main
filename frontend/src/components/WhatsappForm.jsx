import { useId, useState } from "react";
import { useSite } from "../contexts/SiteContext.jsx";
import { waIsPlaceholder, waLink } from "../utils/whatsapp.js";
import Reveal from "./Reveal.jsx";

/** Motivos que se ofrecen. Las claves van al diccionario. */
const MOTIVOS = ["proyecto", "soporte", "otro"];

/* Estilo de los dos campos de texto, en una constante para no repetir la misma
   cadena larga (y el riesgo de que se desincronicen) en cada uno. Es el mismo
   que usa el buscador de proyectos. */
const CAMPO =
  "w-full rounded-lg border border-fcvt-lighter bg-fcvt-white px-4 py-2.5 text-sm text-fcvt-dark transition placeholder:text-fcvt-gray/70 focus:border-fcvt-primary focus:outline-none dark:bg-white/5 dark:text-fcvt-dark dark:placeholder:text-fcvt-gray/60";

const ETIQUETA = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-fcvt-gray";

/**
 * Formulario de contacto que arma el mensaje y lo entrega en WhatsApp.
 *
 * No hay backend ni envío de correo: se compone el texto y se abre la
 * conversación de wa.me con el mensaje ya escrito, para que el visitante
 * solo tenga que darle a enviar. Eso también significa que el sitio no
 * guarda nada de lo que se escribe aquí.
 *
 * El número sale de `site.contact.whatsapp` y es un relleno (000000000), no
 * un número real: el enlace se abre pero no llega a escribir a nadie. Cuando
 * haya número de verdad se cambia solo esa línea de branding.js.
 */
export default function WhatsappForm() {
  const { t } = useSite();
  const [nombre, setNombre] = useState("");
  const [motivo, setMotivo] = useState(MOTIVOS[0]);
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const uid = useId();

  const onSubmit = (e) => {
    e.preventDefault();
    // Cada motivo tiene su propio arranque de frase en el diccionario, para
    // que lo que llega al WhatsApp se lea como lo escribiría una persona y no
    // como una lista de campos.
    const texto = t(`whatsapp.textos.${motivo}`, {
      nombre: nombre.trim(),
      mensaje: mensaje.trim(),
    });
    window.open(waLink(texto), "_blank", "noopener,noreferrer");
    setEnviado(true);
  };

  return (
    <section className="border-t border-fcvt-lighter bg-fcvt-white py-16 sm:py-20 dark:border-white/10 dark:bg-fcvt-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        {/* Texto de la izquierda */}
        <Reveal>
          <span className="text-xs font-bold uppercase tracking-wider text-fcvt-accent">
            {t("whatsapp.eyebrow")}
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-fcvt-dark sm:text-4xl">
            {t("whatsapp.title")}
          </h2>
          <p className="mt-3 max-w-md text-base text-fcvt-gray">
            {t("whatsapp.subtitle")}
          </p>

          <ul className="mt-6 space-y-2.5 text-sm text-fcvt-gray">
            {["sinRegistro", "sinCorreo", "directo"].map((k) => (
              <li key={k} className="flex items-center gap-2.5">
                <i
                  className="fa-solid fa-circle-check w-4 shrink-0 text-fcvt-primary dark:text-fcvt-accent"
                  aria-hidden="true"
                />
                {t(`whatsapp.${k}`)}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Formulario */}
        <Reveal delay={150}>
          <form
            onSubmit={onSubmit}
            className="rounded-xl bg-fcvt-white p-5 shadow-sm ring-1 ring-fcvt-lighter sm:p-6 dark:bg-white/5 dark:ring-white/10"
          >
            <div>
              <label htmlFor={`${uid}-nombre`} className={ETIQUETA}>
                {t("whatsapp.nombre")}
              </label>
              <input
                id={`${uid}-nombre`}
                type="text"
                required
                maxLength={80}
                autoComplete="name"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder={t("whatsapp.nombrePlaceholder")}
                className={CAMPO}
              />
            </div>

            {/* Motivos como botones, igual que el filtro de categorías de los
                proyectos. Antes era un <select> y en modo oscuro se veía con
                fondo blanco y el texto casi blanco: el desplegable nativo no
                hereda el color del campo, así que sus opciones salían
                ilegibles. Con botones no hay ese problema. */}
            <div className="mt-5">
              <p className={ETIQUETA} id={`${uid}-motivo-label`}>
                {t("whatsapp.motivo")}
              </p>
              <div
                role="group"
                aria-labelledby={`${uid}-motivo-label`}
                className="flex flex-wrap gap-2"
              >
                {MOTIVOS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMotivo(m)}
                    aria-pressed={m === motivo}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                      m === motivo
                        ? "bg-fcvt-primary text-white shadow-sm dark:text-fcvt-darker"
                        : "bg-fcvt-lighter text-fcvt-gray hover:text-fcvt-primary dark:bg-white/10 dark:text-fcvt-gray"
                    }`}
                  >
                    {t(`whatsapp.motivos.${m}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor={`${uid}-mensaje`} className={ETIQUETA}>
                {t("whatsapp.mensaje")}
              </label>
              <textarea
                id={`${uid}-mensaje`}
                required
                rows={4}
                maxLength={1200}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder={t("whatsapp.mensajePlaceholder")}
                className={`${CAMPO} resize-y`}
              />
            </div>

            {/* Mismo degradado dorado que el botón principal del hero y el
                acceso del menú, para que el botón no sea un elemento ajeno
                al resto de la pagina. */}
            <button
              type="submit"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-fcvt-accent-from to-fcvt-accent-to px-4 py-3 text-sm font-extrabold text-fcvt-darker transition hover:brightness-105"
            >
              <i className="fa-brands fa-whatsapp text-base" aria-hidden="true" />
              {t("whatsapp.enviar")}
            </button>

            {/* Aviso de número provisional. Con un número real no tiene
                sentido, asi que se oculta solo cuando ya no es un relleno. */}
            {waIsPlaceholder() && (
              <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-fcvt-gray">
                <i
                  className="fa-solid fa-circle-info mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                {t("whatsapp.aviso")}
              </p>
            )}

            {/* regionaria: el lector de pantalla anuncia que ya se abrió la
                pestaña, sin que el foco salte de sitio */}
            <p aria-live="polite" className="sr-only">
              {enviado ? t("whatsapp.enviado") : ""}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
