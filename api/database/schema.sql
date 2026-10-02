-- Esquema de la base de datos del equipo de desarrollo FCVT.
-- PostgreSQL 14 o superior.
--
-- Este archivo define la estructura. Los datos iniciales estan en seed.sql.
-- Es idempotente: se puede volver a ejecutar sin romper nada.

BEGIN;

-- ---------------------------------------------------------------------------
-- proyectos
-- ---------------------------------------------------------------------------
-- El catalogo que consume la landing a traves de la API.
--
-- Decisiones de diseno que conviene no deshacer sin pensarlo:
--
--   categoria es TEXT y no una tabla aparte. El frontend agrupa y filtra por
--   ese valor tal cual llega en el JSON, asi que normalizarlo a una FK
--   obligaria a hacer JOIN en cada lectura para volver a devolver un string.
--   Si algun dia las categorias necesitan descripcion o color propio, ahi si
--   conviene una tabla.
--
--   tecnologias es TEXT[] y no una tabla puente. El frontend solo las pinta
--   como lista de chips, nunca las filtra ni las ordena en el servidor. Una
--   tabla seria normalizacion sin ninguna consulta que lo justifique.
--
--   activo permite despublicar un proyecto sin borrarlo. La API filtra por
--   activo = true, asi que la landing deja de mostrarlo de inmediato y el
--   panel de administracion todavia lo conserva.
--
--   busqueda es una columna generada para el buscador de la seccion de
--   proyectos, indexada con GIN. El indice se crea aqui aunque hoy el frontend
--   filtre en el navegador: en cuanto el catalogo crezca hay que mover el
--   WHERE a PostgreSQL y el indice ya esta.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS proyectos (
    id              bigserial   PRIMARY KEY,
    nombre          text        NOT NULL,
    categoria       text        NOT NULL,
    descripcion     text        NOT NULL,
    tecnologias      text[]      NOT NULL DEFAULT '{}',
    url             text,
    activo          boolean     NOT NULL DEFAULT true,
    creado_en       timestamptz NOT NULL DEFAULT now(),
    actualizado_en  timestamptz NOT NULL DEFAULT now(),
    busqueda        tsvector    GENERATED ALWAYS AS (
                        to_tsvector(
                            'spanish',
                            coalesce(nombre, '') || ' ' || coalesce(descripcion, '')
                        )
                    ) STORED
);

-- Filtro por categoria en la landing.
CREATE INDEX IF NOT EXISTS proyectos_categoria_idx
    ON proyectos (categoria)
    WHERE activo = true;

-- Busqueda a texto completo en castellano.
CREATE INDEX IF NOT EXISTS proyectos_busqueda_idx
    ON proyectos USING gin (busqueda);

-- ---------------------------------------------------------------------------
-- Marca de actualizacion automatica
-- ---------------------------------------------------------------------------
-- El panel de administracion va a editar filas. Sin esto, actualizado_en solo
-- cambiaria en el INSERT y nunca mas.
--
-- El nombre de la funcion y el de la columna coinciden a proposito: el trigger
-- reescribe la columna de la tabla.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION marcar_actualizado_en()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.actualizado_en := now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS proyectos_actualizado_en_trg ON proyectos;

CREATE TRIGGER proyectos_actualizado_en_trg
    BEFORE UPDATE ON proyectos
    FOR EACH ROW
    EXECUTE FUNCTION marcar_actualizado_en();

-- ---------------------------------------------------------------------------
-- Categorias de referencia
-- ---------------------------------------------------------------------------
-- La API no las usa (ver la nota de diseno de arriba). Sirven para que el
-- panel de administracion ofrezca un desplegable con valores validos, y para
-- que nadie escriba "portales web" en lugar de "Portales Web" por descuido.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS categorias (
    nombre text PRIMARY KEY
);

INSERT INTO categorias (nombre) VALUES
    ('Gestión Interna'),
    ('Portales Web'),
    ('Educación'),
    ('Innovación'),
    ('Aplicaciones Móviles'),
    ('Investigación')
ON CONFLICT (nombre) DO NOTHING;

COMMIT;
