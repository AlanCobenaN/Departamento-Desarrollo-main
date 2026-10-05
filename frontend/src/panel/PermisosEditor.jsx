import { useState } from "react";
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
      setError("Rellena el correo y la contraseña.");
      return;
    }
    if (!esCorreoInstitucional(correo)) {
      setError("Solo se admiten correos de @uleam.edu.ec o @live.uleam.edu.ec.");
      return;
    }
    if (contrasena.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    const lista = normalizar(valor);
    const existe = lista.some(
      (c) => c.correo.trim().toLowerCase() === correo.toLowerCase()
    );
    if (existe) {
      setError("Ese correo ya está en la lista de permisos.");
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
          Da acceso a más correos institucionales para entrar al panel. El inicio
          de sesión solo acepta contraseñas, pero este sistema es un prototipo:
          se guarda en el navegador, no en la base de datos.
        </p>
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
          No es seguridad: en un navegador cualquiera puede leer esta lista y
          concederse permiso.
        </p>
      </div>

      <Tarjeta titulo="Lista de correos con permiso">
        {valor.length === 0 ? (
          <p className="text-sm text-fcvt-gray">
            No hay otros correos. Solo queda la cuenta del prototipo.
          </p>
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
                    Contraseña: {cuenta.contrasena}
                  </span>
                </div>
                <BotonSecundario
                  tipo="button"
                  onClick={() => quitar(cuenta.correo)}
                >
                  Quitar permiso
                </BotonSecundario>
              </li>
            ))}
          </ul>
        )}
      </Tarjeta>

      <Tarjeta titulo="Añadir un correo institucional">
        <div className="grid gap-4 md:grid-cols-2">
          <Campo
            etiqueta="Correo institucional"
            tipo="email"
            valor={form.correo}
            onCambiar={(v) => setForm((f) => ({ ...f, correo: v }))}
            marcador="nombre.apellido@uleam.edu.ec"
          />
          <Campo
            etiqueta="Contraseña para este acceso"
            tipo="password"
            valor={form.contrasena}
            onCambiar={(v) => setForm((f) => ({ ...f, contrasena: v }))}
            marcador="Mínimo 8 caracteres"
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        <div className="mt-4 flex justify-end">
          <BotonPrincipal
            tipo="button"
            onClick={agregar}
            deshabilitado={!puedeAgregar}
          >
            Dar permiso
          </BotonPrincipal>
        </div>
        <Subtitulo>Advertencia</Subtitulo>
        <p className="text-xs text-fcvt-gray">
          Estos datos se guardan en <strong>localStorage</strong> del navegador.
          Si borras los datos del sitio, se pierden. No uses contraseñas reales
          que uses en otros sitios.
        </p>
      </Tarjeta>
    </div>
  );
}