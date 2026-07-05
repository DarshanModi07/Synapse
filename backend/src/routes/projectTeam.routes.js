import { Router } from 'express';
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { assignTeam, getTeams , removeTeam, teamDashboard , getAvailableTeams} from '../controllers/projectTeam.controller.js';

const router = Router();

router.post("/:projectDepartmentId/team",authMiddleware,assignTeam)
router.get("/:projectDepartmentId/teams",authMiddleware,getTeams)
router.delete("/:projectDepartmentId/team/:teamId",authMiddleware,removeTeam)
router.get("/:projectTeamId/dashboard",authMiddleware,teamDashboard)
router.get("/:projectDepartmentId/available-teams",authMiddleware,getAvailableTeams);



export default router;