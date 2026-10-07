/**
 * Textos del panel, en los dos idiomas.
 *
 * Los contenidos que se editan (proyectos, servicios, pie) no están aquí: son
 * datos y se quedan en español, igual que en la portada.
 */

export const panelEs = {
  panel: {
    cabecera: {
      titulo: "Panel del sitio",
      soloNavegador: "Guardado solo en este navegador",
      restablecerCompleto: "Restablecer el sitio a los valores por defecto",
      restablecer: "Restablecer",
      restablecerSitio: "Restablecer el sitio",
      volver: "Volver al sitio",
      ariaSecciones: "Secciones del panel",
      confirmarRestablecer:
        "¿Restablecer el sitio a los valores por defecto? Se borrarán los cambios guardados en este navegador.",
    },

    aviso: {
      titulo: "Prototipo.",
      resaltado: "Los cambios se guardan solo en este navegador.",
      texto:
        "Al cambiar de equipo o borrar datos del sitio, se pierden. Sirve para previsualizar los cambios antes de publicarlos.",
    },

    ayuda:
      "Los cambios se guardan solo en este navegador. La portada los lee automáticamente.",

    secciones: {
      servicios: "Qué hacemos",
      tecnologias: "Tecnologías",
      proyectos: "Proyectos",
      galeria: "Galería",
      whatsapp: "Contacto WhatsApp",
      pie: "Pie de página",
      permisos: "Permisos",
    },

    comunes: {
      anadir: "Añadir",
      borrar: "Borrar",
      quitar: "Quitar",

      logo: "Logo",
      titulo: "Título",
      descripcion: "Descripción",
      nombre: "Nombre",
      foto: "Foto",
      icono: "Icono",

      iconoVacio: "Sin logo: se dibuja el predeterminado del sitio.",
      iconoDesconocido:
        "Ese nombre no está en la lista. Si no existe en la versión de Font Awesome que carga el sitio, el icono saldrá vacío.",

      errorTipoImagen: "Eso no es una imagen. Elige un archivo de imagen.",
      errorLectura: "No se pudo leer el archivo.",
      rutaPlaceholder: "/img/galeria/foto.jpg o https://…",
      rutaAria: "Ruta de la imagen de {campo}",
      sinFoto:
        "Sin foto se usa la imagen por defecto del sitio. El archivo solo se lee aquí, no se sube.",
      quitarImagenAria: "Quitar la imagen de {campo}",

      etiquetaPlaceholder: "Nombre de la etiqueta",
      etiquetaAria: "{lista}: etiqueta {n}",
      borrarEtiqueta: "Borrar la etiqueta {valor}",
      sinEtiquetas: "No hay etiquetas. Añade la primera abajo.",
      anadirEtiqueta: "Añadir etiqueta a {lista}",
      sinOpciones: "No hay opciones todavía.",
    },

    servicios: {
      titulo: 'Tarjetas de "Qué hacemos" ({n})',
      anadir: "Añadir tarjeta",
      vacio: "No hay tarjetas. La sección quedaría vacía en la portada.",
      borrarTitulo: "Borrar la tarjeta {n}",
      fila: "Tarjeta {n}",
      tituloPlaceholder: "Desarrollo web",
      descripcionPlaceholder:
        "Portales, intranets y sistemas de gestión a medida…",
    },

    tecnologias: {
      titulo: "Tecnologías ({n})",
      anadir: "Añadir tecnología",
      vacio: "Sin tecnologías el anillo 3D no tiene nada que mostrar.",
      borrarTitulo: "Borrar la tecnología {n}",
      fila: "Tecnología {n}",
      ayuda: "Es el texto que se lee bajo el icono en el anillo.",
    },

    proyectos: {
      titulo: "Proyectos ({n})",
      anadir: "Añadir proyecto",
      vacio: "No hay proyectos. La sección de la portada saldría vacía.",
      borrarTitulo: "Borrar el proyecto {n}",
      fila: "Proyecto {n}",
      nombrePlaceholder: "Portal de Servicios Digitales",
      descripcionPlaceholder: "Qué hace el proyecto y para quién.",
      etiquetaCategoria: "Etiqueta de categoría",
      etiquetasTecnologia: "Etiquetas de tecnología",
      vacioCategorias: "No hay etiquetas de categoría. Añádelas abajo.",
      vacioTecnologias: "No hay etiquetas de tecnología. Añádelas abajo.",
      huerfanasPrefijo: "Usa etiquetas que no están en la lista:",
      huerfanasSufijo:
        ". Añádelas a la lista de abajo o quítalas del proyecto.",
      quitarEtiquetaAria: "Quitar {etiqueta} de este proyecto",
      tarjetaCategorias: "Etiquetas de categoría",
      tarjetaTecnologias: "Etiquetas de tecnología",
      categorias: "Categorías",
      categoriasPlaceholder: "Educación",
      categoriasAyuda:
        "Al renombrar o borrar una categoría se corrigen los proyectos que la usan.",
      tecnologias: "Tecnologías",
      tecnologiasAyuda:
        "Al renombrar o borrar una tecnología se corrigen los proyectos que la usan.",
    },

    galeria: {
      titulo: "Fotos de la galería ({n})",
      anadir: "Añadir foto",
      vacio: "No hay fotos. La galería quedaría vacía.",
      borrarTitulo: "Borrar la foto {n}",
      fila: "Foto {n}",
      tituloPlaceholder: "Panel general",
      tituloAyuda: "Es el texto que se ve al abrir la foto.",
    },

    whatsapp: {
      tarjetaNumero: "Número y saludo",
      numero: "Número de WhatsApp",
      ayudaRelleno:
        "Sigue siendo el número de relleno: el enlace abre WhatsApp pero no escribe a nadie.",
      ayudaCorrecto: "Correcto: solo dígitos.",
      ayudaFormato:
        "wa.me no acepta +, espacios ni guiones. Solo dígitos, con el prefijo del país (Ecuador: 5939XXXXXXXX).",
      saludo: "Saludo del menú de navegación",
      saludoPlaceholder: "Hola, equipo. Escribo desde la página web.",
      saludoAyuda:
        "Es el mensaje del botón de contacto del menú, que no pasa por el formulario.",
      tituloMotivos: "Motivos ({n})",
      anadirMotivo: "Añadir motivo",
      vacioMotivos: "Sin motivos el formulario se queda sin botones donde elegir.",
      borrarMotivo: "Borrar el motivo {n}",
      motivo: "Motivo {n}",
      motivoNombre: "Nombre del motivo",
      motivoPlaceholder: "Un proyecto nuevo",
      motivoAyuda:
        "Es el texto del botón. Si se deja vacío el motivo no se puede elegir.",
      mensaje: "Mensaje",
      mensajeAyuda: "Usa {nombre} y {mensaje} para saber dónde va cada cosa.",
      preview: "Cómo quedaría el mensaje",
      vacio: "(vacío)",
    },

    pie: {
      contacto: "Datos de contacto",
      correo: "Correo",
      correoPlaceholder: "correo@ejemplo.com",
      telefono: "Teléfono",
      ubicacion: "Ubicación",
      seguenos: "Síguenos",
      borrarRed: "Borrar la red {n}",
      red: "Red {n}",
      direccion: "Dirección",
      enlaceReal: "Enlace real: el icono se vera activo.",
      sinEnlace:
        "Sin dirección el icono sale desactivado en el pie, no lleva a la portada de la red.",
      anadirRed: "Añadir red",
      explorar: "Explorar",
      enlaces: "Enlaces del pie",
      enlacePlaceholder: "Nombre del enlace",
      enlacesAyuda: "Los destinos se editan abajo, uno por enlace.",
      destinoDe: 'Destino de "{enlace}"',
      enlaceFallback: "enlace {n}",
      borrarEnlace: "Borrar el enlace {enlace}",
    },

    permisos: {
      introduccion:
        "Da acceso a más correos institucionales para entrar al panel. El inicio de sesión solo acepta contraseñas, pero este sistema es un prototipo: se guarda en el navegador, no en la base de datos.",
      avisoSeguridad:
        "No es seguridad: en un navegador cualquiera puede leer esta lista y concederse permiso.",
      lista: "Lista de correos con permiso",
      vacio: "No hay otros correos. Solo queda la cuenta del prototipo.",
      contrasena: "Contraseña: {valor}",
      quitar: "Quitar permiso",
      anadirTitulo: "Añadir un correo institucional",
      correo: "Correo institucional",
      clave: "Contraseña para este acceso",
      clavePlaceholder: "Mínimo 8 caracteres",
      dar: "Dar permiso",
      advertencia: "Advertencia",
      avisoPrefijo: "Estos datos se guardan en",
      avisoResaltado: "localStorage",
      avisoSufijo:
        " del navegador. Si borras los datos del sitio, se pierden. No uses contraseñas reales que uses en otros sitios.",
      errorVacio: "Rellena el correo y la contraseña.",
      errorDominio: "Solo se admiten correos de @uleam.edu.ec o @live.uleam.edu.ec.",
      errorContrasena: "La contraseña debe tener al menos 8 caracteres.",
      errorDuplicado: "Ese correo ya está en la lista de permisos.",
    },
  },
};

