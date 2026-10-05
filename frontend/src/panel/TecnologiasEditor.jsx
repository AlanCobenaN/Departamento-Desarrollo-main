import { ICONO_TECNOLOGIA, nuevoId } from "./datos.js";
import {
  BotonPrincipal,
  BotonSecundario,
  Campo,
  SelectorIcono,
  Subtitulo,
  Tarjeta,
} from "./comunes.jsx";

/**
 * Editor de la banda de tecnologías (el anillo 3D de la portada).
 *
 * Se editan el nombre y el logo. El orden importa en el sitio, porque el anillo
 * reparte los elementos en 360/N grados, pero aquí las filas ya están en su
 * orden: para reordenarlas hay que borrarlas y volver a añadirlas.
 */
export default function TecnologiasEditor({ value, onChange }) {
  function cambiar(id, campo, nuevo) {
    onChange(value.map((fila) => (fila.id === id ? { ...fila, [campo]: nuevo } : fila)));
  }

  function anadir() {
    onChange([...value, { id: nuevoId(), icono: "", nombre: "" }]);
  }

  function quitar(id) {
    onChange(value.filter((fila) => fila.id !== id));
  }

  return (
    <Tarjeta
      titulo={`Tecnologías (${value.length})`}
      accion={
        <BotonPrincipal onClick={anadir}>
          <i className="fa-solid fa-plus" aria-hidden="true" />
          Añadir tecnología
        </BotonPrincipal>
      }
    >
      {value.length === 0 && (
        <p className="text-sm text-fcvt-gray">
          Sin tecnologías el anillo 3D no tiene nada que mostrar.
        </p>
      )}

      <ul className="space-y-5">
        {value.map((fila, i) => (
          <li key={fila.id}>
            <Subtitulo
              accion={
                <BotonSecundario onClick={() => quitar(fila.id)} etiqueta={`Borrar la tecnología ${i + 1}`}>
                  <i className="fa-solid fa-trash" aria-hidden="true" />
                  Borrar
                </BotonSecundario>
              }
            >
              Tecnología {i + 1}
            </Subtitulo>

            <div className="mt-3 grid gap-4 lg:grid-cols-2">
              <SelectorIcono
                etiqueta="Logo"
                valor={fila.icono}
                onChange={(nuevo) => cambiar(fila.id, "icono", nuevo)}
                porDefecto={ICONO_TECNOLOGIA}
              />
              <Campo
                etiqueta="Nombre"
                valor={fila.nombre}
                onChange={(nuevo) => cambiar(fila.id, "nombre", nuevo)}
                placeholder="React"
                ayuda="Es el texto que se lee bajo el icono en el anillo."
              />
            </div>
          </li>
        ))}
      </ul>
    </Tarjeta>
  );
}