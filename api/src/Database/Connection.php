<?php

declare(strict_types=1);

namespace Fcvt\Database;

use Fcvt\Support\Env;
use PDO;

/**
 * Conexion unica a PostgreSQL mediante PDO.
 *
 * Se construye la primera vez que se pide y se reutiliza durante la peticion.
 * El servidor de desarrollo de PHP es de un solo hilo por proceso, asi que no
 * hace falta un pool: con un estatico por peticion basta.
 */
final class Connection
{
    private static ?PDO $conexion = null;

    public static function get(): PDO
    {
        if (self::$conexion instanceof PDO) {
            return self::$conexion;
        }

        $host = Env::get('DB_HOST', '127.0.0.1');
        $puerto = Env::get('DB_PORT', '5432');
        $nombre = Env::get('DB_NAME', 'fcvt');

        self::$conexion = new PDO(
            "pgsql:host={$host};port={$puerto};dbname={$nombre}",
            Env::get('DB_USER', 'postgres'),
            Env::get('DB_PASSWORD', ''),
            [
                // Lanza excepcion en vez de devolver false: el manejador
                // global de bootstrap.php ya sabe responder en JSON.
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,

                // Con consultas preparadas de verdad, no emuladas en PHP. Es
                // lo que impide que un valor con comillas altere la sentencia
                // y de paso hace la consulta un poco mas rapida.
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );

        return self::$conexion;
    }
}
