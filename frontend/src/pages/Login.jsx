import { useEffect, useId, useRef, useState } from "react";
import { useSite } from "../contexts/SiteContext.jsx";
import site from "../config/branding.js";

// El correo institucional de la ULEAM llega en dos formas:
//   - @live.uleam.edu.ec, que es el correo de la universidad y el habitual;
//   - @uleam.edu.ec, que tambien se usa y se acepta.
// Se validan solo esos dos dominios, no cualquier correo: un formulario que
// acepta gmail.com no es un formulario de acceso institucional.
const DOMINIOS = ["live.uleam.edu.ec", "uleam.edu.ec"];
const EMAIL_RE = new RegExp(`^[^\\s@]+@(${DOMINIOS.map((d) => d.replace(/\./g, "\\.")).join("|")})$`, "i");
const MIN_PASSWORD = 8;
const RECORDAR_KEY = "fcvt-login-email";

/**
 * Vista a la que se entra al enviar el formulario.
 *
 * Todavia no esta decidida: falta confirmar cual es. Se deja en una sola
 * constante para que cuando se sepa sea cambiar esta linea y nada mas, sin
 * tocar el formulario.
 *
 * Mientras valga null, enviar enseña el aviso de "el acceso todavia no esta
 * disponible" en vez de saltar a una pagina que todavia no existe.
 */
const SIGUIENTE_VISTA = null;

/**
 * Pagina de acceso, en su propia ruta y con su propia carga de pagina.
 *
 * Por ahora no deja entrar a nadie: no hay backend de autenticacion, asi que
 * enviar el formulario enseña un aviso en lugar de fingir un inicio de sesion
 * que no ocurre. El formulario si valida en el navegador, que es la parte que
 * se puede comprobar de verdad.
 */
