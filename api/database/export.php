<?php

declare(strict_types=1);

/**
 * Exporta el catalogo de PostgreSQL a frontend/public/catalogo.json.
 *
 *   php api/database/export.php
 *
 * Ese archivo es la red de seguridad del sitio publicado. GitHub Pages solo
 * aloja el frontend, asi que cuando la API todavia no esta alojada en ninguna
 * parte, el navegador no tiene a quien preguntar y el sitio se quedaria sin
 * proyectos.
 *
 * El frontend usa este archivo solo cuando la API no responde. En cuanto hay
 * API, manda ella. Por eso el archivo lleva el catalogo entero y el recorte a
 * los destacados se queda en el frontend, que es donde se decide que se ve.
 *
 * Es una foto, no una copia viva: si se edita un proyecto en la base hay que
 * volver a ejecutar esto. Por eso `npm run catalogo`.
 */

use Fcvt\Database\Connection;

require dirname(__DIR__) . '/src/bootstrap.php';

$destino = dirname(__DIR__, 2) . '/frontend/public/catalogo.json';

try {
    $db = Connection::get();
} catch (Throwable $error) {
    fwrite(STDERR, sprintf(
        "No se pudo conectar a PostgreSQL: %s\n\nRevisa DB_* en api/.env.\n",
        $error->getMessage()
    ));
    exit(1);
}

try {
    $proyectos = $db->query(
        'SELECT id, nombre, categoria, descripcion, to_json(tecnologias) AS tecnologias, url
         FROM proyectos
         ORDER BY id'
    )->fetchAll(PDO::FETCH_ASSOC);
} catch (Throwable $error) {
    fwrite(STDERR, sprintf("No se pudo leer la tabla proyectos: %s\n", $error->getMessage()));
    exit(1);
}

if ($proyectos === []) {
    fwrite(STDERR, "La tabla proyectos esta vacia. Carga los datos con migrate.php --seed.\n");
    exit(1);
}

// tecnologias llega como texto JSON desde to_json(); se decodifica para que el
// archivo tenga listas de verdad y no cadenas.
foreach ($proyectos as &$proyecto) {
    $proyecto['tecnologias'] = json_decode((string) $proyecto['tecnologias'], true) ?: [];
    $proyecto['id'] = (int) $proyecto['id'];
}
unset($proyecto);

$contenido = json_encode(
    [
        'ok' => true,
        'generado' => date('c'),
        'total' => count($proyectos),
        'data' => $proyectos,
    ],
    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
);

if ($contenido === false) {
    fwrite(STDERR, "No se pudo serializar el catalogo a JSON.\n");
    exit(1);
}

$directorio = dirname($destino);
if (!is_dir($directorio) && !mkdir($directorio, 0o777, true) && !is_dir($directorio)) {
    fwrite(STDERR, "No se pudo crear el directorio {$directorio}.\n");
    exit(1);
}

// Escritura atomica: se escribe a un temporal y se renombra. Si algo se corta a
// mitad, el sitio nunca llega a leer un JSON truncado, que lo dejaria sin
// catalogo del todo.
$temporal = $destino . '.tmp';
if (file_put_contents($temporal, $contenido . "\n", LOCK_EX) === false) {
    fwrite(STDERR, "No se pudo escribir {$temporal}.\n");
    exit(1);
}

if (!rename($temporal, $destino)) {
    fwrite(STDERR, "No se pudo renegar el temporal a {$destino}.\n");
    @unlink($temporal);
    exit(1);
}

printf(
    "Catalogo exportado: %d proyectos.\n  %s\n\nSe ha usado una foto de la base, no la API. Regeneralo con npm run catalogo.\n",
    count($proyectos),
    $destino
);
