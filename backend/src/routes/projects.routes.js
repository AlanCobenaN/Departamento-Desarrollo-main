import { Router } from "express";
import { projectsController } from "../controllers/projects.controller.js";

const router = Router();

router.get("/", projectsController.list);
router.get("/:id", projectsController.detail);

export default router;