export default function Login() {
  const { t, lang, toggleLang, dark, toggleTheme } = useSite();

  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem(RECORDAR_KEY) ?? "";
    } catch {
      // Con las cookies bloqueadas el formulario sigue siendo usable.
      return "";
    }
  });
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [recordar, setRecordar] = useState(() => {
    try {
      return localStorage.getItem(RECORDAR_KEY) !== null;
    } catch {
      return false;
    }
  });
  const [errores, setErrores] = useState({});
  const [aviso, setAviso] = useState(false);

  const idEmail = useId();
  const idPassword = useId();
  const emailRef = useRef(null);
  const avisoRef = useRef(null);

  // El aviso aparece al enviar; mover el foco aqui hace que se lea en voz alta
  // en vez de quedarse en un rincon que el lector de pantalla no recorre.
  useEffect(() => {
    if (aviso) avisoRef.current?.focus();
  }, [aviso]);

  function validar() {
    const fallos = {};

    if (!email.trim() && !password) {
      fallos.campos = t("login.errorCampos");
      return fallos;
    }
    if (email.trim() && !EMAIL_RE.test(email.trim())) {
      fallos.email = t("login.errorCorreo");
    }
    if (password && password.length < MIN_PASSWORD) {
      fallos.password = t("login.errorContrasena");
    }

    return fallos;
  }

  function onSubmit(evento) {
    evento.preventDefault();
    setAviso(false);

    const fallos = validar();
    setErrores(fallos);

    if (Object.keys(fallos).length > 0) {
      if (fallos.email) emailRef.current?.focus();
      return;
    }

    try {
      if (recordar) localStorage.setItem(RECORDAR_KEY, email.trim());
      else localStorage.removeItem(RECORDAR_KEY);
    } catch {
      // Recordar el correo es una comodidad, no un requisito.
    }

    // El boton y el Enter hacen lo mismo: es el <form> el que decide, asi que
    // no hay atajo por teclado que se quede sin sincronizar con el raton.
    if (SIGUIENTE_VISTA) {
      window.location.assign(SIGUIENTE_VISTA);
      return;
    }

    setAviso(true);
  }

  // En cuanto se toca un campo se va el error de ese campo: repetir el mensaje
  // mientras se escribe solo molesta.
  function limpiarError(campo) {
    setErrores((prev) => (prev[campo] ? { ...prev, [campo]: undefined } : prev));
    setAviso(false);
  }

  const volverA = import.meta.env.BASE_URL;

  return (
    <div className="flex min-h-screen flex-col bg-fcvt-light text-fcvt-dark dark:bg-fcvt-darker dark:text-fcvt-dark">
      {/* Barra superior: idioma y tema, igual que en la portada, para no perder
          los controles al cambiar de pagina. */}
      <header className="flex items-center justify-end gap-2 px-5 py-4">
        <button
          type="button"
          onClick={toggleLang}
          aria-label={t("nav.idioma")}
          title={t("nav.idioma")}
          className="flex h-9 items-center gap-1.5 rounded-full border border-fcvt-lighter bg-fcvt-white px-3 text-xs font-bold text-fcvt-gray transition hover:border-fcvt-primary hover:text-fcvt-primary dark:border-white/15 dark:bg-fcvt-white dark:hover:text-fcvt-accent"
        >
          <i className="fa-solid fa-globe text-xs" aria-hidden="true" />
          {lang === "es" ? "ES" : "EN"}
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={t("nav.tema")}
          title={t("nav.tema")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-fcvt-lighter bg-fcvt-white text-fcvt-gray transition hover:border-fcvt-primary hover:text-fcvt-primary dark:border-white/15 dark:bg-fcvt-white dark:hover:text-fcvt-accent"
        >
          <i
            className={dark ? "fa-solid fa-sun" : "fa-solid fa-moon"}
            aria-hidden="true"
          />
        </button>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-8">
        <div className="w-full max-w-md">
          {/* Marca */}
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="brand-shield-slot mb-4 h-16 w-16">
              <span className="brand-shield h-12 w-12" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-fcvt-primary dark:text-fcvt-dark sm:text-3xl">
              {t("login.titulo")}
            </h1>
            <p className="mt-2 text-sm text-fcvt-gray dark:text-fcvt-gray">
              {t("login.subtitulo")}
            </p>
          </div>

          {/* Tarjeta */}
          <div className="rounded-2xl border border-fcvt-lighter bg-fcvt-white p-6 shadow-xl shadow-fcvt-darker/5 sm:p-8 dark:border-white/10 dark:bg-fcvt-white">
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              {/* Correo */}
              <div>
                <label
                  htmlFor={idEmail}
                  className="mb-1.5 block text-sm font-bold text-fcvt-dark dark:text-fcvt-dark"
                >
                  {t("login.correo")}
                </label>
                <div className="relative">
                  <i
                    className="fa-solid fa-envelope pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-fcvt-gray"
                    aria-hidden="true"
                  />
                  <input
                    id={idEmail}
                    ref={emailRef}
                    type="email"
                    name="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      limpiarError("email");
                      limpiarError("campos");
                    }}
                    placeholder={t("login.correoEjemplo")}
                    aria-invalid={errores.email ? "true" : undefined}
                    aria-describedby={errores.email ? `${idEmail}-error` : undefined}
                    className="w-full rounded-xl border bg-fcvt-light py-3 pl-10 pr-4 text-sm text-fcvt-dark transition outline-none placeholder:text-fcvt-gray/70 focus:border-fcvt-primary focus:ring-2 focus:ring-fcvt-primary/25 dark:bg-fcvt-light dark:text-fcvt-dark dark:placeholder:text-fcvt-gray/70 dark:focus:border-fcvt-primary-dark dark:focus:ring-fcvt-primary-dark/25"
                    style={
                      errores.email
                        ? { borderColor: "#dc2626" }
                        : { borderColor: "var(--color-fcvt-lighter)" }
                    }
                  />
                </div>
                  {errores.email && (
                    <p
                      id={`${idEmail}-error`}
                      role="alert"
                      className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400"
                    >
                      <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
                      {errores.email}
                    </p>
                  )}
                {/* La pista va antes del error: si hay error, el mensaje de
                    error ya dice que dominios valen y la linea sobra. */}
                {!errores.email && (
                  <p className="mt-1.5 text-xs text-fcvt-gray dark:text-fcvt-gray">
                    {t("login.correoDominios")}
                  </p>
                )}
              </div>

              {/* Contraseña */}
              <div>
                <label
                  htmlFor={idPassword}
                  className="mb-1.5 block text-sm font-bold text-fcvt-dark dark:text-fcvt-dark"
                >
                  {t("login.contrasena")}
                </label>
                <div className="relative">
                  <i
                    className="fa-solid fa-lock pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-fcvt-gray"
                    aria-hidden="true"
                  />
                  <input
                    id={idPassword}
                    type={verPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    required
                    minLength={MIN_PASSWORD}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      limpiarError("password");
                      limpiarError("campos");
                    }}
                    aria-invalid={errores.password ? "true" : undefined}
                    aria-describedby={
                      errores.password ? `${idPassword}-error` : undefined
                    }
                    className="w-full rounded-xl border bg-fcvt-light py-3 pl-10 pr-12 text-sm text-fcvt-dark transition outline-none focus:border-fcvt-primary focus:ring-2 focus:ring-fcvt-primary/25 dark:bg-fcvt-light dark:text-fcvt-dark dark:focus:border-fcvt-primary-dark dark:focus:ring-fcvt-primary-dark/25"
                    style={
                      errores.password
                        ? { borderColor: "#dc2626" }
                        : { borderColor: "var(--color-fcvt-lighter)" }
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setVerPassword((v) => !v)}
                    aria-pressed={verPassword}
                    aria-label={
                      verPassword ? t("login.ocultar") : t("login.mostrar")
                    }
                    title={verPassword ? t("login.ocultar") : t("login.mostrar")}
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-fcvt-gray transition hover:bg-fcvt-lighter hover:text-fcvt-primary dark:hover:bg-white/10 dark:hover:text-fcvt-accent"
                  >
                    <i
                      className={
                        verPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"
                      }
                      aria-hidden="true"
                    />
                  </button>
                </div>
                {errores.password && (
                  <p
                    id={`${idPassword}-error`}
                    role="alert"
                    className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400"
                  >
                    <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
                    {errores.password}
                  </p>
                )}
              </div>

              {errores.campos && (
                <p
                  role="alert"
                  className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 dark:bg-red-950/30 dark:text-red-300"
                >
                  <i
                    className="fa-solid fa-triangle-exclamation mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  {errores.campos}
                </p>
              )}

              {/* Recordar y olvidar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <label className="flex cursor-pointer select-none items-center gap-2 text-xs font-medium text-fcvt-gray dark:text-fcvt-gray">
                  <input
                    type="checkbox"
                    checked={recordar}
                    onChange={(e) => setRecordar(e.target.checked)}
                    className="h-4 w-4 shrink-0 cursor-pointer rounded border-fcvt-lighter accent-fcvt-primary"
                  />
                  {t("login.recordar")}
                </label>

                <span
                  title={t("nav.proximamente")}
                  aria-disabled="true"
                  className="cursor-not-allowed text-xs font-semibold text-fcvt-gray/70 underline decoration-dotted underline-offset-4 dark:text-fcvt-gray/60"
                >
                  {t("login.olvidar")}
                </span>
              </div>

              {/* Entrar */}
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-fcvt-accent-from to-fcvt-accent-to px-5 py-3 text-sm font-extrabold text-fcvt-darker shadow-lg shadow-fcvt-accent-to/25 transition hover:brightness-105 active:brightness-95"
              >
                <i className="fa-solid fa-right-to-bracket mr-2" aria-hidden="true" />
                {t("login.entrar")}
              </button>
            </form>

            {/* Aviso de acceso no disponible */}
            {aviso && (
              <div
                ref={avisoRef}
                tabIndex={-1}
                role="status"
                className="mt-6 rounded-xl border border-fcvt-primary/25 bg-fcvt-primary/5 p-4 text-center outline-none dark:border-fcvt-primary-dark/40 dark:bg-fcvt-primary-dark/15"
              >
                <i
                  className="fa-solid fa-circle-info text-lg text-fcvt-primary dark:text-fcvt-primary-light"
                  aria-hidden="true"
                />
                <p className="mt-2 text-sm font-bold text-fcvt-primary dark:text-fcvt-primary-light">
                  {t("login.avisoTitulo")}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-fcvt-gray dark:text-fcvt-gray">
                  {t("login.avisoDetalle")}
                </p>
              </div>
            )}
          </div>

          {/* Volver */}
          <p className="mt-6 text-center text-sm">
            <a
              href={volverA}
              className="font-semibold text-fcvt-primary transition hover:text-fcvt-primary-dark dark:text-fcvt-accent dark:hover:text-fcvt-accent-soft"
            >
              <i className="fa-solid fa-arrow-left mr-2" aria-hidden="true" />
              {t("login.volver")}
            </a>
          </p>

          <p className="mt-6 text-center text-xs text-fcvt-gray/80 dark:text-fcvt-gray/70">
            {site.faculty} · {site.university}
          </p>
        </div>
      </main>
    </div>
  );
}
