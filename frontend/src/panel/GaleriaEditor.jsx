import { useSite } from "../contexts/SiteContext.jsx";
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
  const { t } = useSite();

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
      titulo={t("panel.galeria.titulo", { n: value.length })}
      accion={
        <BotonPrincipal onClick={anadir}>
          <i className="fa-solid fa-plus" aria-hidden="true" />
          {t("panel.galeria.anadir")}
        </BotonPrincipal>
      }
    >
      {value.length === 0 && (
        <p className="text-sm text-fcvt-gray">
          {t("panel.galeria.vacio")}
        </p>
      )}

      <ul className="grid gap-5 sm:grid-cols-2">
        {value.map((fila, i) => (
          <li key={fila.id}>
            <Subtitulo
              accion={
                <BotonSecundario
                  onClick={() => quitar(fila.id)}
                  etiqueta={t("panel.galeria.borrarTitulo", { n: i + 1 })}
                >
                  <i className="fa-solid fa-trash" aria-hidden="true" />
                  {t("panel.comunes.borrar")}
                </BotonSecundario>
              }
            >
              {t("panel.galeria.fila", { n: i + 1 })}
            </Subtitulo>

            <div className="mt-3 space-y-4">
              <CampoImagen
                etiqueta={t("panel.comunes.foto")}
                valor={fila.foto}
                onChange={(nuevo) => cambiar(fila.id, "foto", nuevo)}
              />
              <Campo
                etiqueta={t("panel.comunes.titulo")}
                valor={fila.titulo}
                onChange={(nuevo) => cambiar(fila.id, "titulo", nuevo)}
                placeholder={t("panel.galeria.tituloPlaceholder")}
                ayuda={t("panel.galeria.tituloAyuda")}
              />
            </div>
          </li>
        ))}
      </ul>
    </Tarjeta>
  );
}