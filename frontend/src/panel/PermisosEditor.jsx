import { useState } from "react";
import { useSite } from "../contexts/SiteContext.jsx";
import { esCorreoInstitucional } from "../utils/correo.js";
import { nuevoId } from "./datos.js";
import {
  BotonPrincipal,
  BotonSecundario,
  Campo,
  Subtitulo,
  Tarjeta,
} from "./comunes.jsx";

export default function PermisosEditor({ valor = [], onCambiar }) {
  const { t } = useSite();
  // Se guarda la clave, no el texto, para que el aviso cambie de idioma.
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    correo: "",
    contrasena: "",
  });

  const normalizar = (lista) =>
    Array.isArray(lista) ? lista.map((c) => ({ ...c })) : [];

  const agregar = () => {
    const correo = form.correo.trim();
    const contrasena = form.contrasena.trim();
    setError("");

    if (!correo || !contrasena) {
      setError("panel.permisos.errorVacio");
      return;
    }
    if (!esCorreoInstitucional(correo)) {
      setError("panel.permisos.errorDominio");
      return;
    }
    if (contrasena.length < 8) {
      setError("panel.permisos.errorContrasena");
      return;
    }

    const lista = normalizar(valor);
    const existe = lista.some(
      (c) => c.correo.trim().toLowerCase() === correo.toLowerCase()
    );
    if (existe) {
      setError("panel.permisos.errorDuplicado");
      return;
    }

    onCambiar([
      ...lista,
      {
        id: nuevoId(),
        correo,
        contrasena,
      },
    ]);
    setForm({ correo: "", contrasena: "" });
  };

  const quitar = (correo) => {
    const lista = normalizar(valor);
    const filtrada = lista.filter(
      (c) => c.correo.trim().toLowerCase() !== correo.trim().toLowerCase()
    );
    onCambiar(filtrada);
    setError("");
  };

  const puedeAgregar = form.correo.trim() && form.contrasena.trim();

  return (
    <div className="space-y-8">
      <div>
        <p className="mt-1 text-sm text-fcvt-gray">
          {t("panel.permisos.introduccion")}
        </p>
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
          {t("panel.permisos.avisoSeguridad")}
        </p>
      </div>

      <Tarjeta titulo={t("panel.permisos.lista")}>
        {valor.length === 0 ? (
          <p className="text-sm text-fcvt-gray">{t("panel.permisos.vacio")}</p>
        ) : (
          <ul className="space-y-2">
            {valor.map((cuenta) => (
              <li
                key={cuenta.id ?? cuenta.correo}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-fcvt-lighter bg-fcvt-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-fcvt-dark">
                    {cuenta.correo}
                  </span>
                  <span className="text-xs text-fcvt-gray">
                    {t("panel.permisos.contrasena", { valor: cuenta.contrasena })}
                  </span>
                </div>
                <BotonSecundario onClick={() => quitar(cuenta.correo)}>
                  {t("panel.permisos.quitar")}
                </BotonSecundario>
              </li>
            ))}
          </ul>
        )}
      </Tarjeta>

      <Tarjeta titulo={t("panel.permisos.anadirTitulo")}>
        <div className="grid gap-4 md:grid-cols-2">
          <Campo
            etiqueta={t("panel.permisos.correo")}
            tipo="email"
            valor={form.correo}
            onChange={(v) => setForm((f) => ({ ...f, correo: v }))}
            placeholder="nombre.apellido@uleam.edu.ec"
          />
          <Campo
            etiqueta={t("panel.permisos.clave")}
            tipo="password"
            valor={form.contrasena}
            onChange={(v) => setForm((f) => ({ ...f, contrasena: v }))}
            placeholder={t("panel.permisos.clavePlaceholder")}
          />
        </div>
        {error && (
          <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
            {t(error)}
          </p>
        )}
        <div className="mt-4 flex justify-end">
          <BotonPrincipal
            tipo="button"
            onClick={agregar}
            deshabilitado={!puedeAgregar}
          >
            {t("panel.permisos.dar")}
          </BotonPrincipal>
        </div>
        <Subtitulo>{t("panel.permisos.advertencia")}</Subtitulo>
        {/* sufijo pegado a la negrita: ES empieza con espacio, EN con punto */}
        <p className="text-xs text-fcvt-gray">
          {t("panel.permisos.avisoPrefijo")}{" "}
          <strong>{t("panel.permisos.avisoResaltado")}</strong>
          {t("panel.permisos.avisoSufijo")}
        </p>
      </Tarjeta>
    </div>
  );
}
