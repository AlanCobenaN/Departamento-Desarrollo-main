import { panelEn, panelEs } from "./panelTexts.js";

/**
 * Identidad del sitio — inspirada en el tema "Academi" del aula virtual de la
 * institución.
 * Colores de marca extraídos del logo "logo_40_años": azul institucional
 * #034B88 (tono 207°) y dorado #DCB469 (tono 37°).
 */

/**
 * Añade la carpeta base a la ruta de un fichero de /public.
 *
 * Vite solo reescribe las rutas que se importan desde el código y las que
 * aparecen en el CSS. Una cadena escrita a mano como "/logos/logo.png" la
 * deja intacta, y al desplegar en GitHub Pages el sitio no vive en la raíz
 * del dominio sino en /<nombre-del-repo>/, así que esas rutas darían 404.
 * import.meta.env.BASE_URL vale "/" en local y la ruta real en producción.
 *
 * En el CSS no hace falta: ahí sí reescribe Vite.
 */
const asset = (ruta) => `${import.meta.env.BASE_URL}${ruta.replace(/^\//, "")}`;

const site = {
  name: "Equipo de Desarrollo de Soluciones Tecnológicas",
  faculty: "Departamento de Desarrollo",
  university: "Estudios y Construcciones ULEAM-EP",
  initials: "ULEAM-EP",
  city: "Manta, Manabí, Ecuador",
  slogan: "Ciencia y tecnología al servicio de la vida",

  // Logo del sitio. PNG de 1254x1254 con canal alfa, servido desde
  // /public/logos. En el navbar se usa como mascara CSS, asi que ahi solo
  // importa la silueta; en el pie se ve el archivo tal cual.
  logoShield: asset("/logos/logo.png"),
  heroImage: asset("/hero-galeria.jpg"), // portada optimizada del slider (76 KB)
  galleryImage: asset("/galeria-demo.jpg"), // vista de la galería (53 KB)

  // Fondos del carrusel de la portada. Son imagenes de ejemplo del
  // prototipo; se reemplazan por fotos reales solo cambiando esta lista.
  heroSlides: [
    { src: asset("/hero-galeria.jpg"), alt: "" },
    { src: asset("/galeria-demo.jpg"), alt: "" },
    { src: asset("/img/galeria/pantalla-1.svg"), alt: "" },
    { src: asset("/img/galeria/pantalla-3.svg"), alt: "" },
  ],

  // Imágenes de ejemplo del prototipo (mockups de interfaz)
  screens: [
    { file: asset("/img/galeria/pantalla-1.svg"), key: "gallery.s1" },
    { file: asset("/img/galeria/pantalla-2.svg"), key: "gallery.s2" },
    { file: asset("/img/galeria/pantalla-3.svg"), key: "gallery.s3" },
  ],

  // Contacto: valores de ejemplo, nunca datos reales
  contact: {
    email: "correo@ejemplo.com",
    phone: "+000 000-0000",

    // Numero de WhatsApp para el formulario de contacto. Solo digitos y con el
    // prefijo del pais, que es lo que exige wa.me (Ecuador seria 593 9XX XXX
    // XXX). Sin el +, sin espacios y sin guiones.
    //
    // De momento es un relleno DELIBERADO: 000000000 no es un numero real, asi
    // que el formulario abre WhatsApp pero no puede escribirle a ningun
    // desconocido. Al fijar el numero real basta cambiar esta linea.
    whatsapp: "000000000",
  },

  pages: [
    { key: "nav.quienesSomos", href: "#", icon: "fa-solid fa-users" },
    { key: "nav.noticias", href: "#", icon: "fa-solid fa-newspaper" },
    { key: "nav.ayuda", href: "#", icon: "fa-solid fa-circle-question" },
  ],

  // Redes: las que aún no tienen perfil real se dejan en "#" y el pie las
  // muestra desactivadas en vez de enlazar a la página principal de la red.
  socials: [
    { href: "#", icon: "fa-brands fa-facebook-f", label: "Facebook" },
    { href: "#", icon: "fa-brands fa-instagram", label: "Instagram" },
    { href: "#", icon: "fa-brands fa-linkedin-in", label: "LinkedIn" },
    {
      href: "https://github.com/AlanCobenaN",
      icon: "fa-brands fa-github",
      label: "GitHub",
    },
  ],
};

