export function notFound(req, res) {
  res.status(404).json({
    ok: false,
    error: { message: `Ruta ${req.method} ${req.originalUrl} no encontrada.` },
  });
}
