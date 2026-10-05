import { nuevoId } from "./datos.js";
import {
  BotonPrincipal,
  BotonSecundario,
  Campo,
  CampoImagen,
  ListaEtiquetas,
  Pastillas,
  Subtitulo,
  Tarjeta,
} from "./comunes.jsx";

/**
 * Editor de "Proyectos en desarrollo" y de las etiquetas que los clasifican.
 *
 * Es la sección más enrevesada del panel porque las etiquetas no son un dato
 * suelto: son las que rellenan el filtro de la portada. Si se renombra
 * "PostgreSQL" y un proyecto guardó "postgres", el proyecto se queda con un
 * texto que ya no sale en el filtro y desaparece de la vista. Por eso aquí
 * renombrar o borrar una etiqueta propaga el cambio a los proyectos que la
 * usan, en vez de dejar datos huérfanos.
 */
export default function ProyectosEditor({ value, onChange }) {
  const { proyectos, categorias, etiquetasTecnologia } = value;

  function actualizarProyectos(nuevos) {
    onChange({ ...value, proyectos: nuevos });
  }

  function cambiar(id, campo, nuevo) {
    actualizarProyectos(proyectos.map((p) => (p.id === id ? { ...p, [campo]: nuevo } : p)));
  }

  function anadirProyecto() {
    actualizarProyectos([
      ...proyectos,
      {
        id: nuevoId(),
        nombre: "",
        descripcion: "",
        categoria: categorias[0] ?? "",
        tecnologias: [],
        foto: "",
      },
    ]);
  }

  function quitarProyecto(id) {
    actualizarProyectos(proyectos.filter((p) => p.id !== id));
  }

  function elegirCategoria(id, categoria) {
    cambiar(id, "categoria", categoria);
  }

  function alternarTecnologia(id, etiqueta) {
    actualizarProyectos(
      proyectos.map((p) => {
        if (p.id !== id) return p;
        const dentro = p.tecnologias.includes(etiqueta);
        return {
          ...p,
          tecnologias: dentro
            ? p.tecnologias.filter((t) => t !== etiqueta)
            : [...p.tecnologias, etiqueta],
        };
      }),
    );
  }

  // ---------- Etiquetas de categoría ----------

  function anadirCategoria(texto) {
    onChange({ ...value, categorias: [...categorias, texto] });
  }

  function renombrarCategoria(indice, texto) {
    const antes = categorias[indice];
    const despues = [...categorias];
    despues[indice] = texto;

    onChange({
      ...value,
      categorias: despues,
      proyectos:
        antes && antes !== texto
          ? proyectos.map((p) => (p.categoria === antes ? { ...p, categoria: texto } : p))
          : proyectos,
    });
  }

  function borrarCategoria(indice) {
    const borrada = categorias[indice];
    onChange({
      ...value,
      categorias: categorias.filter((_, i) => i !== indice),
      // Un proyecto sin categoría se queda sin ella antes que con una
      // categoría que ya no existe en el filtro.
      proyectos: proyectos.map((p) =>
        p.categoria === borrada ? { ...p, categoria: "" } : p,
      ),
    });
  }

  // ---------- Etiquetas de tecnología ----------

  function anadirTecnologia(texto) {
    onChange({ ...value, etiquetasTecnologia: [...etiquetasTecnologia, texto] });
  }

  function renombrarTecnologia(indice, texto) {
    const antes = etiquetasTecnologia[indice];
    const despues = [...etiquetasTecnologia];
    despues[indice] = texto;

    onChange({
      ...value,
      etiquetasTecnologia: despues,
      proyectos:
        antes && antes !== texto
          ? proyectos.map((p) =>
              p.tecnologias.includes(antes)
                ? { ...p, tecnologias: p.tecnologias.map((t) => (t === antes ? texto : t)) }
                : p,
            )
          : proyectos,
    });
  }

  function borrarTecnologia(indice) {
    const borrada = etiquetasTecnologia[indice];
    onChange({
      ...value,
      etiquetasTecnologia: etiquetasTecnologia.filter((_, i) => i !== indice),
      proyectos: proyectos.map((p) =>
        p.tecnologias.includes(borrada)
          ? { ...p, tecnologias: p.tecnologias.filter((t) => t !== borrada) }
          : p,
      ),
    });
  }

  return (
    <div className="space-y-5">
      <Tarjeta
        titulo={`Proyectos (${proyectos.length})`}
        accion={
          <BotonPrincipal onClick={anadirProyecto}>
            <i className="fa-solid fa-plus" aria-hidden="true" />
            Añadir proyecto
          </BotonPrincipal>
        }
      >
        {proyectos.length === 0 && (
          <p className="text-sm text-fcvt-gray">
            No hay proyectos. La sección de la portada saldría vacía.
          </p>
        )}

        <ul className="space-y-6">
          {proyectos.map((proyecto, i) => {
            // Etiquetas que el proyecto usa pero que ya no están en la lista.
            // Se avisan en vez de borrarlas solas: puede que la etiqueta se
            // haya borrado sin querer y el dato del proyecto siga siendo bueno.
            const huerfanas = proyecto.tecnologias.filter((t) => !etiquetasTecnologia.includes(t));

            return (
              <li key={proyecto.id}>
                <Subtitulo
                  accion={
                    <BotonSecundario
                      onClick={() => quitarProyecto(proyecto.id)}
                      etiqueta={`Borrar el proyecto ${i + 1}`}
                    >
                      <i className="fa-solid fa-trash" aria-hidden="true" />
                      Borrar
                    </BotonSecundario>
                  }
                >
                  Proyecto {i + 1}
                </Subtitulo>

                <div className="mt-3 space-y-4">
                  <CampoImagen
                    etiqueta="Foto"
                    valor={proyecto.foto}
                    onChange={(nuevo) => cambiar(proyecto.id, "foto", nuevo)}
                  />

                  <Campo
                    etiqueta="Nombre"
                    valor={proyecto.nombre}
                    onChange={(nuevo) => cambiar(proyecto.id, "nombre", nuevo)}
                    placeholder="Portal de Servicios Digitales"
                  />

                  <Campo
                    etiqueta="Descripción"
                    multilinea
                    valor={proyecto.descripcion}
                    onChange={(nuevo) => cambiar(proyecto.id, "descripcion", nuevo)}
                    placeholder="Qué hace el proyecto y para quién."
                  />

                  <div>
                    <p className="block text-xs font-bold uppercase tracking-wider text-fcvt-gray">
                      Etiqueta de categoría
                    </p>
                    <Pastillas
                      opciones={categorias}
                      seleccionados={proyecto.categoria ? [proyecto.categoria] : []}
                      onAlternar={(elegida) =>
                        elegirCategoria(
                          proyecto.id,
                          elegida === proyecto.categoria ? "" : elegida,
                        )
                      }
                      vacio="No hay etiquetas de categoría. Añádelas abajo."
                    />
                  </div>

                  <div>
                    <p className="block text-xs font-bold uppercase tracking-wider text-fcvt-gray">
                      Etiquetas de tecnología
                    </p>
                    <Pastillas
                      opciones={etiquetasTecnologia}
                      seleccionados={proyecto.tecnologias}
                      onAlternar={(elegida) => alternarTecnologia(proyecto.id, elegida)}
                      vacio="No hay etiquetas de tecnología. Añádelas abajo."
                    />

                    {huerfanas.length > 0 && (
                      <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
                        Usa etiquetas que no están en la lista:{" "}
                        {huerfanas.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => alternarTecnologia(proyecto.id, t)}
                            title={`Quitar ${t} de este proyecto`}
                            className="mr-1.5 rounded-full bg-fcvt-lighter px-2 py-0.5 font-bold dark:bg-white/10"
                          >
                            {t} <i className="fa-solid fa-xmark" aria-hidden="true" />
                          </button>
                        ))}
                        . Añádelas a la lista de abajo o quítalas del proyecto.
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Tarjeta>

      <div className="grid gap-5 lg:grid-cols-2">
        <Tarjeta titulo="Etiquetas de categoría">
          <ListaEtiquetas
            etiqueta="Categorías"
            valores={categorias}
            onAnadir={anadirCategoria}
            onRenombrar={renombrarCategoria}
            onBorrar={borrarCategoria}
            marcador="Educación"
            ayuda="Al renombrar o borrar una categoría se corrigen los proyectos que la usan."
          />
        </Tarjeta>

        <Tarjeta titulo="Etiquetas de tecnología">
          <ListaEtiquetas
            etiqueta="Tecnologías"
            valores={etiquetasTecnologia}
            onAnadir={anadirTecnologia}
            onRenombrar={renombrarTecnologia}
            onBorrar={borrarTecnologia}
            marcador="React"
            ayuda="Al renombrar o borrar una tecnología se corrigen los proyectos que la usan."
          />
        </Tarjeta>
      </div>
    </div>
  );
}