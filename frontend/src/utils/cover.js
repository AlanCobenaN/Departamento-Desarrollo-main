// Portadas generadas (SVG inline) para los proyectos que no traen imagen propia.
// Usan la paleta institucional ULEAM para mantener coherencia visual y así
// reducir ruido visual: mismo estilo, solo cambia el color y el monograma.
const PALETTE = [
  ["#10316B", "#0B254B"],
  ["#14457E", "#0A2148"],
  ["#1B4A97", "#0E2A5C"],
  ["#0E2A5C", "#08183A"],
  ["#164E8A", "#0B254B"],
  ["#1C6BB0", "#0F3D77"],
  ["#0D3A6A", "#071C36"],
  ["#2A5CB8", "#123A7E"],
];

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
      ? `<text x="36" y="226" font-family="Arial,Helvetica,sans-serif" font-size="14" letter-spacing="2" fill="rgba(201,162,39,0.95)">${categoria.toUpperCase()}</text>`
      : "") +
    `<text x="36" y="374" font-family="Arial,Helvetica,sans-serif" font-size="14" letter-spacing="3" fill="rgba(255,255,255,0.65)">FCVT · ULEAM</text>` +
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
    return `/img/proyectos/proyecto-${id}.svg`;
  }
  return coverFor(project, index);
}
