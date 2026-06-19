import { Router } from 'express';
import { userProfile } from '../Controller/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { upload } from "../middlewares/multerMiddleware.js";
import { uploadAvatar } from "../controllers/userController.js";

const router = Router();

router.get('/profile', authMiddleware , userProfile);
router.patch("/avatar",authMiddleware,upload.single("avatar"),uploadAvatar);

export default router;