-- Contenido editable desde el panel.
--
-- Repite el patron de proyectos: id bigserial, orden para el desplegable,
-- activo para despublicar sin borrar, autoria opcional y actualizado_en con
-- trigger. Las claves foraneas hacia usuarios usan ON DELETE RESTRICT porque
-- las cuentas se desactivan, no se borran.
--
-- No incluyas BEGIN/COMMIT: migrate.php ya envuelve esta migracion.

-- ---------------------------------------------------------------------------
-- proyectos: columnas que faltaban
-- ---------------------------------------------------------------------------
-- foto y url admiten nulo. destacado sustituye el recorte a 4 que hacia el
-- frontend, y orden deja que el panel decida la posicion.
-- ---------------------------------------------------------------------------

ALTER TABLE proyectos ADD COLUMN foto text;
ALTER TABLE proyectos ADD COLUMN destacado boolean NOT NULL DEFAULT false;
ALTER TABLE proyectos ADD COLUMN orden integer NOT NULL DEFAULT 0;
ALTER TABLE proyectos ADD COLUMN creado_por bigint REFERENCES usuarios (id) ON DELETE RESTRICT;
ALTER TABLE proyectos ADD COLUMN actualizado_por bigint REFERENCES usuarios (id) ON DELETE RESTRICT;

-- ---------------------------------------------------------------------------
-- URL y rutas internas
-- ---------------------------------------------------------------------------
-- Solo https://... o una ruta que empiece por / pero no por //. Asi se
-- rechazan javascript:, data:, http:// y las URLs protocol-relative.
-- La misma regla se aplica a las demas tablas de contenido.
-- ---------------------------------------------------------------------------

ALTER TABLE proyectos ADD CONSTRAINT proyectos_url_check CHECK (
    url IS NULL OR
    url ~ '^https://[^[:space:]]+$' OR
    (url LIKE '/%' AND url NOT LIKE '//%')
);

ALTER TABLE proyectos ADD CONSTRAINT proyectos_foto_check CHECK (
    foto IS NULL OR
    foto ~ '^https://[^[:space:]]+$' OR
    (foto LIKE '/%' AND foto NOT LIKE '//%')
);

-- Las categorias ya existen como texto. Antes de convertirlas en FK se
-- insertan las que falten para no perder filas en una base antigua con
-- valores escritos a mano.
INSERT INTO categorias (nombre)
SELECT DISTINCT categoria
FROM proyectos
ON CONFLICT (nombre) DO NOTHING;

ALTER TABLE proyectos
    ADD CONSTRAINT proyectos_categoria_fk
    FOREIGN KEY (categoria) REFERENCES categorias (nombre);

-- ---------------------------------------------------------------------------
-- servicios
-- ---------------------------------------------------------------------------

