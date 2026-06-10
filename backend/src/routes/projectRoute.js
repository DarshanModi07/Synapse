import { Router } from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { createProject, getAllProjects, getProject } from "../Controller/projectController.js"

const router = Router();

router.post("/createProject",authMiddleware,createProject)
router.get("/:projectId",authMiddleware, getProject)
router.get("/:workspaceId/getAllProjects",authMiddleware,getAllProjects)

export default router;