import { Router } from 'express';
import { userProfile,uploadAvatar } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();

router.get('/profile', authMiddleware , userProfile);
router.patch("/avatar",authMiddleware,upload.single("avatar"),uploadAvatar);

export default router;