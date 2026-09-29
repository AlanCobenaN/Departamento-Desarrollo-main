import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/** Ajustes por defecto: si un valor coincide con el "por defecto", no se escribe el atributo. */
export const A11Y_DEFAULTS = {
  textSize: "normal", // normal | large | xlarge
  contrast: "normal", // normal | high
  lineHeight: "normal", // normal | relaxed
  grayscale: false,
  dyslexia: false,
  underlineLinks: false,
  reduceMotion: false,
  bigCursor: false,
};

const KEY = "fcvt-a11y";

/** Traduce el nombre del ajuste al atributo data-* del elemento <html>. */
const ATTR = {
  textSize: "text-size",
  contrast: "contrast",
  lineHeight: "line-height",
  grayscale: "grayscale",
  dyslexia: "dyslexia",
  underlineLinks: "underline-links",
  reduceMotion: "reduce-motion",
  bigCursor: "big-cursor",
};

/** Atributos de ajustes que ya no existen: se limpian para no dejar restos. */
const LEGACY_ATTRS = ["strong-focus"];

const A11yContext = createContext(null);

function readStored() {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" ? { ...A11Y_DEFAULTS, ...parsed } : A11Y_DEFAULTS;
  } catch {
    return A11Y_DEFAULTS;
  }
}

export function A11yProvider({ children }) {
  const [settings, setSettings] = useState(readStored);

  // Persiste y refleja cada ajuste en <html> para que el CSS lo aplique.
  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(settings));
    } catch {
      /* modo privado: se ignora */
    }

    const root = document.documentElement;
    LEGACY_ATTRS.forEach((attr) => root.removeAttribute(`data-${attr}`));
    Object.entries(ATTR).forEach(([name, attr]) => {
      const value = settings[name];
      const isDefault = value === A11Y_DEFAULTS[name];
      if (isDefault) root.removeAttribute(`data-${attr}`);
      else if (typeof value === "boolean") root.setAttribute(`data-${attr}`, "true");
      else root.setAttribute(`data-${attr}`, String(value));
    });
  }, [settings]);

  const set = useCallback((name, value) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
  }, []);

  const toggle = useCallback((name) => {
    setSettings((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);

  const reset = useCallback(() => setSettings(A11Y_DEFAULTS), []);

  /** Cuántas opciones están activas: alimenta el indicador del botón. */
  const activeCount = useMemo(
    () =>
      Object.keys(ATTR).filter((name) => settings[name] !== A11Y_DEFAULTS[name]).length,
    [settings]
  );

  const value = useMemo(
    () => ({ settings, set, toggle, reset, activeCount, defaults: A11Y_DEFAULTS }),
    [settings, set, toggle, reset, activeCount]
  );

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
}

export function useA11y() {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error("useA11y() debe usarse dentro de <A11yProvider>");
  return ctx;
}
