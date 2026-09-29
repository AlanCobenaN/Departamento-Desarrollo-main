import { useEffect, useState } from "react";
import { useSite } from "../contexts/SiteContext.jsx";

/**
 * Boton "volver arriba" con anillo de progreso de lectura.
 * Aparece solo cuando hay contenido que recorrer y se oculta al llegar al inicio.
 */
export default function BackToTop() {
  const { t } = useSite();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      setProgress(scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0);
      setVisible(doc.scrollTop > 400);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  const R = 20;
  const circumference = 2 * Math.PI * R;

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label={t("backToTop")}
      title={t("backToTop")}
      className={`fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-fcvt-primary text-white shadow-xl transition-all duration-300 hover:bg-fcvt-primary-dark ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg
        className="absolute inset-0 h-full w-full -rotate-90"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <circle
          cx="24"
          cy="24"
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="3"
        />
        <circle
          cx="24"
          cy="24"
          r={R}
          fill="none"
          stroke="var(--color-fcvt-accent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (progress / 100) * circumference}
          className="transition-[stroke-dashoffset] duration-150"
        />
      </svg>
      <i className="fa-solid fa-arrow-up relative text-sm" aria-hidden="true" />
    </button>
  );
}
