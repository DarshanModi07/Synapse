import { Router } from 'express';
import { userProfile, uploadAvatar, updateProfile } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();

router.get('/profile', authMiddleware , userProfile);
router.put('/profile', authMiddleware, updateProfile);
router.patch("/avatar",authMiddleware,upload.single("avatar"),uploadAvatar);

export default router;