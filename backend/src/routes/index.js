import { Router } from 'express';
import authRouter from './authRoute';

const router = Router();

router.use('/auth/api/user', authRouter);

export default router;