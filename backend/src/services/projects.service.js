import projectsData from "../data/projects.data.js";

function listProjects() {
  return projectsData;
}

function getProjectById(id) {
  const numericId = Number(id);
  return projectsData.find((project) => project.id === numericId) || null;
}

export const projectsService = { listProjects, getProjectById };
