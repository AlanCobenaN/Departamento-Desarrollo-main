import { useId, useState } from "react";
import { useSite } from "../contexts/SiteContext.jsx";
import { ICONOS } from "./datos.js";

/**
 * Piezas de formulario que repiten todos los editores del panel.
 *
 * Van en su propio archivo y no en uno por editor porque los campos de texto,
 * el selector de iconos y el de imagen se usan en casi todas las secciones: si
 * cada editor deflara sus propias clases, un cambio de estilo habria que
 * repetirlo seis veces.
 */

/* Clases compartidas. Se declaran aqui para que las seis secciones se vean
   igual sin depender de clases del sitio que estan pensadas para el publico. */
const INPUT =
  "w-full rounded-lg border border-fcvt-lighter bg-fcvt-white px-3.5 py-2.5 text-sm text-fcvt-dark placeholder:text-fcvt-gray/60 focus:border-fcvt-primary focus:outline-none dark:bg-white/5";
const ETIQUETA = "block text-xs font-bold uppercase tracking-wider text-fcvt-gray";
const TARJETA =
  "rounded-xl bg-fcvt-light p-5 ring-1 ring-fcvt-lighter dark:bg-white/5 dark:ring-white/10";
const AVISO = "mt-1.5 text-xs text-fcvt-gray";

