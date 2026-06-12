import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { createTask } from "../Controller/taskController.js";

const router = Router()

router.post("/:projectTeamId/task",authMiddleware,createTask)

export default router