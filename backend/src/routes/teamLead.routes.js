import { Router } from "express";
import { 
    getTeamLeadDashboard,
    getTeamLeadMembers,
    getTeamLeadAnalytics
} from "../controllers/teamLead.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/dashboard", authMiddleware, getTeamLeadDashboard);
router.get("/members", authMiddleware, getTeamLeadMembers);
router.get("/analytics", authMiddleware, getTeamLeadAnalytics);

console.log("Team Lead routes loaded successfully");

export default router;
