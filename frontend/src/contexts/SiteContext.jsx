import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "../config/branding.js";

const SiteContext = createContext(null);
const LANG_KEY = "fcvt-lang";
const THEME_KEY = "fcvt-theme";

function readStored(key, fallback) {
  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function preferredTheme() {
  const stored = readStored(THEME_KEY, null);
  if (stored === "dark" || stored === "light") return stored;
  if (typeof window.matchMedia === "function") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
}

export function SiteProvider({ children }) {
  const [lang, setLang] = useState(() => (readStored(LANG_KEY, "es") === "en" ? "en" : "es"));
  const [theme, setTheme] = useState(preferredTheme);

  const dark = theme === "dark";

  // Persiste preferencias y refleja el tema en el elemento <html>
  useEffect(() => {
    try {
      window.localStorage.setItem(LANG_KEY, lang);
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* modo privado: se ignora sin romper nada */
    }
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = theme;
  }, [lang, theme]);

  // Refleja el idioma en <html lang>: lo necesitan los lectores de pantalla
  // y las herramientas de traducción automática del navegador.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "es" ? "en" : "es"));
  }, []);

  /** Resuelve "seccion.clave" contra el diccionario del idioma activo. */
  const t = useCallback(
    (key, vars) => {
      let node = translations[lang] || translations.es;
      key.split(".").forEach((part) => {
        node = node && node[part];
      });
      if (typeof node !== "string") return key;
      if (!vars) return node;
      return Object.entries(vars).reduce(
        (acc, [k, v]) => acc.split(`{${k}}`).join(String(v)),
        node
      );
    },
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, toggleLang, theme, dark, setTheme, toggleTheme, t }),
    [lang, theme, dark, toggleLang, toggleTheme, t]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite() debe usarse dentro de <SiteProvider>");
  return ctx;
}
