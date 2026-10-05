import { nuevoId } from "./datos.js";
import {
  BotonPrincipal,
  BotonSecundario,
  Campo,
  CampoImagen,
  Subtitulo,
  Tarjeta,
} from "./comunes.jsx";

/**
 * Editor de la galería.
 *
 * Cada foto lleva un título, que es lo que se ve debajo al abrirla. El título
 * no es opcional de facto: sin él la galería enseña una imagen sin ninguna
 * palabra, que es justo lo que hace que un sitio parezca sin terminar.
 */
export default function GaleriaEditor({ value, onChange }) {
  function cambiar(id, campo, nuevo) {
    onChange(value.map((fila) => (fila.id === id ? { ...fila, [campo]: nuevo } : fila)));
  }

  function anadir() {
    onChange([...value, { id: nuevoId(), titulo: "", foto: "" }]);
  }

  function quitar(id) {
    onChange(value.filter((fila) => fila.id !== id));
  }

  return (
    <Tarjeta
      titulo={`Fotos de la galería (${value.length})`}
      accion={
        <BotonPrincipal onClick={anadir}>
          <i className="fa-solid fa-plus" aria-hidden="true" />
          Añadir foto
        </BotonPrincipal>
      }
    >
      {value.length === 0 && (
        <p className="text-sm text-fcvt-gray">
          No hay fotos. La galería quedaría vacía.
        </p>
      )}

      <ul className="grid gap-5 sm:grid-cols-2">
        {value.map((fila, i) => (
          <li key={fila.id}>
            <Subtitulo
              accion={
                <BotonSecundario onClick={() => quitar(fila.id)} etiqueta={`Borrar la foto ${i + 1}`}>
                  <i className="fa-solid fa-trash" aria-hidden="true" />
                  Borrar
                </BotonSecundario>
              }
            >
              Foto {i + 1}
            </Subtitulo>

            <div className="mt-3 space-y-4">
              <CampoImagen
                etiqueta="Foto"
                valor={fila.foto}
                onChange={(nuevo) => cambiar(fila.id, "foto", nuevo)}
              />
              <Campo
                etiqueta="Título"
                valor={fila.titulo}
                onChange={(nuevo) => cambiar(fila.id, "titulo", nuevo)}
                placeholder="Panel general"
                ayuda="Es el texto que se ve al abrir la foto."
              />
            </div>
          </li>
        ))}
      </ul>
    </Tarjeta>
  );
}