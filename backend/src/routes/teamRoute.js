import { Router } from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { createTeam, getAllTeams, updateTeam } from '../Controller/teamController.js';

const router = Router();

router.post("/createTeam",authMiddleware,createTeam)
router.get("/:departmentId/teams",authMiddleware,getAllTeams)
router.patch("/:teamId/update",authMiddleware,updateTeam)

export default router;