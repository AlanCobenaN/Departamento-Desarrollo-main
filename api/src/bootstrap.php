<?php

declare(strict_types=1);

use Fcvt\Support\Env;
use Fcvt\Support\Response;

/**
 * Arranque de la API: carga el .env, registra el autoloader y centraliza el
 * manejo de errores. Lo carga public/index.php y solo eso.
 */

// ---------------------------------------------------------------------------
// 1. Configuracion desde .env
// ---------------------------------------------------------------------------

/**
 * Lee un archivo .env y lo pasa al entorno del proceso.
 *
 * Sustituye al paquete dotenv que usaba la API en Express. Solo hace falta lo
 * que el proyecto usa: pares CLAVE=VALOR, comentarios con #, comillas
 * envolventes y lineas en blanco.
 *
 * Una variable ya presente en el entorno real gana siempre. Asi se puede
 * sobreescribir el .env desde la consola o desde el panel del hosting sin
 * tocar el archivo.
 *
 * @return void
 */
function cargar_env(string $ruta): void
{
    if (!is_file($ruta) || !is_readable($ruta)) {
        return;
    }

    $lineas = file($ruta, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lineas === false) {
        return;
    }

    foreach ($lineas as $linea) {
        $linea = trim($linea);

        if ($linea === '' || str_starts_with($linea, '#')) {
            continue;
        }

        if (!str_contains($linea, '=')) {
            continue;
        }

        [$clave, $valor] = explode('=', $linea, 2);
        $clave = trim($clave);
        $valor = trim($valor);

        // Quita las comillas solo si envuelven el valor entero.
        $longitud = strlen($valor);
        if ($longitud >= 2 && ($valor[0] === '"' || $valor[0] === "'") && $valor[$longitud - 1] === $valor[0]) {
            $valor = substr($valor, 1, -1);
        }

        if ($clave === '' || getenv($clave) !== false) {
            continue;
        }

        putenv("{$clave}={$valor}");
        $_ENV[$clave] = $valor;
        $_SERVER[$clave] = $valor;
    }
}

cargar_env(dirname(__DIR__) . '/.env');

// ---------------------------------------------------------------------------
// 2. Autoloader
// ---------------------------------------------------------------------------
// PSR-4 sin Composer: Fcvt\Support\Response -> src/Support/Response.php
//
// El proyecto no usa Composer a proposito. Un unico proveedor de dependencias
// es npm, y el backend PHP no debe anadir otro que mantener aparte.

spl_autoload_register(static function (string $clase): void {
    $prefijo = 'Fcvt\\';

    if (!str_starts_with($clase, $prefijo)) {
        return;
    }

    $relativo = str_replace('\\', '/', substr($clase, strlen($prefijo)));
    $archivo = __DIR__ . '/' . $relativo . '.php';

    if (is_file($archivo)) {
        require $archivo;
    }
});

// ---------------------------------------------------------------------------
// 3. Errores
// ---------------------------------------------------------------------------

error_reporting(E_ALL);

// En produccion PHP no debe imprimir nada en la respuesta: el mensaje se
// devuelve siempre en JSON desde el manejador de abajo.
ini_set('display_errors', '0');
ini_set('log_errors', '1');

/**
 * Convierte cualquier excepcion no capturada en la misma forma de error que
 * usaba la API en Express: { ok: false, error: { message } }, con el detalle
 * oculto salvo que APP_DEBUG este activo.
 */
set_exception_handler(static function (Throwable $error): void {
    error_log(sprintf(
        '[fcvt-api] %s: %s en %s:%d',
        $error::class,
        $error->getMessage(),
        $error->getFile(),
        $error->getLine()
    ));

    $detalle = Env::bool('APP_DEBUG', false)
        ? [
            'message' => $error->getMessage(),
            'archivo' => $error->getFile(),
            'linea' => $error->getLine(),
        ]
        : ['message' => 'Error interno del servidor.'];

    Response::json(500, ['ok' => false, 'error' => $detalle]);
});
