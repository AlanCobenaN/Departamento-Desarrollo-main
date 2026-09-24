const PALETTE = ["#EC3237", "#C2252E", "#7B1E22", "#424242"];

function letterOf(name = "") {
  return String(name).trim().charAt(0).toUpperCase() || "?";
}

/**
 * Portada SVG de respaldo (data URI) con la inicial del proyecto sobre los
 * tonos rojo/institucional, gemela a las portadas que usa el sitio de Moodle.
 */
export function coverFor(project = {}, index = 0) {
  const letter = letterOf(project.nombre);
  const bg = PALETTE[index % PALETTE.length];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="300" viewBox="0 0 460 300">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0%" stop-color="${bg}"/><stop offset="100%" stop-color="#1F1F1F"/>` +
    `</linearGradient></defs>` +
    `<rect width="460" height="300" fill="url(#g)"/>` +
    `<circle cx="425" cy="-30" r="150" fill="rgba(255,255,255,0.10)"/>` +
    `<circle cx="35" cy="310" r="120" fill="rgba(0,0,0,0.18)"/>` +
    `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" ` +
    `font-family="Arial,Helvetica,sans-serif" font-size="180" font-weight="800" fill="rgba(255,255,255,0.92)">` +
    `${letter}</text></svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Asigna una portada a cada proyecto: si el dato trae `logo` propio lo usa,
 * sino genera el SVG de respaldo con su inicial.
 */
export function coverForAll(projects = []) {
  return (projects || []).map((project, index) => ({
    ...project,
    cover: project.logo || coverFor(project, index),
  }));
}