/** Botón principal: el que hace la acción de la tarjeta. */
export function BotonPrincipal({ onClick, children, tipo = "button", deshabilitado = false }) {
  return (
    <button
      type={tipo}
      onClick={onClick}
      disabled={deshabilitado}
      className="inline-flex items-center gap-2 rounded-lg bg-fcvt-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-fcvt-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

/** Botón secundario: quitar una fila,etc. Nunca la acción principal. */
export function BotonSecundario({ onClick, children, etiqueta }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={etiqueta}
      aria-label={etiqueta}
      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-fcvt-primary transition hover:bg-fcvt-primary/10 dark:text-fcvt-accent"
    >
      {children}
    </button>
  );
}

/**
 * Campo de texto o área de texto con su etiqueta.
 *
 * El `id` sale de useId y la etiqueta apunta a el con htmlFor: sin eso el
 * texto de la etiqueta no está ligado al campo y al leerlo con lector de
 * pantalla suena suelto. El mismo criterio se aplica en el resto del panel.
 */
export function Campo({
  etiqueta,
  valor,
  onChange,
  placeholder = "",
  multilinea = false,
  filas = 3,
  ayuda,
  tipo = "text",
  autoFoco = false,
}) {
  const id = useId();
  const idAyuda = `${id}-ayuda`;

  return (
    <div>
      <label htmlFor={id} className={ETIQUETA}>
        {etiqueta}
      </label>
      {multilinea ? (
        <textarea
          id={id}
          rows={filas}
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-describedby={ayuda ? idAyuda : undefined}
          className={`${INPUT} mt-1.5 resize-y`}
        />
      ) : (
        <input
          id={id}
          type={tipo}
          value={valor}
          autoFocus={autoFoco}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-describedby={ayuda ? idAyuda : undefined}
          className={`${INPUT} mt-1.5`}
        />
      )}
      {ayuda && (
        <p id={idAyuda} className={AVISO}>
          {ayuda}
        </p>
      )}
    </div>
  );
}

/**
 * Selector de iconos de Font Awesome.
 *
 * Hay tres piezas a proposito:
 *   - la cuadrícula, que es la via segura porque todos esos nombres existen;
 *   - el campo de texto, por si alguien quiere uno que no esté en la lista;
 *   - el aviso cuando el nombre escrito no es de la lista, porque en ese caso
 *     el icono puede salir vacío y sin explicación, y eso parece un fallo del
 *     panel y no un nombre mal puesto.
 *
 * Si el campo se deja vacío se dibuja `porDefecto`: es el comportamiento que
 * se pidió, un hueco sin relleno no.
 */
export function SelectorIcono({ etiqueta, valor, onChange, porDefecto }) {
  const { t } = useSite();
  const id = useId();
  const limpio = typeof valor === "string" ? valor.trim() : "";
  const desconocido = limpio !== "" && !ICONOS.includes(limpio);

  return (
    <fieldset>
      <legend className={ETIQUETA}>{etiqueta}</legend>

      <div className="mt-1.5 flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-fcvt-primary/10 text-lg text-fcvt-primary dark:bg-white/10 dark:text-fcvt-accent">
          <i className={limpio || porDefecto} aria-hidden="true" />
        </span>
        <input
          id={id}
          type="text"
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          placeholder={porDefecto}
          aria-describedby={`${id}-estado`}
          className={`${INPUT} font-mono text-xs`}
        />
      </div>

      <p id={`${id}-estado`} className={AVISO}>
        {limpio === "" ? (
          t("panel.comunes.iconoVacio")
        ) : desconocido ? (
          <span className="text-amber-700 dark:text-amber-300">
            {t("panel.comunes.iconoDesconocido")}
          </span>
        ) : (
          <span className="font-mono">{limpio}</span>
        )}
      </p>

      <div className="mt-2 max-h-44 overflow-y-auto rounded-lg border border-fcvt-lighter bg-fcvt-white p-2 dark:border-white/10 dark:bg-white/5">
        <div className="grid grid-cols-8 gap-1 sm:grid-cols-10">
          {ICONOS.map((icono) => (
            <button
              key={icono}
              type="button"
              onClick={() => onChange(icono)}
              aria-pressed={limpio === icono}
              title={icono}
              className={`flex aspect-square items-center justify-center rounded-md text-sm transition ${
                limpio === icono
                  ? "bg-fcvt-primary text-white"
                  : "text-fcvt-dark hover:bg-fcvt-primary/10 dark:text-fcvt-dark"
              }`}
            >
              <i className={icono} aria-hidden="true" />
              <span className="sr-only">{icono}</span>
            </button>
          ))}
        </div>
      </div>
    </fieldset>
  );
}

/**
 * Campo de imagen: subir un archivo o pegar una ruta, con vista previa.
 *
 * Al elegir un archivo se lee en memoria como data URL para poder enseñar la
 * vista previa al instante. No se sube nada a ningun sitio: es lo que hace de
 * esto un prototipo. Un archivo enorme pesa en memoria, asi que se avisa.
 *
 * Si no hay nada puesto se enseña el icono por defecto, para que se vea de
 * entrada lo que veria el visitante.
 */
export function CampoImagen({ etiqueta, valor, onChange, iconoPorDefecto = "fa-solid fa-image" }) {
  const { t } = useSite();
  const id = useId();
  const idEstado = `${id}-estado`;
  // Se guarda la clave, no el texto, para que el aviso cambie de idioma.
  const [error, setError] = useState("");

  function elegirArchivo(evento) {
    const archivo = evento.target.files?.[0];
    // Vaciamos el input para que elegir dos veces el mismo archivo despierte
    // el evento y no parezca que el campo no responde.
    evento.target.value = "";
    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
      setError("panel.comunes.errorTipoImagen");
      return;
    }

    const lector = new FileReader();
    lector.onload = () => {
      onChange(String(lector.result));
      setError("");
    };
    lector.onerror = () => setError("panel.comunes.errorLectura");
    lector.readAsDataURL(archivo);
  }

  return (
    <div>
      <label htmlFor={id} className={ETIQUETA}>
        {etiqueta}
      </label>

      <div className="mt-1.5 flex flex-wrap items-start gap-4">
        <div className="flex h-28 w-40 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-fcvt-white ring-1 ring-fcvt-lighter dark:bg-white/5 dark:ring-white/10">
          {valor ? (
            <img src={valor} alt="" className="h-full w-full object-cover" />
          ) : (
            <i className={`${iconoPorDefecto} text-2xl text-fcvt-gray/50`} aria-hidden="true" />
          )}
        </div>

        <div className="min-w-52 flex-1 space-y-2">
          <input
            id={id}
            type="file"
            accept="image/*"
            onChange={elegirArchivo}
            className="block w-full text-xs text-fcvt-gray file:mr-3 file:rounded-lg file:border-0 file:bg-fcvt-primary file:px-3 file:py-2 file:text-xs file:font-bold file:text-white"
          />
          <input
            type="text"
            value={valor && valor.startsWith("data:") ? "" : valor}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t("panel.comunes.rutaPlaceholder")}
            aria-label={t("panel.comunes.rutaAria", { campo: etiqueta.toLowerCase() })}
            className={`${INPUT} text-xs`}
          />
          {valor && (
            <BotonSecundario
              onClick={() => onChange("")}
              etiqueta={t("panel.comunes.quitarImagenAria", {
                campo: etiqueta.toLowerCase(),
              })}
            >
              <i className="fa-solid fa-xmark" aria-hidden="true" />
              {t("panel.comunes.quitar")}
            </BotonSecundario>
          )}
        </div>
      </div>

      {/* role="alert" solo cuando hay error: el aviso sale al elegir el archivo y,
          si no se anuncia, aparece en un rincon que el lector de pantalla no
          recorre justo mientras el usuario esta mirando a otro lado. */}
      <p
        id={idEstado}
        role={error ? "alert" : undefined}
        className={error ? "mt-1.5 text-xs text-amber-700 dark:text-amber-300" : AVISO}
      >
        {error ? t(error) : t("panel.comunes.sinFoto")}
      </p>
    </div>
  );
}

