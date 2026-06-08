import { Router } from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { createTeam } from '../Controller/teamController.js';

const router = Router();

router.post("/createTeam",authMiddleware,createTeam)

export default router;