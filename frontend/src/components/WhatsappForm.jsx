import { useId, useMemo, useState } from "react";
import site from "../config/branding.js";
import { useSite } from "../contexts/SiteContext.jsx";
import { useContenido } from "../content/ContenidoContext.jsx";
import { waIsPlaceholder, waLink } from "../utils/whatsapp.js";
import Reveal from "./Reveal.jsx";

const MOTIVOS_DEFAULT = ["proyecto", "soporte", "otro"];

const CAMPO =
  "w-full rounded-lg border border-fcvt-lighter bg-fcvt-white px-4 py-2.5 text-sm text-fcvt-dark transition placeholder:text-fcvt-gray/70 focus:border-fcvt-primary focus:outline-none dark:bg-white/5 dark:text-fcvt-dark dark:placeholder:text-fcvt-gray/60";

const ETIQUETA = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-fcvt-gray";

const WA_PLACEHOLDER = "000000000";

function sustituirPlantilla(texto, nombre, mensaje) {
  const safeNombre = String(nombre ?? "").trim();
  const safeMensaje = String(mensaje ?? "").trim();
  return String(texto ?? "")
    .replaceAll("{nombre}", safeNombre)
    .replaceAll("{mensaje}", safeMensaje);
}

export default function WhatsappForm() {
  const { t } = useSite();
  const contenido = useContenido();
  const [nombre, setNombre] = useState("");
  const [motivo, setMotivo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const uid = useId();

  const numero = useMemo(() => {
    const guardado = contenido?.whatsapp?.numero;
    if (typeof guardado === "string" && guardado.trim()) {
      return guardado.trim();
    }
    return site.contact?.whatsapp || WA_PLACEHOLDER;
  }, [contenido]);

  const motivos = useMemo(() => {
    const guardados = contenido?.whatsapp?.motivos;
    if (Array.isArray(guardados) && guardados.length > 0) {
      return guardados.map((m, i) => ({
        id: m.id ?? `m-${i}`,
        etiqueta: m.etiqueta,
        texto: m.texto,
      }));
    }
    return MOTIVOS_DEFAULT.map((m) => ({
      id: m,
      etiqueta: t(`whatsapp.motivos.${m}`),
      texto: t(`whatsapp.textos.${m}`),
    }));
  }, [contenido, t]);

  useMemo(() => {
    if (motivos.length > 0 && !motivos.find((m) => m.id === motivo)) {
      setMotivo(motivos[0].id);
    }
  }, [motivos, motivo]);

  const onSubmit = (e) => {
    e.preventDefault();
    const elegido = motivos.find((m) => m.id === motivo) ?? motivos[0];
    if (!elegido) return;
    const texto = sustituirPlantilla(elegido.texto, nombre, mensaje);
    const url = waLink(texto, numero);
    window.open(url, "_blank", "noopener,noreferrer");
    setEnviado(true);
    setTimeout(() => setEnviado(false), 2500);
  };

  const esRelleno = numero.trim() === WA_PLACEHOLDER || waIsPlaceholder(numero);

  return (
    <section
      id="escribenos"
      className="border-t border-fcvt-lighter bg-fcvt-white py-16 sm:py-20 dark:border-white/10 dark:bg-fcvt-white"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
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

        <Reveal delay={150}>
          <form
            onSubmit={onSubmit}
            className="rounded-xl bg-fcvt-white p-5 shadow-sm ring-1 ring-fcvt-lighter sm:p-6 dark:bg-white/5 dark:ring-white/10"
          >
            {esRelleno && (
              <div className="mb-4 rounded-lg border border-amber-400/40 bg-amber-50/80 px-3 py-2 text-xs text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100">
                {t("whatsapp.aviso")}
              </div>
            )}
            <div>
              <label htmlFor={`${uid}-nombre`} className={ETIQUETA}>
                {t("whatsapp.nombre")}
              </label>
              <input
                id={`${uid}-nombre`}
                type="text"
                required
                autoComplete="name"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder={t("whatsapp.nombrePlaceholder")}
                className={CAMPO}
              />
            </div>
            <div className="mt-4">
              <label htmlFor={`${uid}-motivo`} className={ETIQUETA}>
                {t("whatsapp.motivo")}
              </label>
              <select
                id={`${uid}-motivo`}
                required
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className={`${CAMPO} appearance-none`}
              >
                {motivos.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.etiqueta}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <label htmlFor={`${uid}-mensaje`} className={ETIQUETA}>
                {t("whatsapp.mensaje")}
              </label>
              <textarea
                id={`${uid}-mensaje`}
                required
                rows={4}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder={t("whatsapp.mensajePlaceholder")}
                className={CAMPO}
              />
            </div>
            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-fcvt-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-fcvt-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-fcvt-primary dark:bg-fcvt-accent dark:text-fcvt-dark dark:hover:bg-fcvt-accent/90 dark:focus-visible:ring-fcvt-accent"
              >
                <i className="fa-brands fa-whatsapp" aria-hidden="true" />
                {t("whatsapp.enviar")}
              </button>
              {enviado && (
                <span className="text-xs font-medium text-fcvt-primary dark:text-fcvt-accent">
                  {t("whatsapp.enviado")}
                </span>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}