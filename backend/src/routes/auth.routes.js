import { Router } from 'express';
import { registerUser, loginUser, logoutUser , refreshAccessToken } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', logoutUser);

export default router;