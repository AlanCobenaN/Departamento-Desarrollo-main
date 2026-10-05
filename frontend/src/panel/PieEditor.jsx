import { nuevoId } from "./datos.js";
import {
  BotonPrincipal,
  BotonSecundario,
  Campo,
  ListaEtiquetas,
  SelectorIcono,
  Subtitulo,
  Tarjeta,
} from "./comunes.jsx";

/**
 * Icono que se usa cuando una red no trae ninguno. El pie dibuja el icono
 * igual, solo que desactivado, así que un hueco aquí no se nota en la portada.
 */
const ICONO_RED = "fa-solid fa-link";

/** True mientras el enlace no sea una dirección real de la web. */
function enlaceReal(url) {
  return typeof url === "string" && /^https?:\/\/\S+$/i.test(url.trim());
}

/**
 * Editor del pie de página: contacto, redes y enlaces de "Explorar".
 *
 * El aviso de los enlaces que no son reales no es decoración: el pie ya
 * desactiva esos iconos en vez de mandar a la portada de la red, que es un
 * detalle fácil de no saber al rellenar el panel.
 */
export default function PieEditor({ value, onChange }) {
  function cambiarCampo(campo, nuevo) {
    onChange({ ...value, [campo]: nuevo });
  }

  function cambiarRed(id, campo, nuevo) {
    onChange({
      ...value,
      redes: value.redes.map((r) => (r.id === id ? { ...r, [campo]: nuevo } : r)),
    });
  }

  function anadirRed() {
    onChange({
      ...value,
      redes: [...value.redes, { id: nuevoId(), icono: "", etiqueta: "", url: "" }],
    });
  }

  function quitarRed(id) {
    onChange({ ...value, redes: value.redes.filter((r) => r.id !== id) });
  }

  function cambiarEnlace(id, campo, nuevo) {
    onChange({
      ...value,
      explorar: value.explorar.map((e) => (e.id === id ? { ...e, [campo]: nuevo } : e)),
    });
  }

  function quitarEnlace(id) {
    onChange({ ...value, explorar: value.explorar.filter((e) => e.id !== id) });
  }

  return (
    <div className="space-y-5">
      <Tarjeta titulo="Datos de contacto">
        <div className="grid gap-4 lg:grid-cols-3">
          <Campo
            etiqueta="Correo"
            valor={value.email}
            onChange={(nuevo) => cambiarCampo("email", nuevo)}
            placeholder="correo@ejemplo.com"
          />
          <Campo
            etiqueta="Teléfono"
            valor={value.telefono}
            onChange={(nuevo) => cambiarCampo("telefono", nuevo)}
            placeholder="+000 000-0000"
          />
          <Campo
            etiqueta="Ubicación"
            valor={value.ubicacion}
            onChange={(nuevo) => cambiarCampo("ubicacion", nuevo)}
            placeholder="Manta, Manabí, Ecuador"
          />
        </div>
      </Tarjeta>

      <Tarjeta titulo="Síguenos">
        <ul className="space-y-5">
          {value.redes.map((red, i) => (
            <li key={red.id}>
              <Subtitulo
                accion={
                  <BotonSecundario onClick={() => quitarRed(red.id)} etiqueta={`Borrar la red ${i + 1}`}>
                    <i className="fa-solid fa-trash" aria-hidden="true" />
                    Borrar
                  </BotonSecundario>
                }
              >
                Red {i + 1}
              </Subtitulo>

              <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_1fr_1.4fr]">
                <SelectorIcono
                  etiqueta="Icono"
                  valor={red.icono}
                  onChange={(nuevo) => cambiarRed(red.id, "icono", nuevo)}
                  porDefecto={ICONO_RED}
                />
                <Campo
                  etiqueta="Nombre"
                  valor={red.etiqueta}
                  onChange={(nuevo) => cambiarRed(red.id, "etiqueta", nuevo)}
                  placeholder="Instagram"
                />
                <Campo
                  etiqueta="Dirección"
                  valor={red.url}
                  onChange={(nuevo) => cambiarRed(red.id, "url", nuevo)}
                  placeholder="https://instagram.com/…"
                  ayuda={
                    enlaceReal(red.url)
                      ? "Enlace real: el icono se vera activo."
                      : "Sin dirección el icono sale desactivado en el pie, no lleva a la portada de la red."
                  }
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-5">
          <BotonPrincipal onClick={anadirRed}>
            <i className="fa-solid fa-plus" aria-hidden="true" />
            Añadir red
          </BotonPrincipal>
        </div>
      </Tarjeta>

      <Tarjeta titulo="Explorar">
        <ListaEtiquetas
          etiqueta="Enlaces del pie"
          valores={value.explorar.map((e) => e.etiqueta)}
          onAnadir={(texto) =>
            onChange({
              ...value,
              explorar: [...value.explorar, { id: nuevoId(), etiqueta: texto, href: "" }],
            })
          }
          onRenombrar={(indice, texto) => cambiarEnlace(value.explorar[indice].id, "etiqueta", texto)}
          onBorrar={(indice) => quitarEnlace(value.explorar[indice].id)}
          marcador="Nombre del enlace"
          ayuda="Los destinos se editan abajo, uno por enlace."
        />

        <ul className="mt-4 space-y-2 border-t border-fcvt-lighter pt-4 dark:border-white/10">
          {value.explorar.map((enlace, i) => (
            <li key={enlace.id}>
              <label className="block text-xs font-bold uppercase tracking-wider text-fcvt-gray">
                Destino de "{enlace.etiqueta || `enlace ${i + 1}`}"
              </label>
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  type="text"
                  value={enlace.href}
                  onChange={(e) => cambiarEnlace(enlace.id, "href", e.target.value)}
                  placeholder="#proyectos"
                  className="w-full rounded-lg border border-fcvt-lighter bg-fcvt-white px-3.5 py-2 text-sm text-fcvt-dark focus:border-fcvt-primary focus:outline-none dark:bg-white/5"
                />
                <BotonSecundario
                  onClick={() => quitarEnlace(enlace.id)}
                  etiqueta={`Borrar el enlace ${enlace.etiqueta || i + 1}`}
                >
                  <i className="fa-solid fa-trash" aria-hidden="true" />
                </BotonSecundario>
              </div>
            </li>
          ))}
        </ul>
      </Tarjeta>
    </div>
  );
}