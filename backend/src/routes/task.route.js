import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { createTask, deleteTask, getAllTask, taskProgress, updateTask } from "../controllers/task.controller.js";

const router = Router()

router.post("/:projectTeamId/task",authMiddleware,createTask)
router.get("/:projectTeamId/allTasks",authMiddleware,getAllTask)
router.patch("/:taskId/update",authMiddleware,updateTask)
router.delete('/:taskId/delete',authMiddleware,deleteTask)
router.get('/:taskId/progress',authMiddleware,taskProgress)


export default router