-- Datos iniciales del catalogo de proyectos.
--
-- AVISO: este archivo BORRA la tabla proyectos antes de insertar. Sirve para
-- desarrollo y para montar la base desde cero. No lo ejecutes en produccion:
-- ahi los proyectos los crea y edita el panel de administracion.
--
-- No crea usuarios ni contrasenas. El primer admin se creara con un script de
-- linea de comandos aparte.
--
-- El orden de los INSERT no importa, pero el catalogo esta ordenado por id
-- para que la API los devuelva igual que la version anterior en Express.
-- Los cuatro primeros quedan destacados y ordenados del 1 al 4; el resto
-- conserva un orden estable del 5 al 8.

BEGIN;

TRUNCATE TABLE proyectos RESTART IDENTITY;

INSERT INTO proyectos (nombre, categoria, descripcion, tecnologias, url, destacado, orden) VALUES
(
    'Sistema de Gestión de Proyectos FCVT',
    'Gestión Interna',
    'Plataforma interna para planificar, asignar y dar seguimiento a los proyectos del equipo. Incluye tableros, hitos y reportes de avance.',
    ARRAY['React', 'Node.js', 'Express', 'PostgreSQL'],
    'https://proyectos.fcvt.edu.ec',
    true,
    1
),
(
    'Portal de Servicios Digitales',
    'Portales Web',
    'Ventanilla única en línea donde la comunidad universitaria solicita trámites, constancias y soporte técnico.',
    ARRAY['React', 'Node.js', 'PostgreSQL'],
    'https://servicios.fcvt.edu.ec',
    true,
    2
),
(
    'Biblioteca Digital FCVT',
    'Educación',
    'Catálogo en línea de recursos académicos, repositorio de tesis y acceso a bases de datos científicas.',
    ARRAY['Vue', 'Node.js', 'Elasticsearch'],
    'https://biblioteca.fcvt.edu.ec',
    true,
    3
),
(
    'Aula Virtual Completa',
    'Educación',
    'Plataforma Moodle corporativa con los cursos, talleres y laboratorios de la facultad. El sitio referencia toma su tema Academi.',
    ARRAY['Moodle', 'PHP', 'MySQL'],
    'https://aula.fcvt.edu.ec',
    true,
    4
),
(
    'Laboratorio de Innovación',
    'Innovación',
    'Espacio multiusos con impresión 3D, electrónica y desarrollo de prototipos para estudiantes y docentes.',
    ARRAY['IoT', 'Arduino', 'Impresión 3D'],
    'https://innovacion.fcvt.edu.ec',
    false,
    5
),
(
    'APP FCVT Estudiantes',
    'Aplicaciones Móviles',
    'Aplicación móvil con horarios, notas, eventos y avisos de la facultad, disponible para Android e iOS.',
    ARRAY['React Native', 'Node.js', 'Firebase'],
    'https://app.fcvt.edu.ec',
    false,
    6
),
(
    'Sistema de Encuestas y Evaluaciones',
    'Gestión Interna',
    'Herramienta para diseñar encuestas, evaluaciones docentes y sondeos de satisfacción, con reportes en tiempo real.',
    ARRAY['React', 'Node.js', 'MongoDB'],
    'https://encuestas.fcvt.edu.ec',
    false,
    7
),
(
    'Red de Investigadores FCVT',
    'Investigación',
    'Directorio colaborativo de docentes-investigadores, grupos y líneas de investigación de la facultad.',
    ARRAY['Next.js', 'PostgreSQL'],
    'https://investigadores.fcvt.edu.ec',
    false,
    8
);

COMMIT;
