<?php

declare(strict_types=1);

namespace Fcvt\Support;

/**
 * Lectura de variables de entorno con valor por defecto.
 *
 * Devuelve null cuando la variable no existe o esta vacia, para que un
 * VITE_API_URL= en blanco no se cuele como cadena vacia en el JSON.
 */
final class Env
{
    /**
     * @return string|null
     */
    public static function get(string $clave, ?string $porDefecto = null): ?string
    {
        $valor = getenv($clave);

        if ($valor === false || trim($valor) === '') {
            return $porDefecto;
        }

        return $valor;
    }

    /**
     * Interpreta los valores habituales de una bandera booleana.
     */
    public static function bool(string $clave, bool $porDefecto = false): bool
    {
        $valor = self::get($clave);

        if ($valor === null) {
            return $porDefecto;
        }

        return in_array(strtolower($valor), ['1', 'true', 'yes', 'on', 'si'], true);
    }

    /**
     * @return int|null
     */
    public static function int(string $clave, ?int $porDefecto = null): ?int
    {
        $valor = self::get($clave);

        if ($valor === null || !is_numeric($valor)) {
            return $porDefecto;
        }

        return (int) $valor;
    }
}
