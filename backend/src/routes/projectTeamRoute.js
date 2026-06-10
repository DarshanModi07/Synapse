import { Router } from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { assignTeam, getTeams } from '../Controller/projectTeamController.js';

const router = Router();

router.post("/project/:projectId/team",authMiddleware,assignTeam)
router.get("/project/:projectId/teams",authMiddleware,getTeams)



export default router;