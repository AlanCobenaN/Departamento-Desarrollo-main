<?php

declare(strict_types=1);

/**
 * Aplica las migraciones pendientes y, con --seed, tambien los datos iniciales.
 *
 *   php api/database/migrate.php
 *   php api/database/migrate.php --seed
 *
 * Cada archivo de api/database/migrations/NNN_nombre.sql se aplica una sola
 * vez, en orden de version, dentro de una transaccion. El resultado queda
 * registrado en schema_migrations. Los archivos no deben incluir BEGIN ni
 * COMMIT: el runner ya los envuelve.
 *
 * Existe porque no todos los equipos tienen psql a mano, y porque en el
 * ordenador de desarrollo bloquea una directiva de Control de aplicaciones.
 * Sirve igual: usa el mismo PDO y el mismo .env que la API, asi que lo que
 * se carga aqui es exactamente lo que leera el sitio.
 */

use Fcvt\Database\Connection;
use Fcvt\Support\Env;

require dirname(__DIR__) . '/src/bootstrap.php';

$conDatos = in_array('--seed', $argv, true);
$directorio = __DIR__ . '/migrations';

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

// El registro de migraciones se crea fuera de las transacciones para que
// sobreviva incluso si la primera migracion falla.
try {
    $db->exec(
        'CREATE TABLE IF NOT EXISTS schema_migrations (
            version     text        PRIMARY KEY,
            nombre      text        NOT NULL,
            aplicada_en timestamptz NOT NULL DEFAULT now()
        )'
    );
} catch (Throwable $error) {
    fwrite(STDERR, sprintf(
        "No se pudo preparar schema_migrations: %s\n",
        $error->getMessage()
    ));
    exit(1);
}

if (!is_dir($directorio)) {
    fwrite(STDERR, "No se encuentra el directorio de migraciones: {$directorio}\n");
    exit(1);
}

$rutas = glob($directorio . '/*.sql');
$migraciones = [];

foreach ($rutas === false ? [] : $rutas as $ruta) {
    $archivo = basename($ruta);

    if (!preg_match('/^(\d{3})_([a-z0-9_]+)\.sql$/', $archivo, $partes)) {
        fwrite(STDERR, sprintf(
            "Nombre de migracion invalido: %s\nUsa NNN_nombre.sql, con tres digitos y minusculas.\n",
            $archivo
        ));
        exit(1);
    }

    [, $version, $nombre] = $partes;

    if (isset($migraciones[$version])) {
        fwrite(STDERR, sprintf(
            "Hay dos migraciones con la version %s: %s y %s\n",
            $version,
            $migraciones[$version]['archivo'],
            $archivo
        ));
        exit(1);
    }

    $migraciones[$version] = [
        'version' => $version,
        'nombre' => $nombre,
        'archivo' => $archivo,
        'ruta' => $ruta,
    ];
}

if ($migraciones === []) {
    fwrite(STDERR, "No hay archivos de migracion en {$directorio}\n");
    exit(1);
}

// Las versiones van con ceros a la izquierda, asi que el orden alfabetico
// coincide con el numerico.
ksort($migraciones, SORT_STRING);

$aplicadas = $db->query('SELECT version FROM schema_migrations')->fetchAll(PDO::FETCH_COLUMN);
$aplicadas = array_fill_keys(array_map('strval', $aplicadas), true);

$pendientes = array_filter(
    $migraciones,
    static fn (array $migracion): bool => !isset($aplicadas[$migracion['version']])
);

echo sprintf(
    "Migraciones encontradas: %d; pendientes: %d.\n\n",
    count($migraciones),
    count($pendientes)
);

$rolApp = Env::get('DB_APP_ROLE', 'fcvt_app');

foreach ($migraciones as $migracion) {
    if (isset($aplicadas[$migracion['version']])) {
        echo sprintf("Omitida %s (ya aplicada).\n", $migracion['archivo']);
        continue;
    }

    $sql = file_get_contents($migracion['ruta']);

    if ($sql === false) {
        fwrite(STDERR, "No se pudo leer {$migracion['ruta']}\n");
        exit(1);
    }

    echo sprintf("Aplicando %s...\n", $migracion['archivo']);

    try {
        $db->beginTransaction();

        // set_config(..., true) es local a la transaccion. La migracion 003
        // lee fcvt.app_role para saber a que rol conceder permisos.
        $config = $db->prepare("SELECT set_config('fcvt.app_role', :rol, true)");
        $config->execute([':rol' => $rolApp]);

        $db->exec($sql);

        $registro = $db->prepare(
            'INSERT INTO schema_migrations (version, nombre) VALUES (:version, :nombre)'
        );
        $registro->execute([
            ':version' => $migracion['version'],
            ':nombre' => $migracion['nombre'],
        ]);

        $db->commit();
    } catch (Throwable $error) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }

        fwrite(STDERR, sprintf(
            "\nFALLO en %s (transaccion revertida):\n%s\n",
            $migracion['archivo'],
            $error->getMessage()
        ));
        exit(1);
    }

    echo "  listo\n";
}

echo "\n";

if ($conDatos) {
    $rutaSeed = __DIR__ . '/seed.sql';
    $sql = is_file($rutaSeed) ? file_get_contents($rutaSeed) : false;

    if ($sql === false) {
        fwrite(STDERR, "No se pudo leer {$rutaSeed}\n");
        exit(1);
    }

    echo "Aplicando seed.sql — datos iniciales (BORRA la tabla proyectos)...\n";

    try {
        // seed.sql conserva su propio BEGIN/COMMIT porque tambien se puede
        // ejecutar a mano con psql.
        $db->exec($sql);
    } catch (Throwable $error) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }

        fwrite(STDERR, sprintf(
            "\nFALLO en seed.sql (transaccion revertida):\n%s\n",
            $error->getMessage()
        ));
        exit(1);
    }

    echo "  listo\n\n";
}

// Comprobacion de que la tabla quedo donde la API la va a buscar.
$total = $db->query('SELECT count(*) FROM proyectos')->fetchColumn();
$categorias = $db->query('SELECT count(DISTINCT categoria) FROM proyectos')->fetchColumn();

echo sprintf("Verificado: %d proyectos en %d categorias.\n", (int) $total, (int) $categorias);
