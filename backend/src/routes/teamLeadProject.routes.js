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
    generateWorkItemsAI
} from "../controllers/teamLeadProject.controller.js";

const router = Router();

// Master list
router.get("/", authMiddleware, getTeamLeadProjects);

// Command Center
router.get("/:projectId", authMiddleware, getTeamLeadProjectDetails);

// SubTasks
router.post("/task/:taskId/subtasks", authMiddleware, createSubTask);
router.patch("/subtask/:subTaskId", authMiddleware, updateSubTask);

// Work Items
router.post("/subtask/:subTaskId/workitems", authMiddleware, createWorkItem);
router.patch("/workitem/:workItemId", authMiddleware, updateWorkItem);

// AI Generators
router.post("/task/:taskId/ai/subtasks", authMiddleware, generateSubTasksAI);
router.post("/subtask/:subTaskId/ai/workitems", authMiddleware, generateWorkItemsAI);

export default router;