export const panelEn = {
  panel: {
    cabecera: {
      titulo: "Site panel",
      soloNavegador: "Saved only in this browser",
      restablecerCompleto: "Reset the site to its default values",
      restablecer: "Reset",
      restablecerSitio: "Reset the site",
      volver: "Back to the site",
      ariaSecciones: "Panel sections",
      confirmarRestablecer:
        "Reset the site to its default values? The changes saved in this browser will be deleted.",
    },

    aviso: {
      titulo: "Prototype.",
      resaltado: "Changes are saved only in this browser.",
      texto:
        "They are lost when you switch device or clear the site data. Use it to preview changes before publishing.",
    },

    ayuda:
      "Changes are saved only in this browser. The homepage reads them automatically.",

    secciones: {
      servicios: "What we do",
      tecnologias: "Technologies",
      proyectos: "Projects",
      galeria: "Gallery",
      whatsapp: "WhatsApp contact",
      pie: "Footer",
      permisos: "Permissions",
    },

    comunes: {
      anadir: "Add",
      borrar: "Delete",
      quitar: "Remove",

      logo: "Logo",
      titulo: "Title",
      descripcion: "Description",
      nombre: "Name",
      foto: "Photo",
      icono: "Icon",

      iconoVacio: "No logo: the site default is drawn.",
      iconoDesconocido:
        "That name is not in the list. If it does not exist in the Font Awesome version the site loads, the icon will come out empty.",

      errorTipoImagen: "That is not an image. Choose an image file.",
      errorLectura: "The file could not be read.",
      rutaPlaceholder: "/img/galeria/photo.jpg or https://…",
      rutaAria: "Image path for {campo}",
      sinFoto:
        "With no photo the site default image is used. The file is only read here, it is not uploaded.",
      quitarImagenAria: "Remove the image for {campo}",

      etiquetaPlaceholder: "Label name",
      etiquetaAria: "{lista}: label {n}",
      borrarEtiqueta: "Delete label {valor}",
      sinEtiquetas: "No labels yet. Add the first one below.",
      anadirEtiqueta: "Add a label to {lista}",
      sinOpciones: "No options yet.",
    },

    servicios: {
      titulo: '"What we do" cards ({n})',
      anadir: "Add card",
      vacio: "No cards. The section would be empty on the homepage.",
      borrarTitulo: "Delete card {n}",
      fila: "Card {n}",
      tituloPlaceholder: "Web development",
      descripcionPlaceholder:
        "Portals, intranets and custom management systems…",
    },

    tecnologias: {
      titulo: "Technologies ({n})",
      anadir: "Add technology",
      vacio: "With no technologies the 3D ring has nothing to show.",
      borrarTitulo: "Delete technology {n}",
      fila: "Technology {n}",
      ayuda: "The text read under the icon on the ring.",
    },

    proyectos: {
      titulo: "Projects ({n})",
      anadir: "Add project",
      vacio: "No projects. The homepage section would come out empty.",
      borrarTitulo: "Delete project {n}",
      fila: "Project {n}",
      nombrePlaceholder: "Digital Services Portal",
      descripcionPlaceholder: "What the project does and who it is for.",
      etiquetaCategoria: "Category label",
      etiquetasTecnologia: "Technology labels",
      vacioCategorias: "No category labels. Add them below.",
      vacioTecnologias: "No technology labels. Add them below.",
      huerfanasPrefijo: "Uses labels that are not in the list:",
      huerfanasSufijo:
        ". Add them to the list below or remove them from the project.",
      quitarEtiquetaAria: "Remove {etiqueta} from this project",
      tarjetaCategorias: "Category labels",
      tarjetaTecnologias: "Technology labels",
      categorias: "Categories",
      categoriasPlaceholder: "Education",
      categoriasAyuda:
        "Renaming or deleting a category fixes the projects that use it.",
      tecnologias: "Technologies",
      tecnologiasAyuda:
        "Renaming or deleting a technology fixes the projects that use it.",
    },

    galeria: {
      titulo: "Gallery photos ({n})",
      anadir: "Add photo",
      vacio: "No photos. The gallery would be empty.",
      borrarTitulo: "Delete photo {n}",
      fila: "Photo {n}",
      tituloPlaceholder: "Main dashboard",
      tituloAyuda: "The text shown when the photo is opened.",
    },

    whatsapp: {
      tarjetaNumero: "Number and greeting",
      numero: "WhatsApp number",
      ayudaRelleno:
        "Still the placeholder number: the link opens WhatsApp but does not write to anyone.",
      ayudaCorrecto: "Correct: digits only.",
      ayudaFormato:
        "wa.me does not accept +, spaces or hyphens. Digits only, with the country prefix (Ecuador: 5939XXXXXXXX).",
      saludo: "Navigation menu greeting",
      saludoPlaceholder: "Hi team, I am reaching out from the website.",
      saludoAyuda:
        "The message on the menu contact button; it does not go through the form.",
      tituloMotivos: "Reasons ({n})",
      anadirMotivo: "Add reason",
      vacioMotivos: "With no reasons the form has no buttons to choose from.",
      borrarMotivo: "Delete reason {n}",
      motivo: "Reason {n}",
      motivoNombre: "Reason name",
      motivoPlaceholder: "A new project",
      motivoAyuda:
        "The button text. If it is left empty the reason cannot be chosen.",
      mensaje: "Message",
      mensajeAyuda: "Use {nombre} and {mensaje} to see where each part goes.",
      preview: "How the message would look",
      vacio: "(empty)",
    },

    pie: {
      contacto: "Contact details",
      correo: "Email",
      correoPlaceholder: "name@example.com",
      telefono: "Phone",
      ubicacion: "Location",
      seguenos: "Follow us",
      borrarRed: "Delete network {n}",
      red: "Network {n}",
      direccion: "Address",
      enlaceReal: "Real link: the icon will be active.",
      sinEnlace:
        "With no address the icon stays disabled in the footer and does not lead to the network page.",
      anadirRed: "Add network",
      explorar: "Explore",
      enlaces: "Footer links",
      enlacePlaceholder: "Link name",
      enlacesAyuda: "The targets are edited below, one per link.",
      destinoDe: 'Target for "{enlace}"',
      enlaceFallback: "link {n}",
      borrarEnlace: "Delete link {enlace}",
    },

    permisos: {
      introduccion:
        "Gives more institutional emails access to the panel. Sign-in only accepts passwords, but this system is a prototype: it is saved in the browser, not in the database.",
      avisoSeguridad:
        "This is not security: in a browser anyone can read this list and grant themselves access.",
      lista: "List of emails with access",
      vacio: "No other emails. Only the prototype account remains.",
      contrasena: "Password: {valor}",
      quitar: "Remove access",
      anadirTitulo: "Add an institutional email",
      correo: "Institutional email",
      clave: "Password for this access",
      clavePlaceholder: "At least 8 characters",
      dar: "Grant access",
      advertencia: "Warning",
      avisoPrefijo: "This data is saved in your browser's",
      avisoResaltado: "localStorage",
      avisoSufijo:
        ". If you clear the site data, it is lost. Do not use real passwords you use elsewhere.",
      errorVacio: "Fill in the email and the password.",
      errorDominio: "Only @uleam.edu.ec or @live.uleam.edu.ec emails are accepted.",
      errorContrasena: "The password must be at least 8 characters.",
      errorDuplicado: "That email is already on the access list.",
    },
  },
};
