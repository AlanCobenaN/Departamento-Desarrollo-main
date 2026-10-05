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
      <Tarjeta titulo="Número y saludo">
        <div className="grid gap-4 lg:grid-cols-2">
          <Campo
            etiqueta="Número de WhatsApp"
            valor={value.numero}
            onChange={(nuevo) => cambiarCampo("numero", nuevo)}
            placeholder={WA_PLACEHOLDER}
            ayuda={
              esRelleno
                ? "Sigue siendo el número de relleno: el enlace abre WhatsApp pero no escribe a nadie."
                : soloDigitos
                  ? "Correcto: solo dígitos."
                  : "wa.me no acepta +, espacios ni guiones. Solo dígitos, con el prefijo del país (Ecuador: 5939XXXXXXXX)."
            }
          />
          <Campo
            etiqueta="Saludo del menú de navegación"
            valor={value.saludo}
            onChange={(nuevo) => cambiarCampo("saludo", nuevo)}
            placeholder="Hola, equipo. Escribo desde la página web."
            ayuda="Es el mensaje del botón de contacto del menú, que no pasa por el formulario."
          />
        </div>
      </Tarjeta>

      <Tarjeta
        titulo={`Motivos (${value.motivos.length})`}
        accion={
          <BotonPrincipal onClick={anadirMotivo}>
            <i className="fa-solid fa-plus" aria-hidden="true" />
            Añadir motivo
          </BotonPrincipal>
        }
      >
        {value.motivos.length === 0 && (
          <p className="text-sm text-fcvt-gray">
            Sin motivos el formulario se queda sin botones donde elegir.
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
                      etiqueta={`Borrar el motivo ${i + 1}`}
                    >
                      <i className="fa-solid fa-trash" aria-hidden="true" />
                      Borrar
                    </BotonSecundario>
                  }
                >
                  Motivo {i + 1}
                </Subtitulo>

                <div className="mt-3 space-y-4">
                  <Campo
                    etiqueta="Nombre del motivo"
                    valor={motivo.etiqueta}
                    onChange={(nuevo) => cambiarMotivo(motivo.id, "etiqueta", nuevo)}
                    placeholder="Un proyecto nuevo"
                    ayuda="Es el texto del botón. Si se deja vacío el motivo no se puede elegir."
                  />
                  <Campo
                    etiqueta="Mensaje"
                    multilinea
                    filas={4}
                    valor={motivo.texto}
                    onChange={(nuevo) => cambiarMotivo(motivo.id, "texto", nuevo)}
                    ayuda="Usa {nombre} y {mensaje} para saber dónde va cada cosa."
                  />

                  <details className="rounded-lg bg-fcvt-white p-3 ring-1 ring-fcvt-lighter dark:bg-white/5 dark:ring-white/10">
                    <summary className="cursor-pointer text-xs font-bold uppercase tracking-wider text-fcvt-gray">
                      Cómo quedaría el mensaje
                    </summary>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-fcvt-dark dark:text-fcvt-dark">
                      {conValores(motivo.texto) || "(vacío)"}
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