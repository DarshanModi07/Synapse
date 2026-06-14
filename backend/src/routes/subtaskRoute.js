import { Router } from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { createSubTask, deleteSubTask, getAllSubTask, getOneSubTask, updateSubTask } from "../Controller/subtaskController.js"

const router = Router()

router.post("/:taskId/subtask",authMiddleware,createSubTask)
router.get("/:taskId/getAllSubtasks",authMiddleware,getAllSubTask)
router.get('/:subtaskId/getSubtask',authMiddleware,getOneSubTask)
router.patch('/:subtaskId/update',authMiddleware,updateSubTask)
router.delete('/:subtaskId/delete',authMiddleware,deleteSubTask)

export default router