import { useEffect, useRef, useState } from "react";

/**
 * Revela su contenido cuando entra en pantalla.
 *
 * Reglas de seguridad:
 * - Si el navegador no soporta IntersectionObserver, se muestra de inmediato.
 * - Si el usuario desactivó las animaciones, el CSS lo muestra siempre
 *   (ver index.css), así que el contenido nunca queda invisible.
 */
export default function Reveal({ as: Tag = "div", delay = 0, className = "", children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{ "--reveal-delay": `${delay}ms` }}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
