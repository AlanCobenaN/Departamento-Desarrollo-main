<?php

declare(strict_types=1);

namespace Fcvt\Services;

use Fcvt\Repositories\ProyectoRepository;

/**
 * Reglas del catalogo de proyectos.
 *
 * Hoy es una capa fina, y esa es la intencion: el dia que el panel de
 * administracion Necesite validar que una url sea https, o que un proyecto no
 * se repita, esas reglas viven aqui y no en el controlador.
 */
final class ProyectoService
{
    public function __construct(private readonly ProyectoRepository $repository)
    {
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function listar(): array
    {
        return $this->repository->todos();
    }

    /**
     * @return array<string, mixed>|null
     */
    public function buscar(int $id): ?array
    {
        return $this->repository->porId($id);
    }
}
