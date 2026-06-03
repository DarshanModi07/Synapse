import { Router } from 'express';
import { userProfile } from '../Controller/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/profile', authMiddleware ,userProfile);


export default router;