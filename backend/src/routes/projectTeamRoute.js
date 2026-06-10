import { Router } from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { assignTeam } from '../Controller/projectTeamController.js';

const router = Router();

router.post("/project/:projectId/team",authMiddleware,assignTeam)

export default router;