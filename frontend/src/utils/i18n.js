/**
 * La API entrega el contenido de los proyectos en español (nombre, categoría
 * y descripción). Esta tabla traduce ese contenido para que la versión en
 * inglés no mezcle interfaz inglesa con tarjetas en español.
 *
 * Se indexa por id de proyecto. Si un proyecto no aparece aquí, se conserva
 * el texto original de la API.
 */
const PROJECT_EN = {
  1: {
    nombre: "FCVT Project Management System",
    categoria: "Internal Management",
    resumen:
      "Internal platform to plan, assign and track the team's projects. Includes boards, milestones and progress reports.",
  },
  2: {
    nombre: "Digital Services Portal",
    categoria: "Web Portals",
    resumen:
      "Single online counter where the university community requests procedures, certificates and technical support.",
  },
  3: {
    nombre: "FCVT Digital Library",
    categoria: "Education",
    resumen:
      "Online catalogue of academic resources, thesis repository and access to scientific databases.",
  },
  4: {
    nombre: "Full Virtual Classroom",
    categoria: "Education",
    resumen:
      "Corporate Moodle platform with the college's courses, workshops and labs. This site takes its Academi theme as a reference.",
  },
  5: {
    nombre: "Innovation Lab",
    categoria: "Innovation",
    resumen:
      "Multi-purpose space with 3D printing, electronics and prototype development for students and faculty.",
  },
  6: {
    nombre: "FCVT Student App",
    categoria: "Mobile Apps",
    resumen:
      "Mobile app with schedules, grades, events and college notices, available for Android and iOS.",
  },
  7: {
    nombre: "Surveys and Evaluations System",
    categoria: "Internal Management",
    resumen:
      "Tool to design surveys, faculty evaluations and satisfaction polls, with real-time reports.",
  },
  8: {
    nombre: "FCVT Researchers Network",
    categoria: "Research",
    resumen:
      "Collaborative directory of faculty researchers, groups and research lines of the college.",
  },
};

/** Devuelve los proyectos con el contenido en el idioma pedido. */
export function applyProjectLang(projects = [], lang) {
  if (lang !== "en") return projects;
  return projects.map((project) => {
    const en = PROJECT_EN[project.id];
    return en ? { ...project, ...en } : project;
  });
}