/**
 * Lista de etiquetas editables: se añaden, se renombran y se borran.
 *
 * No es una lista de cadenas con onChange porque el renombrado tiene que
 * llegar al resto del panel: si una etiqueta se llama "PostgreSQL" y un
 * proyecto pone "postgres", al renombrarla el proyecto se queda con un texto
 * que ya no existe en la lista. Por eso se avisa de los tres gestos por
 * separado (anadir, renombrar, borrar) en vez de entregar solo el array final,
 * que no dice cual de los dos cambios fue.
 */
export function ListaEtiquetas({
  etiqueta,
  valores,
  onAnadir,
  onRenombrar,
  onBorrar,
  ayuda,
  marcador,
}) {
  const { t } = useSite();
  const [nuevo, setNuevo] = useState("");

  function anadir(evento) {
    evento.preventDefault();
    const limpio = nuevo.trim();
    setNuevo("");
    if (limpio && !valores.includes(limpio)) onAnadir(limpio);
  }

  return (
    <div>
      <p className={ETIQUETA}>{etiqueta}</p>

      <ul className="mt-2 space-y-2">
        {valores.map((valor, i) => (
          <li key={`${valor}-${i}`} className="flex items-center gap-2">
            <input
              type="text"
              value={valor}
              onChange={(e) => onRenombrar(i, e.target.value)}
              className={`${INPUT} py-2`}
              aria-label={t("panel.comunes.etiquetaAria", { lista: etiqueta, n: i + 1 })}
            />
            <BotonSecundario
              onClick={() => onBorrar(i)}
              etiqueta={t("panel.comunes.borrarEtiqueta", { valor })}
            >
              <i className="fa-solid fa-trash" aria-hidden="true" />
            </BotonSecundario>
          </li>
        ))}
        {valores.length === 0 && (
          <li className={AVISO}>{t("panel.comunes.sinEtiquetas")}</li>
        )}
      </ul>

      <form onSubmit={anadir} className="mt-3 flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={nuevo}
          onChange={(e) => setNuevo(e.target.value)}
          placeholder={marcador ?? t("panel.comunes.etiquetaPlaceholder")}
          aria-label={t("panel.comunes.anadirEtiqueta", { lista: etiqueta })}
          className={`${INPUT} w-48 py-2`}
        />
        <BotonSecundario
          onClick={anadir}
          etiqueta={t("panel.comunes.anadirEtiqueta", { lista: etiqueta })}
        >
          <i className="fa-solid fa-plus" aria-hidden="true" />
          {t("panel.comunes.anadir")}
        </BotonSecundario>
      </form>

      {ayuda && <p className={AVISO}>{ayuda}</p>}
    </div>
  );
}

/**
 * Grupo de pastillas para elegir una o varias cosas a la vez.
 *
 * Copia el aspecto del filtro de categorías del sitio, a propósito: si el
 * panel se ve como otra página distinta, las decisiones que se toman en él
 * no sirven de referencia para la portada. `aria-pressed` y no `aria-selected`
 * porque no es una lista de opciones del menú, son botones que se activan.
 */
export function Pastillas({ opciones, seleccionados, onAlternar, vacio }) {
  const { t } = useSite();
  if (opciones.length === 0)
    return <p className={AVISO}>{vacio ?? t("panel.comunes.sinOpciones")}</p>;

  return (
    <ul className="mt-1.5 flex flex-wrap gap-2">
      {opciones.map((opcion) => {
        const activa = seleccionados.includes(opcion);
        return (
          <li key={opcion}>
            <button
              type="button"
              onClick={() => onAlternar(opcion)}
              aria-pressed={activa}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                activa
                  ? "bg-fcvt-primary text-white dark:bg-fcvt-darker"
                  : "bg-fcvt-lighter text-fcvt-gray hover:text-fcvt-primary dark:bg-white/10 dark:text-fcvt-gray"
              }`}
            >
              {opcion}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** Tarjeta con encabezado y acción a la derecha. */
export function Tarjeta({ titulo, children, accion }) {
  return (
    <section className={TARJETA}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-fcvt-dark dark:text-fcvt-dark">
          {titulo}
        </h3>
        {accion}
      </div>
      {children}
    </section>
  );
}

/**
 * Separador con un rótulo y, a la derecha, la acción del grupo.
 *
 * El botón va fuera del `h4` a propósito: el encabezado queda limpio para el
 * índice de encabezados que leen los lectores de pantalla, y el flex de la
 * fila coloca la acción donde se espera sin depender de flotar nada.
 */
export function Subtitulo({ children, accion }) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-fcvt-lighter pt-4 first:mt-0 first:border-0 first:pt-0 dark:border-white/10">
      <h4 className="text-sm font-bold text-fcvt-gray">{children}</h4>
      {accion}
    </div>
  );
}