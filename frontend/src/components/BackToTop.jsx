import { useEffect, useState } from "react";

/**
 * Botón flotante "Volver arriba" inspirado en el tema Academi de Moodle:
 * aparece tras hacer scroll y devuelve suavemente al inicio de la página.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 480);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Volver arriba"
      title="Volver arriba"
      className={`fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-fcvt-primary text-base text-white shadow-lg transition hover:bg-fcvt-primary-dark ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <i className="fa-solid fa-chevron-up" aria-hidden="true" />
    </button>
  );
}
