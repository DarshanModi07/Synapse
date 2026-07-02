import { Router } from 'express';
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { addTeamMember, createTeam, deleteTeam, getAllTeams, getTeamMembers, removeTeamMember, updateTeam , getWorkspaceTeams ,teamDashboard , getAvailableLeaders} from '../controllers/team.controller.js';

const router = Router();

router.post("/createTeam",authMiddleware,createTeam)
router.get("/:departmentId/teams",authMiddleware,getAllTeams)
router.patch("/:teamId/update",authMiddleware,updateTeam)
router.delete("/:teamId/delete",authMiddleware,deleteTeam)
router.post("/:teamId/member/add",authMiddleware,addTeamMember)
router.get("/:teamId/members/get",authMiddleware,getTeamMembers)
router.delete("/:teamId/member/delete",authMiddleware,removeTeamMember)
router.get("/workspace/:workspaceId",authMiddleware,getWorkspaceTeams);
router.get("/:teamId/dashboard",authMiddleware,teamDashboard);
router.get("/department/:departmentId/available-leaders",authMiddleware,getAvailableLeaders);

export default router;