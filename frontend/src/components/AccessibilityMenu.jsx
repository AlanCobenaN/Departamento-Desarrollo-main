import { useEffect, useRef, useState } from "react";
import { useA11y } from "../contexts/AccessibilityContext.jsx";
import { useSite } from "../contexts/SiteContext.jsx";

/** Interruptor con etiqueta y descripción. */
function Switch({ icon, label, checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-fcvt-lighter dark:hover:bg-white/5"
    >
      <i className={`${icon} w-4 shrink-0 text-center text-sm text-fcvt-primary dark:text-fcvt-accent`} aria-hidden="true" />
      <span className="flex-1 text-sm font-medium text-fcvt-dark dark:text-fcvt-dark">
        {label}
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-fcvt-primary" : "bg-fcvt-lighter dark:bg-white/20"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? "left-[1.375rem]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

/** Selector de una sola opción (segmentado). */
function Segmented({ icon, label, value, options, onChange }) {
  return (
    <div className="px-3 py-2.5">
      <p className="mb-2 flex items-center gap-3 text-sm font-medium text-fcvt-dark dark:text-fcvt-dark">
        <i className={`${icon} w-4 shrink-0 text-center text-sm text-fcvt-primary dark:text-fcvt-accent`} aria-hidden="true" />
        {label}
      </p>
      <div
        role="radiogroup"
        aria-label={label}
        className="flex gap-1 rounded-lg bg-fcvt-lighter p-1 dark:bg-white/10"
      >
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={value === opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 rounded-md px-2 py-1.5 text-xs font-bold transition ${
              value === opt.value
                ? "bg-fcvt-primary text-white shadow-sm"
                : "text-fcvt-gray hover:text-fcvt-primary dark:hover:text-fcvt-accent"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Menú de accesibilidad completo, fijo en la esquina superior derecha.
 * Los ajustes se aplican al instante y se recuerdan entre visitas.
 */
export default function AccessibilityMenu() {
  const { t } = useSite();
  const { settings, set, toggle, reset, activeCount } = useA11y();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const panelRef = useRef(null);

  // Cerrar con Escape o al hacer clic fuera
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  // Mueve el foco al panel al abrirlo
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  const textSizes = [
    { value: "normal", label: t("a11y.normal") },
    { value: "large", label: t("a11y.large") },
    { value: "xlarge", label: t("a11y.xlarge") },
  ];
  const contrasts = [
    { value: "normal", label: t("a11y.contrastNormal") },
    { value: "high", label: t("a11y.contrastHigh") },
  ];
  const spacings = [
    { value: "normal", label: t("a11y.normal") },
    { value: "relaxed", label: t("a11y.relaxed") },
  ];

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="panel-accesibilidad"
        aria-label={open ? t("a11y.close") : t("a11y.open")}
        title={t("a11y.title")}
        className="relative flex h-8 w-8 items-center justify-center rounded-full border border-fcvt-lighter text-sm text-fcvt-gray transition hover:border-fcvt-primary hover:text-fcvt-primary dark:border-white/15 dark:hover:text-fcvt-accent"
      >
        <i className="fa-solid fa-universal-access" aria-hidden="true" />
        {activeCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-fcvt-accent px-1 text-[10px] font-bold text-fcvt-darker">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div
          id="panel-accesibilidad"
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-label={t("a11y.title")}
          className="absolute right-0 top-11 z-50 w-[min(21rem,calc(100vw-1.5rem))] overflow-y-auto rounded-xl border border-fcvt-lighter bg-fcvt-white shadow-2xl dark:border-white/15 dark:bg-fcvt-white"
        >
          {/* Encabezado */}
          <div className="flex items-center justify-between gap-3 border-b border-fcvt-lighter bg-fcvt-primary px-4 py-3 dark:border-white/10">
            <p className="flex items-center gap-2 text-sm font-bold text-white">
              <i className="fa-solid fa-universal-access" aria-hidden="true" />
              {t("a11y.title")}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("a11y.close")}
              className="flex h-6 w-6 items-center justify-center rounded text-white/80 transition hover:bg-white/20 hover:text-white"
            >
              <i className="fa-solid fa-xmark text-xs" aria-hidden="true" />
            </button>
          </div>

          {/* Visión */}
          <p className="px-4 pb-1 pt-3 text-[11px] font-bold uppercase tracking-wider text-fcvt-gray">
            {t("a11y.vision")}
          </p>
          <div className="space-y-0.5 px-1">
            <Segmented
              icon="fa-solid fa-text-height"
              label={t("a11y.textSize")}
              value={settings.textSize}
              options={textSizes}
              onChange={(v) => set("textSize", v)}
            />
            <Segmented
              icon="fa-solid fa-circle-half-stroke"
              label={t("a11y.contrast")}
              value={settings.contrast}
              options={contrasts}
              onChange={(v) => set("contrast", v)}
            />
            <Switch
              icon="fa-solid fa-adjust"
              label={t("a11y.grayscale")}
              checked={settings.grayscale}
              onChange={() => toggle("grayscale")}
            />
          </div>

          {/* Lectura */}
          <p className="border-t border-fcvt-lighter px-4 pb-1 pt-3 text-[11px] font-bold uppercase tracking-wider text-fcvt-gray dark:border-white/10">
            {t("a11y.text")}
          </p>
          <div className="space-y-0.5 px-1">
            <Switch
              icon="fa-solid fa-book-open"
              label={t("a11y.dyslexia")}
              checked={settings.dyslexia}
              onChange={() => toggle("dyslexia")}
            />
            <Switch
              icon="fa-solid fa-link"
              label={t("a11y.underlineLinks")}
              checked={settings.underlineLinks}
              onChange={() => toggle("underlineLinks")}
            />
            <Segmented
              icon="fa-solid fa-align-left"
              label={t("a11y.lineHeight")}
              value={settings.lineHeight}
              options={spacings}
              onChange={(v) => set("lineHeight", v)}
            />
          </div>

          {/* Movimiento y puntero */}
          <p className="border-t border-fcvt-lighter px-4 pb-1 pt-3 text-[11px] font-bold uppercase tracking-wider text-fcvt-gray dark:border-white/10">
            {t("a11y.motion")}
          </p>
          <div className="space-y-0.5 px-1">
            <Switch
              icon="fa-solid fa-wind"
              label={t("a11y.reduceMotion")}
              checked={settings.reduceMotion}
              onChange={() => toggle("reduceMotion")}
            />
            <Switch
              icon="fa-solid fa-arrow-pointer"
              label={t("a11y.bigCursor")}
              checked={settings.bigCursor}
              onChange={() => toggle("bigCursor")}
            />
          </div>

          {/* Pie */}
          <div className="border-t border-fcvt-lighter p-3 dark:border-white/10">
            <button
              type="button"
              onClick={reset}
              disabled={activeCount === 0}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-fcvt-lighter px-4 py-2.5 text-xs font-bold text-fcvt-primary transition hover:bg-fcvt-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white/10 dark:text-fcvt-accent"
            >
              <i className="fa-solid fa-rotate-left" aria-hidden="true" />
              {t("a11y.reset")}
            </button>
            <p className="mt-2 px-1 text-[11px] leading-relaxed text-fcvt-gray">
              {t("a11y.hint")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
