import { ICONO_SERVICIO, nuevoId } from "./datos.js";
import {
  BotonPrincipal,
  BotonSecundario,
  Campo,
  SelectorIcono,
  Subtitulo,
  Tarjeta,
} from "./comunes.jsx";

/**
 * Editor de la sección "Qué hacemos".
 *
 * Cada tarjeta es una fila: logo, título y descripción. Se pueden añadir y
 * quitar filas, y si el logo se deja vacío se dibuja el predeterminado del
 * sitio, que es el comportamiento que se pidió en vez de un hueco vacío.
 */
export default function ServiciosEditor({ value, onChange }) {
  function cambiar(id, campo, nuevo) {
    onChange(value.map((fila) => (fila.id === id ? { ...fila, [campo]: nuevo } : fila)));
  }

  function anadir() {
    onChange([...value, { id: nuevoId(), icono: "", titulo: "", descripcion: "" }]);
  }

  function quitar(id) {
    onChange(value.filter((fila) => fila.id !== id));
  }

  return (
    <div className="space-y-5">
      <Tarjeta
        titulo={`Tarjetas de "Qué hacemos" (${value.length})`}
        accion={
          <BotonPrincipal onClick={anadir}>
            <i className="fa-solid fa-plus" aria-hidden="true" />
            Añadir tarjeta
          </BotonPrincipal>
        }
      >
        {value.length === 0 && (
          <p className="text-sm text-fcvt-gray">
            No hay tarjetas. La sección quedaría vacía en la portada.
          </p>
        )}

        <ul className="space-y-5">
          {value.map((fila, i) => (
            <li key={fila.id}>
              <Subtitulo
                accion={
                  <BotonSecundario onClick={() => quitar(fila.id)} etiqueta={`Borrar la tarjeta ${i + 1}`}>
                    <i className="fa-solid fa-trash" aria-hidden="true" />
                    Borrar
                  </BotonSecundario>
                }
              >
                Tarjeta {i + 1}
              </Subtitulo>

              <div className="mt-3 grid gap-4 lg:grid-cols-2">
                <SelectorIcono
                  etiqueta="Logo"
                  valor={fila.icono}
                  onChange={(nuevo) => cambiar(fila.id, "icono", nuevo)}
                  porDefecto={ICONO_SERVICIO}
                />

                <div className="space-y-4">
                  <Campo
                    etiqueta="Título"
                    valor={fila.titulo}
                    onChange={(nuevo) => cambiar(fila.id, "titulo", nuevo)}
                    placeholder="Desarrollo web"
                  />
                  <Campo
                    etiqueta="Descripción"
                    multilinea
                    valor={fila.descripcion}
                    onChange={(nuevo) => cambiar(fila.id, "descripcion", nuevo)}
                    placeholder="Portales, intranets y sistemas de gestión a medida…"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Tarjeta>
    </div>
  );
}