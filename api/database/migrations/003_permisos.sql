-- Permisos minimos del rol de base de datos que usa la API.
--
-- El rol NO se crea aqui ni se guarda su contrasena en el repositorio. Esta
-- migracion solo concede permisos si el rol ya existe; si no, avisa y sigue.
-- El nombre por defecto es fcvt_app y se puede cambiar con DB_APP_ROLE (el
-- runner lo pasa como fcvt.app_role).
--
-- La API puede leer, insertar y actualizar contenido y acceso, pero no borrar.
-- En auditoria solo puede insertar y leer. Tampoco se le concede TRUNCATE, y
-- se revoca por si lo tuviera de antes. DROP exige ser propietario de la
-- tabla, y este rol no lo es.
--
-- No incluyas BEGIN/COMMIT: migrate.php ya envuelve esta migracion.

DO $$
DECLARE
    rol_app text := coalesce(
        nullif(current_setting('fcvt.app_role', true), ''),
        'fcvt_app'
    );
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = rol_app) THEN
        RAISE NOTICE 'El rol % no existe; no se conceden permisos.', rol_app;
        RETURN;
    END IF;

    -- Sin USAGE en el esquema no puede ni resolver los nombres de tabla.
    EXECUTE format('GRANT USAGE ON SCHEMA public TO %I', rol_app);

    -- Contenido y acceso: lectura, alta y edicion. Sin DELETE.
    EXECUTE format(
        'GRANT SELECT, INSERT, UPDATE ON TABLE '
        'roles, usuarios, sesiones, intentos_login, proyectos, categorias, '
        'servicios, tecnologias_sitio, galeria, redes_sociales, enlaces_pie, '
        'configuracion TO %I',
        rol_app
    );

    -- Auditoria es de solo anadir y consultar: ni UPDATE ni DELETE.
    EXECUTE format('GRANT SELECT, INSERT ON TABLE auditoria TO %I', rol_app);

    -- Los bigserial necesitan la secuencia para poder insertar.
    EXECUTE format(
        'GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO %I',
        rol_app
    );

    -- Refuerza la decision: aunque el rol tuviera TRUNCATE de antes, se quita.
    EXECUTE format(
        'REVOKE TRUNCATE ON ALL TABLES IN SCHEMA public FROM %I',
        rol_app
    );

    RAISE NOTICE 'Permisos minimos concedidos al rol %.', rol_app;
END;
$$;
