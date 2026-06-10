import { Router } from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { createProject, deleteProject, getAllProjects, getProject, updateProject } from "../Controller/projectController.js"

const router = Router();

router.post("/createProject",authMiddleware,createProject)
router.get("/:projectId",authMiddleware, getProject)
router.get("/:workspaceId/getAllProjects",authMiddleware,getAllProjects)
router.patch("/:projectId/update",authMiddleware,updateProject)
router.delete("/:projectId/delete",authMiddleware,deleteProject)

export default router;