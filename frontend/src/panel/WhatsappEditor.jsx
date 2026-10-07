import { useSite } from "../contexts/SiteContext.jsx";
import { WA_PLACEHOLDER, waLink } from "../utils/whatsapp.js";
import { nuevoId } from "./datos.js";
import {
  BotonPrincipal,
  BotonSecundario,
  Campo,
  Subtitulo,
  Tarjeta,
} from "./comunes.jsx";

/** Datos de ejemplo para el texto que se enseña en la vista previa. */
const NOMBRE_EJEMPLO = "Ana";
const MENSAJE_EJEMPLO = "Vi el sitio y me gustaría saber más.";

/**
 * Sustituye los {entre llaves} de un texto por los valores del formulario.
 * Es la misma cuenta que hace WhatsappForm.jsx; se repite aquí a proposito,
 * porque si se importara el helper del formulario el panel ya dependería de
 * un componente de la portada para previsualizar su propio texto.
 */
function conValores(texto) {
  return texto
    .replaceAll("{nombre}", NOMBRE_EJEMPLO)
    .replaceAll("{mensaje}", MENSAJE_EJEMPLO);
}

/**
 * Editor del contacto por WhatsApp: número, saludo del menú y motivos.
 *
 * Cada motivo lleva su texto de arranque y no una plantilla común con el
 * motivo metido en medio, porque "Escribo por un proyecto nuevo" se lee
 * mucho mejor que una línea de "Motivo:". Los {nombre} y {mensaje} los
 * sustituye el formulario al enviar.
 */
export default function WhatsappEditor({ value, onChange }) {
  const { t } = useSite();

  function cambiarCampo(campo, nuevo) {
    onChange({ ...value, [campo]: nuevo });
  }

  function cambiarMotivo(id, campo, nuevo) {
    onChange({
      ...value,
      motivos: value.motivos.map((m) => (m.id === id ? { ...m, [campo]: nuevo } : m)),
    });
  }

  function anadirMotivo() {
    onChange({
      ...value,
      motivos: [
        ...value.motivos,
        {
          id: nuevoId(),
          etiqueta: "",
          texto: "Hola, soy {nombre}.\n\n{mensaje}",
        },
      ],
    });
  }

  function quitarMotivo(id) {
    onChange({ ...value, motivos: value.motivos.filter((m) => m.id !== id) });
  }

  const esRelleno = value.numero.trim() === WA_PLACEHOLDER;
  const soloDigitos = /^\d+$/.test(value.numero.trim());

  return (
    <div className="space-y-5">
      <Tarjeta titulo={t("panel.whatsapp.tarjetaNumero")}>
        <div className="grid gap-4 lg:grid-cols-2">
          <Campo
            etiqueta={t("panel.whatsapp.numero")}
            valor={value.numero}
            onChange={(nuevo) => cambiarCampo("numero", nuevo)}
            placeholder={WA_PLACEHOLDER}
            ayuda={
              esRelleno
                ? t("panel.whatsapp.ayudaRelleno")
                : soloDigitos
                  ? t("panel.whatsapp.ayudaCorrecto")
                  : t("panel.whatsapp.ayudaFormato")
            }
          />
          <Campo
            etiqueta={t("panel.whatsapp.saludo")}
            valor={value.saludo}
            onChange={(nuevo) => cambiarCampo("saludo", nuevo)}
            placeholder={t("panel.whatsapp.saludoPlaceholder")}
            ayuda={t("panel.whatsapp.saludoAyuda")}
          />
        </div>
      </Tarjeta>

      <Tarjeta
        titulo={t("panel.whatsapp.tituloMotivos", { n: value.motivos.length })}
        accion={
          <BotonPrincipal onClick={anadirMotivo}>
            <i className="fa-solid fa-plus" aria-hidden="true" />
            {t("panel.whatsapp.anadirMotivo")}
          </BotonPrincipal>
        }
      >
        {value.motivos.length === 0 && (
          <p className="text-sm text-fcvt-gray">
            {t("panel.whatsapp.vacioMotivos")}
          </p>
        )}

        <ul className="space-y-5">
          {value.motivos.map((motivo, i) => {
            const enlace = waLink(conValores(motivo.texto), value.numero.trim());

            return (
              <li key={motivo.id}>
                <Subtitulo
                  accion={
                    <BotonSecundario
                      onClick={() => quitarMotivo(motivo.id)}
                      etiqueta={t("panel.whatsapp.borrarMotivo", { n: i + 1 })}
                    >
                      <i className="fa-solid fa-trash" aria-hidden="true" />
                      {t("panel.comunes.borrar")}
                    </BotonSecundario>
                  }
                >
                  {t("panel.whatsapp.motivo", { n: i + 1 })}
                </Subtitulo>

                <div className="mt-3 space-y-4">
                  <Campo
                    etiqueta={t("panel.whatsapp.motivoNombre")}
                    valor={motivo.etiqueta}
                    onChange={(nuevo) => cambiarMotivo(motivo.id, "etiqueta", nuevo)}
                    placeholder={t("panel.whatsapp.motivoPlaceholder")}
                    ayuda={t("panel.whatsapp.motivoAyuda")}
                  />
                  <Campo
                    etiqueta={t("panel.whatsapp.mensaje")}
                    multilinea
                    filas={4}
                    valor={motivo.texto}
                    onChange={(nuevo) => cambiarMotivo(motivo.id, "texto", nuevo)}
                    ayuda={t("panel.whatsapp.mensajeAyuda")}
                  />

                  <details className="rounded-lg bg-fcvt-white p-3 ring-1 ring-fcvt-lighter dark:bg-white/5 dark:ring-white/10">
                    <summary className="cursor-pointer text-xs font-bold uppercase tracking-wider text-fcvt-gray">
                      {t("panel.whatsapp.preview")}
                    </summary>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-fcvt-dark dark:text-fcvt-dark">
                      {conValores(motivo.texto) || t("panel.whatsapp.vacio")}
                    </p>
                    <p className="mt-2 break-all font-mono text-xs text-fcvt-gray">
                      {enlace}
                    </p>
                  </details>
                </div>
              </li>
            );
          })}
        </ul>
      </Tarjeta>
    </div>
  );
}