/** Paleta institucional (referencia; los colores reales viven en index.css) */
export const palette = {
  primary: "#034B88",
  primaryDark: "#0B2F54",
  accent: "#DCB469",
};

/** Diccionario de textos ES/EN */
export const translations = {
  es: {
    ...panelEs,
    nav: {
      inicio: "Inicio",
      servicios: "Qué hacemos",
      proyectos: "Proyectos",
      galeria: "Galería",
      contacto: "Contacto",
      menu: "Abrir menú de navegación",
      cerrar: "Cerrar menú",
      secciones: "Secciones",
      paginas: "Más páginas",
      quienesSomos: "Quiénes somos",
      noticias: "Noticias",
      ayuda: "Ayuda y soporte",
      login: "Iniciar sesión",
      proximamente: "Próximamente",
      tema: "Cambiar entre modo claro y oscuro",
      idioma: "Idioma",
      ajustes: "Ajustes",
      temaCorto: "Tema",
      claro: "Claro",
      oscuro: "Oscuro",
      saltar: "Saltar al contenido principal",
      principal: "Navegación principal",
    },
    hero: {
      carrusel: "Galería de la portada",
      anterior: "Imagen anterior",
      siguiente: "Imagen siguiente",
      irA: "Ir a la imagen",
      title: "Sistemas web, apps y herramientas que ahorran horas a la facultad.",
      lead:
        "Diseñamos herramientas digitales para estudiantes, docentes y personal administrativo de la facultad.",
      primaryCta: "Ver proyectos",
      secondaryCta: "Ver galería",
      statProyectos: "Proyectos activos",
      statStack: "Tecnologías",
      statCampus: "Sede Manta",
    },
    services: {
      eyebrow: "Qué hacemos",
      title: "Software que resuelve el día a día de la facultad",
      subtitle: "Cuatro áreas de trabajo, un mismo equipo.",
      web: {
        title: "Desarrollo web",
        desc: "Portales, intranets y sistemas de gestión a medida. Interfaces responsivas, accesibles y fáciles de usar.",
      },
      mobile: {
        title: "Aplicaciones móviles",
        desc: "Apps para Android e iOS con avisos, horarios y trámites, para consultar todo desde el celular.",
      },
      automation: {
        title: "Automatización de procesos",
        desc: "Reportes automáticos, scripts e integraciones que eliminan el trabajo manual repetitivo.",
      },
      support: {
        title: "Soporte e infraestructura",
        desc: "Despliegue, respaldos, monitoreo y mantenimiento de los sistemas que usa la facultad.",
      },
    },
    tech: {
      eyebrow: "Tecnologías",
      title: "Con qué lo construimos",
      subtitle: "El stack que usamos todos los días en la facultad.",
    },
    projects: {
      title: "Proyectos en desarrollo",
      subtitle:
        "Herramientas que construimos para la comunidad de Estudios y Construcciones ULEAM-EP.",
      buscar: "Buscar proyecto",
      placeholder: "Buscar por nombre o tecnología…",
      filtro: "Filtrar por categoría",
      todas: "Todas",
      resultados: "proyectos",
      resultado: "proyecto",
      vacio: "No encontramos proyectos con ese criterio.",
      limpiar: "Limpiar filtros",
      tecnologias: "Tecnologías",
      ver: "Ver proyecto",
      proximamente: "Pronto",
      cargando: "Cargando proyectos…",
      error: "No pudimos cargar los proyectos.",
      reintentar: "Reintentar",
    },
    gallery: {
      eyebrow: "Imágenes del proyecto",
      title: "Galería",
      subtitle: "Una muestra visual de la plataforma y sus proyectos.",
      empty: "Todavía no hay imágenes que mostrar.",
      cerrar: "Cerrar galería",
      anterior: "Imagen anterior",
      siguiente: "Imagen siguiente",
      ayuda: "Usa las flechas del teclado para navegar y Esc para cerrar.",
      s1: "Panel general",
      s2: "Directorio de investigadores",
      s3: "Calendario académico",
      s4: "Reportes y estadísticas",
      s5: "Versión móvil",
      s6: "Gestión de notas",
    },
    footer: {
      explorar: "Explorar",
      contactTitle: "Contacto",
      follow: "Síguenos",
      description:
        "Desarrollo de software y soporte tecnológico para la comunidad universitaria.",
      copy: "© {year} Departamento de Desarrollo — Estudios y Construcciones ULEAM-EP.",
      placeholders: "Datos de ejemplo para el prototipo.",
    },
    whatsapp: {
      eyebrow: "¿Necesitas algo?",
      title: "Escríbenos por WhatsApp",
      subtitle:
        "Cuéntanos qué necesitas y te respondemos por el mismo canal. Sin registros ni contraseñas.",
      sinRegistro: "Sin registro ni contraseña de por medio",
      sinCorreo: "El mensaje llega directo a nuestro WhatsApp",
      directo: "Tú decides si lo envías o no",
      // Saludo que lleva el enlace de WhatsApp del menú de navegación, que no
      // pasa por el formulario y por tanto no tiene ningún campo que poner.
      saludo: "Hola, equipo. Escribo desde la página web.",
      nombre: "Nombre",
      nombrePlaceholder: "¿Cómo te llamas?",
      motivo: "Motivo",
      motivoPlaceholder: "Elige un motivo",
      motivos: {
        proyecto: "Un proyecto nuevo",
        soporte: "Soporte técnico",
        otro: "Otro asunto",
      },
      mensaje: "Mensaje",
      mensajePlaceholder: "Escribe tu consulta…",
      enviar: "Enviar por WhatsApp",
      // Un texto de arranque por motivo, no una plantilla única con el motivo
      // metido en medio: "Escribo por un proyecto nuevo" se lee mucho mejor que
      // una linea de "Motivo:". Los {entre llaves} los sustituye el componente.
      textos: {
        proyecto:
          "Hola, soy {nombre}. Me gustaría hablar sobre un proyecto para el departamento.\n\n{mensaje}",
        soporte:
          "Hola, soy {nombre}. Necesito ayuda con un tema de soporte técnico.\n\n{mensaje}",
        otro: "Hola, soy {nombre}. Quería consultarles sobre otro asunto.\n\n{mensaje}",
      },
      enviado: "Abrimos WhatsApp en una pestaña nueva con tu mensaje.",
      aviso:
        "Todavía no hay un número configurado, así que el enlace no llega a nadie.",
    },
    backToTop: "Volver arriba",

    login: {
      titulo: "Iniciar sesión",
      subtitulo: "Acceso al área interna del equipo de desarrollo",
      correo: "Correo institucional",
      correoEjemplo: "nombre@live.uleam.edu.ec",
      correoDominios: "Se admiten @live.uleam.edu.ec y @uleam.edu.ec",
      contrasena: "Contraseña",
      mostrar: "Mostrar la contraseña",
      ocultar: "Ocultar la contraseña",
      recordar: "Recordar mi correo",
      olvidar: "¿Olvidaste tu contraseña?",
      entrar: "Entrar",
      volver: "Volver al sitio",
      errorCorreo: "Escribe un correo institucional (@live.uleam.edu.ec o @uleam.edu.ec).",
      errorContrasena: "La contraseña necesita al menos 8 caracteres.",
      errorCampos: "Rellena el correo y la contraseña.",
      errorCredenciales: "El correo o la contraseña no coinciden.",
      cuentaPrototipo: "Cuenta del prototipo",
      avisoPrototipo:
        "Es un acceso de prueba, abierto a propósito y sin contraseña real. Cuando haya autenticación de verdad, esto desaparece.",
    },
    a11y: {
      title: "Opciones de accesibilidad",
      open: "Abrir menú de accesibilidad",
      close: "Cerrar menú de accesibilidad",
      vision: "Visión",
      text: "Lectura",
      motion: "Movimiento y puntero",
      textSize: "Tamaño del texto",
      normal: "Normal",
      large: "Grande",
      xlarge: "Muy grande",
      contrast: "Contraste",
      contrastNormal: "Estándar",
      contrastHigh: "Alto contraste",
      grayscale: "Modo sin color",
      dyslexia: "Fuente de lectura fácil",
      underlineLinks: "Subrayar todos los enlaces",
      reduceMotion: "Eliminar animaciones",
      lineHeight: "Espaciado de líneas",
      relaxed: "Ampliado",
      bigCursor: "Puntero grande",
      reset: "Restablecer todo",
      hint: "Los cambios se aplican al instante y se recuerdan.",
    },
  },
  en: {
    ...panelEn,
    nav: {
      inicio: "Home",
      servicios: "What we do",
      proyectos: "Projects",
      galeria: "Gallery",
      contacto: "Contact",
      menu: "Open navigation menu",
      cerrar: "Close menu",
      secciones: "Sections",
      paginas: "More pages",
      quienesSomos: "About us",
      noticias: "News",
      ayuda: "Help and support",
      login: "Sign in",
      proximamente: "Coming soon",
      tema: "Switch between light and dark mode",
      idioma: "Language",
      ajustes: "Settings",
      temaCorto: "Theme",
      claro: "Light",
      oscuro: "Dark",
      saltar: "Skip to main content",
      principal: "Main navigation",
    },
    hero: {
      carrusel: "Hero image gallery",
      anterior: "Previous image",
      siguiente: "Next image",
      irA: "Go to image",
      title: "Web systems, apps and tools that save the college hours.",
      lead:
        "We design digital tools for students, faculty and administrative staff.",
      primaryCta: "View projects",
      secondaryCta: "View gallery",
      statProyectos: "Active projects",
      statStack: "Technologies",
      statCampus: "Manta campus",
    },
    services: {
      eyebrow: "What we do",
      title: "Software that solves the college's day-to-day work",
      subtitle: "Four areas of work, one team.",
      web: {
        title: "Web development",
        desc: "Custom portals, intranets and management systems. Responsive, accessible and easy-to-use interfaces.",
      },
      mobile: {
        title: "Mobile apps",
        desc: "Android and iOS apps with notices, schedules and procedures, so everything is available from a phone.",
      },
      automation: {
        title: "Process automation",
        desc: "Automatic reports, scripts and integrations that eliminate repetitive manual work.",
      },
      support: {
        title: "Support and infrastructure",
        desc: "Deployment, backups, monitoring and maintenance for the systems the college runs on.",
      },
    },
    tech: {
      eyebrow: "Technologies",
      title: "What we build it with",
      subtitle: "The stack we use every day at the college.",
    },
    projects: {
      title: "Projects in development",
      subtitle: "Tools we build for the Estudios y Construcciones ULEAM-EP community.",
      buscar: "Search projects",
      placeholder: "Search by name or technology…",
      filtro: "Filter by category",
      todas: "All",
      resultados: "projects",
      resultado: "project",
      vacio: "No projects matched your search.",
      limpiar: "Clear filters",
      tecnologias: "Technologies",
      ver: "View project",
      proximamente: "Coming soon",
      cargando: "Loading projects…",
      error: "We could not load the projects.",
      reintentar: "Retry",
    },
    gallery: {
      eyebrow: "Project images",
      title: "Gallery",
      subtitle: "A visual sample of the platform and its projects.",
      empty: "There are no images to show yet.",
      cerrar: "Close gallery",
      anterior: "Previous image",
      siguiente: "Next image",
      ayuda: "Use the arrow keys to browse and Esc to close.",
      s1: "Main dashboard",
      s2: "Research directory",
      s3: "Academic calendar",
      s4: "Reports and statistics",
      s5: "Mobile version",
      s6: "Grade management",
    },
    footer: {
      explorar: "Explore",
      contactTitle: "Contact",
      follow: "Follow us",
      description: "Software development and technical support for the university community.",
      copy: "© {year} Departamento de Desarrollo — Estudios y Construcciones ULEAM-EP.",
      placeholders: "Sample data for the prototype.",
    },
    whatsapp: {
      eyebrow: "Do you need something?",
      title: "Message us on WhatsApp",
      subtitle:
        "Tell us what you need and we will reply on the same channel. No sign-up, no passwords.",
      sinRegistro: "No sign-up and no password involved",
      sinCorreo: "The message goes straight to our WhatsApp",
      directo: "You decide whether to send it or not",
      saludo: "Hi team. I'm writing from the website.",
      nombre: "Name",
      nombrePlaceholder: "What is your name?",
      motivo: "Topic",
      motivoPlaceholder: "Pick a topic",
      motivos: {
        proyecto: "A new project",
        soporte: "Technical support",
        otro: "Something else",
      },
      mensaje: "Message",
      mensajePlaceholder: "Write your question…",
      enviar: "Send via WhatsApp",
      textos: {
        proyecto:
          "Hi, I'm {nombre}. I would like to talk about a project for the department.\n\n{mensaje}",
        soporte: "Hi, I'm {nombre}. I need help with a technical support issue.\n\n{mensaje}",
        otro: "Hi, I'm {nombre}. I wanted to ask you about something else.\n\n{mensaje}",
      },
      enviado: "We opened WhatsApp in a new tab with your message.",
      aviso:
        "There is no number configured yet, so the link does not reach anyone.",
    },
    backToTop: "Back to top",

    login: {
      titulo: "Sign in",
      subtitulo: "Access to the development team's internal area",
      correo: "Institutional email",
      correoEjemplo: "name@live.uleam.edu.ec",
      correoDominios: "Both @live.uleam.edu.ec and @uleam.edu.ec are accepted",
      contrasena: "Password",
      mostrar: "Show the password",
      ocultar: "Hide the password",
      recordar: "Remember my email",
      olvidar: "Forgot your password?",
      entrar: "Sign in",
      volver: "Back to the site",
      errorCorreo: "Enter an institutional email (@live.uleam.edu.ec or @uleam.edu.ec).",
      errorContrasena: "The password needs at least 8 characters.",
      errorCampos: "Fill in your email and password.",
      errorCredenciales: "The email or the password do not match.",
      cuentaPrototipo: "Prototype account",
      avisoPrototipo:
        "This is a test access, deliberately left open and with no real password. Once there is real authentication, this goes away.",
    },
    a11y: {
      title: "Accessibility options",
      open: "Open accessibility menu",
      close: "Close accessibility menu",
      vision: "Vision",
      text: "Reading",
      motion: "Motion and pointer",
      textSize: "Text size",
      normal: "Normal",
      large: "Large",
      xlarge: "Very large",
      contrast: "Contrast",
      contrastNormal: "Standard",
      contrastHigh: "High contrast",
      grayscale: "Grayscale mode",
      dyslexia: "Easy-read font",
      underlineLinks: "Underline all links",
      reduceMotion: "Remove animations",
      lineHeight: "Line spacing",
      relaxed: "Increased",
      bigCursor: "Large pointer",
      reset: "Reset everything",
      hint: "Changes apply instantly and are remembered.",
    },
  },
};

export default site;
