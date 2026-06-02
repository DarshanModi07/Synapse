import { Router } from 'express';
import authRouter from './authRouter';

const router = Router();

router.use('/auth/api/user', authRouter);

export default router;