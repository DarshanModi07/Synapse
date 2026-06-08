import { Router } from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { createTeam, getAllTeams } from '../Controller/teamController.js';

const router = Router();

router.post("/createTeam",authMiddleware,createTeam)
router.get("/:departmentId/teams",authMiddleware,getAllTeams)

export default router;