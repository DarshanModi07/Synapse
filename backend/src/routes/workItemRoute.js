import { Router } from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { createWorkItem, deleteWorkItem, getAllWorkItems, getAWorkItem, updateWorkItemEmployee, updateWorkItemTeamLead } from "../Controller/workItemController.js"

const router = Router()

router.post("/:subtaskId/create",authMiddleware,createWorkItem)
router.get("/:subtaskId/workItems",authMiddleware,getAllWorkItems)
router.get("/:workItemId",authMiddleware,getAWorkItem)
router.patch("/:workItemId/update/Employee",authMiddleware,updateWorkItemEmployee)
router.patch("/:workItemId/update/TeamLead",authMiddleware,updateWorkItemTeamLead)
router.delete("/:workItemId/delete",authMiddleware,deleteWorkItem)


export default router