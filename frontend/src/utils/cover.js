// Portadas generadas (SVG inline) para los proyectos que no traen imagen propia.
// Usan la paleta institucional ULEAM para mantener coherencia visual y así
// reducir ruido visual: mismo estilo, solo cambia el color y el monograma.
//
// Estos pares viven aquí y no en index.css porque el SVG se hornea como
// data-URI: al generarse no puede leer las variables CSS del documento.
// Si se cambia la paleta hay que actualizar esta lista a mano.
// Todos los stops son azules reales extraídos del logo "logo_40_años"
// (azules de 18% a 37% de luminosidad, tono 207-210°).
const PALETTE = [
  ["#015394", "#053068"],
  ["#034B88", "#0B2F54"],
  ["#185386", "#003D79"],
  ["#034B88", "#003D79"],
  ["#015394", "#0B2F54"],
  ["#185386", "#0B2F54"],
  ["#034B88", "#053068"],
  ["#003D79", "#0B2F54"],
];

// El texto de la categoría usa un dorado más claro que el de marca: sobre el
// fondo real donde cae (mezcla del degradado al 31% más el velo negro al 16%)
// el #DCB469 no llega al 4.5:1, y este #E8C57A —también del logo— sí.
const ACCENT_TEXT = "232, 197, 122";

function initialsOf(name = "") {
  const words = String(name)
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function escapeXml(value) {
  return String(value).replace(
    /[<>&'"]/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]
  );
}

/**
 * Genera una portada SVG con degradado institucional, monograma y
 * el nombre del proyecto. Se devuelve como data-URI (sin peticiones extra).
 */
export function coverFor(project = {}, index = 0) {
  const label = initialsOf(project.nombre);
  const [from, to] = PALETTE[index % PALETTE.length];
  const title = escapeXml(project.nombre || "Proyecto");
  const categoria = escapeXml(project.categoria || "");
  const id = `g${index}`;

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400" role="img" aria-label="${title}">` +
    `<defs>` +
    `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0%" stop-color="${from}"/>` +
    `<stop offset="100%" stop-color="${to}"/>` +
    `</linearGradient>` +
    `</defs>` +
    `<rect width="640" height="400" fill="url(#${id})"/>` +
    `<circle cx="600" cy="40" r="170" fill="rgba(255,255,255,0.07)"/>` +
    `<circle cx="40" cy="390" r="130" fill="rgba(0,0,0,0.16)"/>` +
    `<rect x="0" y="330" width="640" height="70" fill="rgba(0,0,0,0.22)"/>` +
    `<text x="36" y="140" font-family="Arial,Helvetica,sans-serif" font-size="104" font-weight="800" fill="rgba(255,255,255,0.95)">${label}</text>` +
    `<text x="36" y="196" font-family="Arial,Helvetica,sans-serif" font-size="21" font-weight="700" fill="rgba(255,255,255,0.88)">${title.slice(0, 34)}</text>` +
    (categoria
      ? `<text x="36" y="226" font-family="Arial,Helvetica,sans-serif" font-size="14" letter-spacing="2" fill="rgba(${ACCENT_TEXT},0.95)">${categoria.toUpperCase()}</text>`
      : "") +
    `<text x="36" y="374" font-family="Arial,Helvetica,sans-serif" font-size="14" letter-spacing="3" fill="rgba(255,255,255,0.65)">Facultad de Ciencias de la Vida y Tecnologías</text>` +
    `</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function coverForAll(projects = []) {
  return (projects || []).map((project, index) => ({
    ...project,
    // Imagen de ejemplo del prototipo; si no hay, se genera la portada SVG.
    cover: imageFor(project, index),
  }));
}

/** Cantidad de imágenes de ejemplo generadas en /public/img/proyectos. */
const PROJECT_PLACEHOLDERS = 8;

/**
 * Resuelve la imagen de un proyecto:
 * 1) la que envíe la API,
 * 2) la imagen de ejemplo local,
 * 3) la portada generada en SVG.
 */
export function imageFor(project = {}, index = 0) {
  const explicit = project.portada || project.logo;
  if (explicit) return explicit;

  const id = Number(project.id);
  if (Number.isInteger(id) && id >= 1 && id <= PROJECT_PLACEHOLDERS) {
    // La carpeta base se antepone a mano porque Vite no reescribe las rutas
    // que van en cadena dentro del JavaScript, y en GitHub Pages el sitio no
    // vive en la raiz del dominio. Ver la nota de asset() en branding.js.
    return `${import.meta.env.BASE_URL}img/proyectos/proyecto-${id}.svg`;
  }
  return coverFor(project, index);
}
