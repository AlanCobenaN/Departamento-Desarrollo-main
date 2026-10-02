<?php

declare(strict_types=1);

namespace Fcvt\Support;

/**
 * Salida JSON unica de la API.
 *
 * Todas las respuestas pasan por aqui, asi que el formato queda garantizado:
 * { ok: true, data: ... } en exito y { ok: false, error: { message } } en
 * fallo. Es el contrato que ya consume frontend/src/utils/api.js.
 */
final class Response
{
    /**
     * Envia la respuesta y termina la ejecucion.
     *
     * El tipo never obliga al analizador a saber que despues de esta llamada
     * no se sigue, asi que un forgot de return no puede colarse.
     *
     * @param array<string, mixed> $cuerpo
     */
    public static function json(int $estado, array $cuerpo): never
    {
        http_response_code($estado);
        header('Content-Type: application/json; charset=utf-8');

        echo json_encode(
            $cuerpo,
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE
        );

        exit;
    }
}
