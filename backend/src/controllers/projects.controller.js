import { projectsService } from "../services/projects.service.js";

function list(req, res) {
  res.json({ ok: true, data: projectsService.listProjects() });
}

function detail(req, res) {
  const project = projectsService.getProjectById(req.params.id);
  if (!project) {
    return res.status(404).json({
      ok: false,
      error: { message: `Proyecto ${req.params.id} no encontrado.` },
    });
  }
  return res.json({ ok: true, data: project });
}

export const projectsController = { list, detail };