CREATE TABLE servicios (
    id              bigserial   PRIMARY KEY,
    titulo          text        NOT NULL,
    descripcion     text        NOT NULL,
    icono           text        NOT NULL,
    orden           integer     NOT NULL DEFAULT 0,
    activo          boolean     NOT NULL DEFAULT true,
    creado_por      bigint      REFERENCES usuarios (id) ON DELETE RESTRICT,
    actualizado_por bigint      REFERENCES usuarios (id) ON DELETE RESTRICT,
    creado_en       timestamptz NOT NULL DEFAULT now(),
    actualizado_en  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER servicios_actualizado_en_trg
    BEFORE UPDATE ON servicios
    FOR EACH ROW
    EXECUTE FUNCTION marcar_actualizado_en();

-- ---------------------------------------------------------------------------
-- tecnologias_sitio
-- ---------------------------------------------------------------------------

CREATE TABLE tecnologias_sitio (
    id              bigserial   PRIMARY KEY,
    nombre          text        NOT NULL,
    icono           text        NOT NULL,
    orden           integer     NOT NULL DEFAULT 0,
    activo          boolean     NOT NULL DEFAULT true,
    creado_por      bigint      REFERENCES usuarios (id) ON DELETE RESTRICT,
    actualizado_por bigint      REFERENCES usuarios (id) ON DELETE RESTRICT,
    creado_en       timestamptz NOT NULL DEFAULT now(),
    actualizado_en  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER tecnologias_sitio_actualizado_en_trg
    BEFORE UPDATE ON tecnologias_sitio
    FOR EACH ROW
    EXECUTE FUNCTION marcar_actualizado_en();

-- ---------------------------------------------------------------------------
-- galeria
-- ---------------------------------------------------------------------------

CREATE TABLE galeria (
    id              bigserial   PRIMARY KEY,
    titulo          text        NOT NULL,
    imagen_url      text        NOT NULL,
    texto_alt       text        NOT NULL,
    orden           integer     NOT NULL DEFAULT 0,
    activo          boolean     NOT NULL DEFAULT true,
    creado_por      bigint      REFERENCES usuarios (id) ON DELETE RESTRICT,
    actualizado_por bigint      REFERENCES usuarios (id) ON DELETE RESTRICT,
    creado_en       timestamptz NOT NULL DEFAULT now(),
    actualizado_en  timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT galeria_imagen_url_check CHECK (
        imagen_url ~ '^https://[^[:space:]]+$' OR
        (imagen_url LIKE '/%' AND imagen_url NOT LIKE '//%')
    )
);

CREATE TRIGGER galeria_actualizado_en_trg
    BEFORE UPDATE ON galeria
    FOR EACH ROW
    EXECUTE FUNCTION marcar_actualizado_en();

-- ---------------------------------------------------------------------------
-- redes_sociales
-- ---------------------------------------------------------------------------
-- La decision acordada aplica la misma regla de URL que al resto del
-- contenido, aunque el diagrama solo mencionaba https://.
-- ---------------------------------------------------------------------------

CREATE TABLE redes_sociales (
    id              bigserial   PRIMARY KEY,
    etiqueta        text        NOT NULL,
    icono           text        NOT NULL,
    url             text        NOT NULL,
    orden           integer     NOT NULL DEFAULT 0,
    activo          boolean     NOT NULL DEFAULT true,
    creado_por      bigint      REFERENCES usuarios (id) ON DELETE RESTRICT,
    actualizado_por bigint      REFERENCES usuarios (id) ON DELETE RESTRICT,
    creado_en       timestamptz NOT NULL DEFAULT now(),
    actualizado_en  timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT redes_sociales_url_check CHECK (
        url ~ '^https://[^[:space:]]+$' OR
        (url LIKE '/%' AND url NOT LIKE '//%')
    )
);

CREATE TRIGGER redes_sociales_actualizado_en_trg
    BEFORE UPDATE ON redes_sociales
    FOR EACH ROW
    EXECUTE FUNCTION marcar_actualizado_en();

-- ---------------------------------------------------------------------------
-- enlaces_pie
-- ---------------------------------------------------------------------------

CREATE TABLE enlaces_pie (
    id              bigserial   PRIMARY KEY,
    etiqueta        text        NOT NULL,
    href            text        NOT NULL,
    orden           integer     NOT NULL DEFAULT 0,
    activo          boolean     NOT NULL DEFAULT true,
    creado_por      bigint      REFERENCES usuarios (id) ON DELETE RESTRICT,
    actualizado_por bigint      REFERENCES usuarios (id) ON DELETE RESTRICT,
    creado_en       timestamptz NOT NULL DEFAULT now(),
    actualizado_en  timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT enlaces_pie_href_check CHECK (
        href ~ '^https://[^[:space:]]+$' OR
        (href LIKE '/%' AND href NOT LIKE '//%')
    )
);

CREATE TRIGGER enlaces_pie_actualizado_en_trg
    BEFORE UPDATE ON enlaces_pie
    FOR EACH ROW
    EXECUTE FUNCTION marcar_actualizado_en();

-- ---------------------------------------------------------------------------
-- configuracion
-- ---------------------------------------------------------------------------
-- Clave/valor para ajustes sueltos (WhatsApp, textos). El valor es jsonb para
-- no inventar una columna por cada ajuste futuro. No tiene creado_por porque
-- se siembra fuera del panel; actualizado_por queda nullable.
-- ---------------------------------------------------------------------------

CREATE TABLE configuracion (
    clave           text        PRIMARY KEY,
    valor           jsonb       NOT NULL,
    actualizado_por bigint      REFERENCES usuarios (id) ON DELETE RESTRICT,
    actualizado_en  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER configuracion_actualizado_en_trg
    BEFORE UPDATE ON configuracion
    FOR EACH ROW
    EXECUTE FUNCTION marcar_actualizado_en();
