import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { createSubTask, deleteSubTask, getAllSubTask, getOneSubTask, myDashboard, subtaskProgress, updateSubTask } from "../controllers/subtask.controller.js"

const router = Router()

router.post("/:taskId/subtask",authMiddleware,createSubTask)
router.get("/:taskId/getAllSubtasks",authMiddleware,getAllSubTask)
router.get('/:subtaskId/getSubtask',authMiddleware,getOneSubTask)
router.patch('/:subtaskId/update',authMiddleware,updateSubTask)
router.delete('/:subtaskId/delete',authMiddleware,deleteSubTask)
router.get('/:subtaskId/progress',authMiddleware,subtaskProgress)
router.get('/dashboard/me',authMiddleware,myDashboard)

export default router