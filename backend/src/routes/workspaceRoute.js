import { Router } from 'express';
import { createWorkSpace,getUserWorkSpaces,getWorkspace } from '../Controller/workSpaceController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/createWorkspace', authMiddleware , createWorkSpace);
router.get('/getUserWorkSpaces', authMiddleware , getUserWorkSpaces);
router.get('/:slug', authMiddleware , getWorkspace);

export default router;