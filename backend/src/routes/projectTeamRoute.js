import { Router } from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { assignTeam, getTeams , removeTeam } from '../Controller/projectTeamController.js';

const router = Router();

router.post("/:projectDepartmentId/team",authMiddleware,assignTeam)
router.get("/:projectDepartmentId/teams",authMiddleware,getTeams)
router.delete("/:projectDepartmentId/team/:teamId",authMiddleware,removeTeam)



export default router;