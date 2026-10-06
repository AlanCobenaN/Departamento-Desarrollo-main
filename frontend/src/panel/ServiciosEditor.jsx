import { useSite } from "../contexts/SiteContext.jsx";
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
  const { t } = useSite();

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
        titulo={t("panel.servicios.titulo", { n: value.length })}
        accion={
          <BotonPrincipal onClick={anadir}>
            <i className="fa-solid fa-plus" aria-hidden="true" />
            {t("panel.servicios.anadir")}
          </BotonPrincipal>
        }
      >
        {value.length === 0 && (
          <p className="text-sm text-fcvt-gray">
            {t("panel.servicios.vacio")}
          </p>
        )}

        <ul className="space-y-5">
          {value.map((fila, i) => (
            <li key={fila.id}>
              <Subtitulo
                accion={
                  <BotonSecundario
                    onClick={() => quitar(fila.id)}
                    etiqueta={t("panel.servicios.borrarTitulo", { n: i + 1 })}
                  >
                    <i className="fa-solid fa-trash" aria-hidden="true" />
                    {t("panel.comunes.borrar")}
                  </BotonSecundario>
                }
              >
                {t("panel.servicios.fila", { n: i + 1 })}
              </Subtitulo>

              <div className="mt-3 grid gap-4 lg:grid-cols-2">
                <SelectorIcono
                  etiqueta={t("panel.comunes.logo")}
                  valor={fila.icono}
                  onChange={(nuevo) => cambiar(fila.id, "icono", nuevo)}
                  porDefecto={ICONO_SERVICIO}
                />

                <div className="space-y-4">
                  <Campo
                    etiqueta={t("panel.comunes.titulo")}
                    valor={fila.titulo}
                    onChange={(nuevo) => cambiar(fila.id, "titulo", nuevo)}
                    placeholder={t("panel.servicios.tituloPlaceholder")}
                  />
                  <Campo
                    etiqueta={t("panel.comunes.descripcion")}
                    multilinea
                    valor={fila.descripcion}
                    onChange={(nuevo) => cambiar(fila.id, "descripcion", nuevo)}
                    placeholder={t("panel.servicios.descripcionPlaceholder")}
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