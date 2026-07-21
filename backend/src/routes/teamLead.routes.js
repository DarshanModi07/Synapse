import { Router } from "express";
import { 
    getTeamLeadDashboard
} from "../controllers/teamLead.controller.js";
import { getTeamLeadAnalytics } from "../controllers/teamLeadAnalytics.controller.js";
import {
    getAllTeamLeadMembers,
    getTeamLeadMemberDetails
} from "../controllers/teamLeadMember.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getTeamLeadSubtasks } from "../controllers/teamLeadSubtask.controller.js";

const router = Router();

router.get("/dashboard", authMiddleware, getTeamLeadDashboard);
router.get("/members", authMiddleware, getAllTeamLeadMembers);
router.get("/members/:memberId", authMiddleware, getTeamLeadMemberDetails);
router.get("/analytics", authMiddleware, getTeamLeadAnalytics);
router.get("/subtasks", authMiddleware, getTeamLeadSubtasks);

export default router;
