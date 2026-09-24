import env from "../config/env.js";

export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message =
    env.nodeEnv === "production" && status >= 500
      ? "Error interno del servidor."
      : err.message;

  if (status >= 500) {
    console.error(`[fcvt-api] ${err.stack || err.message}`);
  }

  res.status(status).json({ ok: false, error: { message } });
}
