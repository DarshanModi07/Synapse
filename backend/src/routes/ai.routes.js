import express from "express";
import {suggestDepartments,suggestTeams,suggestSubTasks,suggestWorkItems,suggestReview,suggestTasks
} from "../ai/ai.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/suggest-departments", authMiddleware, suggestDepartments);
router.post("/suggest-teams", authMiddleware, suggestTeams);
router.post("/suggest-subtasks", authMiddleware, suggestSubTasks);
router.post("/suggest-workitems", authMiddleware, suggestWorkItems);
router.post("/suggest-review", authMiddleware, suggestReview);
router.post("/suggest-tasks", authMiddleware, suggestTasks);

export default router;