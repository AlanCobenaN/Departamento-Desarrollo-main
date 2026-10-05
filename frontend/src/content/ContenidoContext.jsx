import { createContext, useContext, useEffect, useState } from "react";
import { useSite } from "../contexts/SiteContext.jsx";
import { leer } from "../panel/almacen.js";

const ContenidoContext = createContext(null);

/**
 * Provee el contenido editado en el panel a la portada.
 *
 * Solo se aplica cuando el idioma es español: lo que se edita en el panel
 * está en castellano y no tiene traducción al inglés, así que en ese idioma
 * la web sigue mostrando el diccionario.
 */
export function ContenidoProvider({ children }) {
  const { lang } = useSite();
  const [datos, setDatos] = useState(() => leer());

  useEffect(() => {
    const alCambiar = (e) => {
      if (e.key !== "fcvt-panel") return;
      setDatos(leer());
    };
    window.addEventListener("storage", alCambiar);
    return () => window.removeEventListener("storage", alCambiar);
  }, []);

  const activo = lang === "es" ? datos : null;

  return (
    <ContenidoContext.Provider value={activo}>
      {children}
    </ContenidoContext.Provider>
  );
}

export function useContenido() {
  return useContext(ContenidoContext);
}