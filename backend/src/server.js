import express from "express";
import app from "./app.js";
import env from "./config/env.js";

const server = app.listen(env.port, () => {
  console.log(`[fcvt-api] API del equipo FCVT escuchando en http://localhost:${env.port}`);
});

function shutdown(signal) {
  console.log(`[fcvt-api] Señal ${signal} recibida, cerrando servidor...`);
  server.close(() => process.exit(0));
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

export default server;
