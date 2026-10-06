import { useEffect, useState } from "react";
import site from "../config/branding.js";
import { useSite } from "../contexts/SiteContext.jsx";
import AccessibilityMenu from "../components/AccessibilityMenu.jsx";
import { datosIniciales } from "../panel/datos.js";
import { BotonPrincipal, BotonSecundario } from "../panel/comunes.jsx";
import ServiciosEditor from "../panel/ServiciosEditor.jsx";
import TecnologiasEditor from "../panel/TecnologiasEditor.jsx";
import ProyectosEditor from "../panel/ProyectosEditor.jsx";
import GaleriaEditor from "../panel/GaleriaEditor.jsx";
import WhatsappEditor from "../panel/WhatsappEditor.jsx";
import PieEditor from "../panel/PieEditor.jsx";
import PermisosEditor from "../panel/PermisosEditor.jsx";
import { borrar, guardar, leer } from "../panel/almacen.js";

/** Las secciones del panel, en el orden en que se explican en la portada. */
const SECCIONES = [
  { id: "servicios", key: "panel.secciones.servicios", icono: "fa-solid fa-laptop-code" },
  { id: "tecnologias", key: "panel.secciones.tecnologias", icono: "fa-solid fa-code" },
  { id: "proyectos", key: "panel.secciones.proyectos", icono: "fa-solid fa-diagram-project" },
  { id: "galeria", key: "panel.secciones.galeria", icono: "fa-solid fa-images" },
  { id: "whatsapp", key: "panel.secciones.whatsapp", icono: "fa-brands fa-whatsapp" },
  { id: "pie", key: "panel.secciones.pie", icono: "fa-solid fa-address-book" },
  { id: "permisos", key: "panel.secciones.permisos", icono: "fa-solid fa-user-shield" },
];

/**
 * Panel de administración del sitio.
 *
 * PROTOTIPO. Deja cambiar todo lo que se edita aquí, pero nada se guarda: al
 * recargar la página vuelve todo a como estaba. El aviso del principio está en
 * la propia pantalla y no en un archivo de documentación, que es donde lo
 * miraría alguien.
 *
 * El estado vive aquí y no en cada editor a propósito: al cambiar de sección
 * los editores se desmontan, así que si cada uno guardara lo suyo, cambiar de
 * pestaña tiraría los cambios de largo.
 *
 * Los textos de interfaz pasan por t(); el contenido que se edita aquí no.
 */
