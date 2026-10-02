<?php

declare(strict_types=1);

namespace Fcvt\Controllers;

use Fcvt\Database\Connection;
use Fcvt\Services\ProyectoService;
use Fcvt\Support\Response;
use Throwable;

/**
 * Endpoints de lectura del catalogo.
 *
 * Los mensajes de error van en castellano sin tilde en la clave
 * ("message"), porque asi los consume frontend/src/utils/api.js.
 */
final class ProyectoController
{
    public function __construct(private readonly ProyectoService $service)
    {
    }

    /**
     * GET /api/health
     *
     * Comprueba tambien la base de datos. Un health que responde up con la
     * base caida sirve para nada: el orquestador veria verde con el servicio
     * roto.
     */
    public function health(): void
    {
        try {
            Connection::get()->query('SELECT 1');

            Response::json(200, [
                'ok' => true,
                'status' => 'up',
                'base_datos' => 'conectada',
            ]);
        } catch (Throwable) {
            // Sin base de datos el servicio no sirve de nada, asi que se
            // declara caido en vez de mentir con un 200.
            Response::json(503, [
                'ok' => false,
                'status' => 'degradado',
                'base_datos' => 'sin conexion',
            ]);
        }
    }

    /**
     * GET /api/projects
     */
    public function listar(): void
    {
        Response::json(200, [
            'ok' => true,
            'data' => $this->service->listar(),
        ]);
    }

    /**
     * GET /api/projects/{id}
     */
    public function detalle(int $id): void
    {
        $proyecto = $this->service->buscar($id);

        if ($proyecto === null) {
            Response::json(404, [
                'ok' => false,
                'error' => ['message' => "Proyecto {$id} no encontrado."],
            ]);
        }

        Response::json(200, [
            'ok' => true,
            'data' => $proyecto,
        ]);
    }
}
