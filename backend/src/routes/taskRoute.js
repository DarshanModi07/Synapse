import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { createTask, getAllTask, updateTask } from "../Controller/taskController.js";

const router = Router()

router.post("/:projectTeamId/task",authMiddleware,createTask)
router.get("/:projectTeamId/allTasks",authMiddleware,getAllTask)
router.patch("/:taskId/update",authMiddleware,updateTask)


export default router