export default function AdminPanel() {
  const { t, lang, toggleLang, dark, toggleTheme } = useSite();

  const [datos, setDatos] = useState(() => {
    const base = datosIniciales();
    const guardado = leer();
    if (guardado && typeof guardado === "object") {
      return {
        ...base,
        ...guardado,
        permisos: Array.isArray(guardado.permisos) ? guardado.permisos : base.permisos,
      };
    }
    return base;
  });
  const [seccion, setSeccion] = useState("servicios");
  const [sucio, setSucio] = useState(false);

  useEffect(() => {
    // Marca como sucio si hay datos guardados al cargar
    const guardado = leer();
    setSucio(Boolean(guardado));
  }, []);

  function cambiar(nuevos) {
    setDatos(nuevos);
    guardar(nuevos);
    setSucio(true);
  }

  function descartar() {
    setDatos(datosIniciales());
    borrar();
    setSucio(false);
  }

  function restablecer() {
    if (window.confirm(t("panel.cabecera.confirmarRestablecer"))) {
      setDatos(datosIniciales());
      borrar();
      setSucio(false);
    }
  }

  const enCurso = SECCIONES.find((s) => s.id === seccion);

  return (
    <div className="min-h-screen bg-fcvt-light text-fcvt-dark dark:bg-fcvt-darker dark:text-fcvt-dark">
      <a href="#panel" className="skip-link">
        {t("nav.saltar")}
      </a>

      {/* ---------- Barra superior ---------- */}
      <header className="sticky top-0 z-20 border-b border-fcvt-lighter bg-fcvt-white dark:border-white/10 dark:bg-fcvt-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="brand-shield-slot h-9 w-9">
              <span className="brand-shield h-9 w-9" />
            </span>
            <span className="text-sm font-extrabold leading-tight">
              {t("panel.cabecera.titulo")}
              <span className="block text-[11px] font-medium text-fcvt-gray">
                {site.faculty}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {sucio && (
              <span className="hidden text-xs font-bold text-amber-700 dark:text-amber-300 sm:inline">
                {t("panel.cabecera.soloNavegador")}
              </span>
            )}
            <BotonSecundario
              onClick={restablecer}
              etiqueta={t("panel.cabecera.restablecerCompleto")}
            >
              <i className="fa-solid fa-arrows-rotate" aria-hidden="true" />
              <span className="hidden sm:inline">{t("panel.cabecera.restablecer")}</span>
            </BotonSecundario>

            <AccessibilityMenu />

            <button
              type="button"
              onClick={toggleLang}
              aria-label={t("nav.idioma")}
              title={t("nav.idioma")}
              className="flex h-9 items-center gap-1.5 rounded-full border border-fcvt-lighter bg-fcvt-white px-3 text-xs font-bold text-fcvt-gray transition hover:border-fcvt-primary hover:text-fcvt-primary dark:border-white/15 dark:bg-white/5 dark:hover:text-fcvt-accent"
            >
              <i className="fa-solid fa-globe text-xs" aria-hidden="true" />
              {lang === "es" ? "ES" : "EN"}
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={t("nav.tema")}
              title={t("nav.tema")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-fcvt-lighter bg-fcvt-white text-fcvt-gray transition hover:border-fcvt-primary hover:text-fcvt-primary dark:border-white/15 dark:bg-white/5 dark:hover:text-fcvt-accent"
            >
              <i className={dark ? "fa-solid fa-sun" : "fa-solid fa-moon"} aria-hidden="true" />
            </button>

            <a
              href={import.meta.env.BASE_URL}
              className="inline-flex items-center gap-2 rounded-lg bg-fcvt-primary px-3.5 py-2 text-xs font-bold text-white transition hover:bg-fcvt-primary-dark"
            >
              <i className="fa-solid fa-arrow-left" aria-hidden="true" />
              {t("panel.cabecera.volver")}
            </a>
          </div>
        </div>
      </header>

      {/* ---------- Aviso de prototipo ---------- */}
      <div className="border-b border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10">
        <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-3 text-xs sm:px-6">
          <i
            className="fa-solid fa-triangle-exclamation mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
            aria-hidden="true"
          />
          <p className="text-amber-900 dark:text-amber-200">
            <strong className="font-bold">{t("panel.aviso.titulo")}</strong>{" "}
            <strong className="font-bold">{t("panel.aviso.resaltado")}</strong>{" "}
            {t("panel.aviso.texto")}
          </p>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row">
        {/* ---------- Secciones ---------- */}
        <nav aria-label={t("panel.cabecera.ariaSecciones")} className="lg:w-64 lg:shrink-0">
          <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {SECCIONES.map((item) => {
              const activa = item.id === seccion;
              return (
                <li key={item.id} className="shrink-0 lg:shrink">
                  <button
                    type="button"
                    onClick={() => setSeccion(item.id)}
                    aria-current={activa ? "true" : undefined}
                    className={`flex w-full items-center gap-3 whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-bold transition ${
                      activa
                        ? "bg-fcvt-primary text-white dark:bg-fcvt-primary"
                        : "bg-fcvt-white text-fcvt-gray hover:bg-fcvt-primary/10 hover:text-fcvt-primary dark:bg-white/5 dark:text-fcvt-gray dark:hover:text-fcvt-accent"
                    }`}
                  >
                    <i className={item.icono} aria-hidden="true" />
                    {t(item.key)}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ---------- Editor ---------- */}
        <main id="panel" className="min-w-0 flex-1">
          <h1 className="text-2xl font-extrabold tracking-tight">
            {enCurso ? t(enCurso.key) : ""}
          </h1>
          <p className="mt-1.5 text-sm text-fcvt-gray">{t("panel.ayuda")}</p>

          <div className="mt-5">
            {seccion === "servicios" && (
              <ServiciosEditor value={datos.servicios} onChange={(v) => cambiar({ ...datos, servicios: v })} />
            )}
            {seccion === "tecnologias" && (
              <TecnologiasEditor value={datos.tecnologias} onChange={(v) => cambiar({ ...datos, tecnologias: v })} />
            )}
            {seccion === "proyectos" && <ProyectosEditor value={datos} onChange={cambiar} />}
            {seccion === "galeria" && (
              <GaleriaEditor value={datos.galeria} onChange={(v) => cambiar({ ...datos, galeria: v })} />
            )}
            {seccion === "whatsapp" && (
              <WhatsappEditor value={datos.whatsapp} onChange={(v) => cambiar({ ...datos, whatsapp: v })} />
            )}
            {seccion === "pie" && <PieEditor value={datos.pie} onChange={(v) => cambiar({ ...datos, pie: v })} />}
            {seccion === "permisos" && (
              <PermisosEditor
                valor={datos.permisos}
                onCambiar={(v) => cambiar({ ...datos, permisos: v })}
              />
            )}
          </div>

          {/* Descartar al final también, para no tener que volver arriba */}
          <div className="mt-6 flex justify-end gap-2">
            <BotonSecundario onClick={restablecer}>
              <i className="fa-solid fa-arrows-rotate" aria-hidden="true" />
              {t("panel.cabecera.restablecerSitio")}
            </BotonSecundario>
          </div>
        </main>
      </div>
    </div>
  );
}