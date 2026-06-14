import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { createTask, deleteTask, getAllTask, updateTask } from "../Controller/taskController.js";

const router = Router()

router.post("/:projectTeamId/task",authMiddleware,createTask)
router.get("/:projectTeamId/allTasks",authMiddleware,getAllTask)
router.patch("/:taskId/update",authMiddleware,updateTask)
router.delete('/:taskId/delete',authMiddleware,deleteTask)


export default router