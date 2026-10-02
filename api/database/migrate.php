<?php

declare(strict_types=1);

/**
 * Aplica la estructura y, con --seed, tambien los datos iniciales.
 *
 *   php api/database/migrate.php
 *   php api/database/migrate.php --seed
 *
 * Existe porque no todos los equipos tienen psql a mano, y porque en el
 * ordenador de desarrollo bloquea una directiva de Control de aplicaciones.
 * Sirve igual: usa el mismo PDO y el mismo .env que la API, asi que lo que
 * se carga aqui es exactamente lo que leera el sitio.
 */

use Fcvt\Database\Connection;
use Fcvt\Support\Env;

require dirname(__DIR__) . '/src/bootstrap.php';

$conConDatos = in_array('--seed', $argv, true);

$archivos = [['schema.sql', 'Estructura']];
if ($conConDatos) {
    $archivos[] = ['seed.sql', 'Datos iniciales (BORRA la tabla proyectos)'];
}

try {
    $db = Connection::get();
} catch (Throwable $error) {
    fwrite(STDERR, sprintf(
        "No se pudo conectar a PostgreSQL: %s\n\nRevisa DB_HOST, DB_PORT, DB_NAME, DB_USER y DB_PASSWORD en api/.env.\n",
        $error->getMessage()
    ));
    exit(1);
}

$base = Env::get('DB_NAME', 'fcvt');
echo "Conectado a la base \"{$base}\".\n\n";

foreach ($archivos as [$archivo, $descripcion]) {
    $ruta = __DIR__ . '/' . $archivo;

    if (!is_file($ruta)) {
        fwrite(STDERR, "No se encuentra {$ruta}\n");
        exit(1);
    }

    $sql = file_get_contents($ruta);

    if ($sql === false) {
        fwrite(STDERR, "No se pudo leer {$ruta}\n");
        exit(1);
    }

    echo "Aplicando {$archivo} — {$descripcion}...\n";

    try {
        // pgsql acepta varias sentencias en una sola consulta simple, asi que
        // el archivo entero va de una. Los bloques $$ del disparador de
        // actualizado_en los resuelve el servidor.
        $db->exec($sql);
    } catch (Throwable $error) {
        fwrite(STDERR, sprintf("\nFALLO en %s: %s\n", $archivo, $error->getMessage()));
        exit(1);
    }

    echo "  listo\n\n";
}

// Comprobacion de que la tabla quedo donde la API la va a buscar.
$total = $db->query('SELECT count(*) FROM proyectos')->fetchColumn();
$categorias = $db->query('SELECT count(DISTINCT categoria) FROM proyectos')->fetchColumn();

echo sprintf("Verificado: %d proyectos en %d categorias.\n", (int) $total, (int) $categorias);
