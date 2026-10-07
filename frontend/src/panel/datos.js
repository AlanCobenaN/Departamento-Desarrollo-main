/**
 * Datos de partida del panel de administracion.
 *
 * OJO: el panel es un PROTOTIPO. Pinta lo que hay hoy en el sitio y deja
 * cambiarlo. Lo que cambias se guarda solo en este navegador (localStorage,
 * clave fcvt-panel, ver almacen.js): al recargar sigue ahí, en otro equipo no
 * y restablecer lo borra. Lo que se separa con una funcion es para que los
 * identificadores se generen desde cero cuando no hay nada guardado.
 *
 * Los valores iniciales son copia de la configuracion real (branding.js,
 * data/tech.js y public/catalogo.json) para que se vea contenido de verdad en
 * vez de placeholders, que es como se juzga un panel: por si encaja con lo
 * que hay, no por si los campos existen.
 *
 * Estos valores NO pasan por t(): son contenidos, no textos de interfaz.
 * Los rotulos del panel si; ver config/panelTexts.js.
 */

/**
 * Contador de identificadores de fila. Vive solo en memoria: al recargar se
 * vuelve a empezar, y no pasa nada porque las filas tampoco sobreviven.
 */
let secuencia = 0;
export function nuevoId() {
  secuencia += 1;
  return `fila-${secuencia}`;
}

/**
 * Iconos de Font Awesome que se pueden elegir en el selector.
 */
export const ICONOS = [
  "fa-solid fa-laptop-code",
  "fa-solid fa-mobile-screen-button",
  "fa-solid fa-robot",
  "fa-solid fa-server",
  "fa-solid fa-gears",
  "fa-solid fa-database",
  "fa-solid fa-code",
  "fa-solid fa-code-branch",
  "fa-solid fa-graduation-cap",
  "fa-solid fa-diagram-project",
  "fa-solid fa-layer-group",
  "fa-solid fa-cubes",
  "fa-solid fa-users",
  "fa-solid fa-envelope",
  "fa-solid fa-phone",
  "fa-solid fa-location-dot",
  "fa-solid fa-image",
  "fa-solid fa-images",
  "fa-solid fa-link",
  "fa-solid fa-globe",
  "fa-solid fa-lightbulb",
  "fa-solid fa-rocket",
  "fa-brands fa-react",
  "fa-brands fa-node-js",
  "fa-brands fa-js",
  "fa-brands fa-php",
  "fa-brands fa-html5",
  "fa-brands fa-css3-alt",
  "fa-brands fa-python",
  "fa-brands fa-github",
  "fa-brands fa-docker",
  "fa-brands fa-facebook-f",
  "fa-brands fa-instagram",
  "fa-brands fa-linkedin-in",
  "fa-brands fa-whatsapp",
];

export const ICONO_SERVICIO = "fa-solid fa-laptop-code";
export const ICONO_TECNOLOGIA = "fa-solid fa-code";

export function iconoONulo(valor, porDefecto) {
  const limpio = typeof valor === "string" ? valor.trim() : "";
  return limpio || porDefecto;
}

export const CATEGORIAS = ["Educación", "Gestión Interna", "Portales Web"];
export const ETIQUETAS_TECNOLOGIA = ["React", "Node.js", "Express", "PostgreSQL"];

export function datosIniciales() {
  return {
    servicios: [
      { id: nuevoId(), icono: "fa-solid fa-laptop-code", titulo: "Desarrollo web", descripcion: "Portales, intranets y sistemas de gestión a medida. Interfaces responsivas, accesibles y fáciles de usar." },
      { id: nuevoId(), icono: "fa-solid fa-mobile-screen-button", titulo: "Aplicaciones móviles", descripcion: "Apps para Android e iOS con avisos, horarios y trámites, para consultar todo desde el celular." },
      { id: nuevoId(), icono: "fa-solid fa-robot", titulo: "Automatización de procesos", descripcion: "Reportes automáticos, scripts e integraciones que eliminan el trabajo manual repetitivo." },
      { id: nuevoId(), icono: "fa-solid fa-server", titulo: "Soporte e infraestructura", descripcion: "Despliegue, respaldos, monitoreo y mantenimiento de los sistemas que usa la facultad." },
    ],
    tecnologias: [
      { id: nuevoId(), icono: "fa-brands fa-react", nombre: "React" },
      { id: nuevoId(), icono: "fa-brands fa-node-js", nombre: "Node.js" },
      { id: nuevoId(), icono: "fa-solid fa-database", nombre: "PostgreSQL" },
      { id: nuevoId(), icono: "fa-brands fa-php", nombre: "PHP" },
      { id: nuevoId(), icono: "fa-solid fa-code-branch", nombre: "Git" },
    ],
    proyectos: [],
    categorias: [...CATEGORIAS],
    etiquetasTecnologia: [...ETIQUETAS_TECNOLOGIA],
    galeria: [],
    whatsapp: {
      numero: "000000000",
      saludo: "Hola, equipo. Escribo desde la página web.",
      motivos: [
        { id: nuevoId(), etiqueta: "Un proyecto nuevo", texto: "Hola, soy {nombre}. Me gustaría hablar sobre un proyecto para el departamento.\n\n{mensaje}" },
        { id: nuevoId(), etiqueta: "Soporte técnico", texto: "Hola, soy {nombre}. Necesito ayuda con un tema de soporte técnico.\n\n{mensaje}" },
        { id: nuevoId(), etiqueta: "Otro asunto", texto: "Hola, soy {nombre}. Quería consultarles sobre otro asunto.\n\n{mensaje}" },
      ],
    },
    pie: {
      email: "correo@ejemplo.com",
      telefono: "+000 000-0000",
      ubicacion: "Manta, Manabí, Ecuador",
      redes: [],
      explorar: [
        { id: nuevoId(), etiqueta: "Inicio", href: "#inicio" },
        { id: nuevoId(), etiqueta: "Qué hacemos", href: "#servicios" },
        { id: nuevoId(), etiqueta: "Proyectos", href: "#proyectos" },
        { id: nuevoId(), etiqueta: "Galería", href: "#galeria" },
        { id: nuevoId(), etiqueta: "Escríbenos", href: "#escribenos" },
      ],
    },
    permisos: [],
  };
}