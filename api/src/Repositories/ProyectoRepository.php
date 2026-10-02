<?php

declare(strict_types=1);

namespace Fcvt\Repositories;

use PDO;

/**
 * Acceso a la tabla proyectos.
 *
 * Es la unica clase que escribe SQL. Lo que hay por encima (servicio,
 * controlador) trabaja con arrays de PHP y no sabe que existe PostgreSQL.
 */
final class ProyectoRepository
{
    /**
     * Columnas que se exponen al cliente.
     *
     * El asterisco queda prohibido a proposito: busqueda es una columna
     * generada que pesa en la respuesta y no le sirve a nadie fuera de
     * PostgreSQL.
     *
     * tecnologias se pide como to_json(). PDO con pgsql devuelve una columna
     * text[] tal cual como literal de PostgreSQL, es decir la cadena
     * "{React,Node.js}", no como array de PHP. Convertirla en el servidor
     * entrega JSON de verdad y deja en manos de PostgreSQL los casos raros:
     * una tecnologia con coma, con comilla o con barra invertida. Parsear el
     * literal a mano seria justo el tipo de codigo que se equivoca en silencio.
     */
    private const CAMPOS =
        'id, nombre, categoria, descripcion, to_json(tecnologias) AS tecnologias, url';

    public function __construct(private readonly PDO $db)
    {
    }

    /**
     * Catalogo completo de proyectos publicados, en orden de id.
     *
     * Devuelve el catalogo entero y no una seleccion: el recorte a los
     * destacados lo hace el frontend en utils/api.js con FEATURED_LIMIT.
     *
     * @return array<int, array<string, mixed>>
     */
    public function todos(): array
    {
        $sql = 'SELECT ' . self::CAMPOS . ' FROM proyectos WHERE activo = true ORDER BY id';

        $filas = $this->db->query($sql)->fetchAll();

        return array_map(fn (array $fila): array => $this->hidratar($fila), $filas);
    }

    /**
     * Un proyecto por id, o null si no existe o esta despublicado.
     *
     * @return array<string, mixed>|null
     */
    public function porId(int $id): ?array
    {
        $sql = 'SELECT ' . self::CAMPOS . ' FROM proyectos WHERE id = :id AND activo = true';

        $sentencia = $this->db->prepare($sql);
        $sentencia->execute([':id' => $id]);

        $fila = $sentencia->fetch();

        return $fila === false ? null : $this->hidratar($fila);
    }

    /**
     * Convierte una fila de PostgreSQL al formato que espera el JSON.
     *
     * @param array<string, mixed> $fila
     * @return array<string, mixed>
     */
    private function hidratar(array $fila): array
    {
        // bigserial vuelve como string en PHP; el frontend lo usa para
        // comparar ids, asi que se devuelve como entero.
        $fila['id'] = (int) $fila['id'];

        $fila['tecnologias'] = $this->normalizarTecnologias($fila['tecnologias']);

        // El orden de las claves es el del SELECT, que es el mismo que quiere
        // el contrato. url puede venir null: la tarjeta lo comprueba antes de
        // convertirla en enlace.
        return $fila;
    }

    /**
     * to_json() entrega una cadena JSON. Se decodifica a un array de cadenas y
     * se reindexa con array_values para que json_encode lo produzca como
     * array JSON y no como objeto: si las claves no fueran 0,1,2... el
     * frontend recibiria {"0":"React"} y las tarjetas se verian vacias.
     *
     * Si algun dia la columna se lee con otro driver y llega ya como array, se
     * acepta tal cual, para no atar el formato a una sola conexion.
     *
     * @return array<int, string>
     */
    private function normalizarTecnologias(mixed $valor): array
    {
        if (is_array($valor)) {
            return array_values(array_map(static fn ($item): string => (string) $item, $valor));
        }

        if (!is_string($valor) || trim($valor) === '') {
            return [];
        }

        $decodificado = json_decode($valor, true);

        if (!is_array($decodificado)) {
            return [];
        }

        return array_values(array_map(static fn ($item): string => (string) $item, $decodificado));
    }
}
