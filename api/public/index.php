<?php

declare(strict_types=1);

use Fcvt\Controllers\ProyectoController;
use Fcvt\Database\Connection;
use Fcvt\Repositories\ProyectoRepository;
use Fcvt\Services\ProyectoService;
use Fcvt\Support\Env;
use Fcvt\Support\Response;

require __DIR__ . '/../src/bootstrap.php';

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------
// CLIENT_ORIGIN admite varios origenes separados por coma, que es lo que hace
// falta en produccion: el dominio publico mas localhost durante las pruebas.
//
// Se refleja el origen solo si esta en la lista. Devolver un "*" fijoeria el
// error tipico de permitting CORS y dejaria la API abierta a cualquier pagina.
//
// Se anuncian ya los verbos de escritura aunque hoy solo haya GET: el panel de
// administracion los va a necesitar y cambiar la cabecera despues obligaria a
// tocar el frontend.
// ---------------------------------------------------------------------------

$origenes = array_values(array_filter(array_map(
    'trim',
    explode(',', (string) Env::get('CLIENT_ORIGIN', 'http://localhost:5173'))
)));

$origenPeticion = $_SERVER['HTTP_ORIGIN'] ?? '';

if ($origenPeticion !== '' && in_array($origenPeticion, $origenes, true)) {
    header("Access-Control-Allow-Origin: {$origenPeticion}");
    header('Vary: Origin');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');

$metodo = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

// El panel de administracion enviara formularios y JSON con credenciales, asi
// que el preflight se responde aqui y no sigue al enrutador.
if ($metodo === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ---------------------------------------------------------------------------
// Ruta
// ---------------------------------------------------------------------------
// Se espera que la API cuelgue de /api, igual que antes hacia Express, para
// que VITE_API_URL sea http://<host>/api y no haya que tocar el frontend.
//
// Si el hosting publica la API en la raiz del dominio, API_PREFIX=/ lo deja
// sirviendo en /projects directamente.
// ---------------------------------------------------------------------------

$prefijo = '/' . trim((string) Env::get('API_PREFIX', '/api'), '/');

$ruta = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$ruta = is_string($ruta) ? $ruta : '/';
$ruta = '/' . trim($ruta, '/');

if ($prefijo !== '/' && ($ruta === $prefijo || str_starts_with($ruta, $prefijo . '/'))) {
    $ruta = substr($ruta, strlen($prefijo));
    $ruta = $ruta === '' ? '/' : $ruta;
}

// ---------------------------------------------------------------------------
// Enrutador
// ---------------------------------------------------------------------------

/**
 * El controlador se arma la primera vez que hace falta y no antes.
 *
 * Construirlo al principio abriria la conexion a PostgreSQL en cada peticion,
 * incluso en las que no la necesitan, y haria que /health devolviera un error
 * de base de datos en lugar de su propia respuesta.
 */
$controlador = static function (): ProyectoController {
    static $instancia = null;

    if ($instancia === null) {
        $instancia = new ProyectoController(
            new ProyectoService(new ProyectoRepository(Connection::get()))
        );
    }

    return $instancia;
};

if ($metodo === 'GET' && $ruta === '/health') {
    $controlador()->health();
}

if ($metodo === 'GET' && $ruta === '/projects') {
    $controlador()->listar();
}

if ($metodo === 'GET' && preg_match('#^/projects/(\d+)$#', $ruta, $coincidencias) === 1) {
    $controlador()->detalle((int) $coincidencias[1]);
}

Response::json(404, [
    'ok' => false,
    'error' => ['message' => 'Ruta no encontrada.'],
]);
