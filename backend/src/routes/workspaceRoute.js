import { Router } from 'express';
import { createWorkSpace } from '../Controller/workSpaceController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/createWorkspace', authMiddleware , createWorkSpace);

export default router;