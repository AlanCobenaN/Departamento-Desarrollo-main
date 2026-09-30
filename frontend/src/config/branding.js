/**
 * Identidad del sitio — inspirada en el tema "Academi" del Aula Virtual ULEAM.
 * Colores de marca extraídos del logo "logo_40_años": azul institucional
 * #034B88 (tono 207°) y dorado #DCB469 (tono 37°).
 */
const site = {
  name: "Equipo de Desarrollo FCVT",
  shortName: "FCVT",
  faculty: "Facultad de Ciencias de la Vida y Tecnologías",
  university: "Universidad Laica Eloy Alfaro de Manabí",
  initials: "ULEAM",
  city: "Manta, Manabí, Ecuador",
  slogan: "Ciencia y tecnología al servicio de la vida",

  // Logotipos (todos servidos desde /public/logos)
  logoShield: "/logos/logo-blanco-pequeno.png", // escudo blanco, para fondos oscuros
  logoHorizontal: "/logos/logo-gris-horizontal.png", // horizontal gris, para barra clara
  logoFull: "/logos/logo-nombre-completo.png", // con texto, para superficie blanca
  logoLarge: "/logos/logo-grande.png", // marca grande blanca
  heroImage: "/hero-galeria.jpg", // portada optimizada del slider (76 KB)
  galleryImage: "/galeria-demo.jpg", // vista de la galería (53 KB)

  // Fondos del carrusel de la portada. Son imagenes de ejemplo del
  // prototipo; se reemplazan por fotos reales solo cambiando esta lista.
  heroSlides: [
    { src: "/hero-galeria.jpg", alt: "" },
    { src: "/galeria-demo.jpg", alt: "" },
    { src: "/img/galeria/pantalla-1.svg", alt: "" },
    { src: "/img/galeria/pantalla-3.svg", alt: "" },
  ],

  // Imágenes de ejemplo del prototipo (mockups de interfaz)
  screens: [
    { file: "/img/galeria/pantalla-1.svg", key: "gallery.s1" },
    { file: "/img/galeria/pantalla-2.svg", key: "gallery.s2" },
    { file: "/img/galeria/pantalla-3.svg", key: "gallery.s3" },
  ],

  // Contacto: valores de ejemplo, nunca datos reales
  contact: {
    email: "correo@ejemplo.com",
    phone: "+000 000-0000",
  },

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
    nav: {
      inicio: "Inicio",
      servicios: "Qué hacemos",
      proyectos: "Proyectos",
      galeria: "Galería",
      tema: "Cambiar entre modo claro y oscuro",
      idioma: "Idioma",
      menu: "Abrir menú de navegación",
      cerrar: "Cerrar menú",
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
      subtitle: "Herramientas que construimos para la comunidad ULEAM.",
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
      title: "Galería",
      subtitle: "Una muestra visual de la plataforma y sus proyectos.",
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
      placeholders: "Datos de ejemplo para el prototipo.",
    },
    backToTop: "Volver arriba",
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
    nav: {
      inicio: "Home",
      servicios: "What we do",
      proyectos: "Projects",
      galeria: "Gallery",
      tema: "Switch between light and dark mode",
      idioma: "Language",
      menu: "Open navigation menu",
      cerrar: "Close menu",
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
      subtitle: "Tools we build for the ULEAM community.",
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
      title: "Gallery",
      subtitle: "A visual sample of the platform and its projects.",
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
      placeholders: "Sample data for the prototype.",
    },
    backToTop: "Back to top",
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
