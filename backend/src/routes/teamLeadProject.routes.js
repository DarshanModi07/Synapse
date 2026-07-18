import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
    getTeamLeadProjects,
    getTeamLeadProjectDetails,
    createSubTask,
    updateSubTask,
    createWorkItem,
    updateWorkItem,
    generateSubTasksAI,
    generateWorkItemsAI,
    approveSubTask,
    rejectSubTask,
    deleteSubTask,
    deleteWorkItem
} from "../controllers/teamLeadProject.controller.js";

const router = Router();

// Master list
router.get("/", authMiddleware, getTeamLeadProjects);

// Command Center
router.get("/:projectId", authMiddleware, getTeamLeadProjectDetails);

// SubTasks
router.post("/task/:taskId/subtasks", authMiddleware, createSubTask);
router.patch("/subtask/:subTaskId", authMiddleware, updateSubTask);
router.delete("/subtask/:subTaskId", authMiddleware, deleteSubTask);
router.post("/subtask/:subTaskId/approve", authMiddleware, approveSubTask);
router.post("/subtask/:subTaskId/reject", authMiddleware, rejectSubTask);

// Work Items
router.post("/subtask/:subTaskId/workitems", authMiddleware, createWorkItem);
router.patch("/workitem/:workItemId", authMiddleware, updateWorkItem);
router.delete("/workitem/:workItemId", authMiddleware, deleteWorkItem);

// AI Generators
router.post("/task/:taskId/ai/subtasks", authMiddleware, generateSubTasksAI);
router.post("/subtask/:subTaskId/ai/workitems", authMiddleware, generateWorkItemsAI);

export default router;
