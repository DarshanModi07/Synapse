import { Router } from 'express';
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { createProject, deleteProject, getAllProjects, getProject, projectProgress, updateProject } from "../controllers/project.controller.js"

const router = Router();

router.post("/createProject",authMiddleware,createProject)
router.get("/:projectId",authMiddleware, getProject)
router.get("/:workspaceId/getAllProjects",authMiddleware,getAllProjects)
router.patch("/:projectId/update",authMiddleware,updateProject)
router.delete("/:projectId/delete",authMiddleware,deleteProject)
router.get("/:projectId/progress",authMiddleware,projectProgress)

export default router;