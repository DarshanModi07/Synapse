import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getAllNotifications } from '../Controller/notificationController.js';

const router = Router();

router.get("/allNotifications", authMiddleware , getAllNotifications )

export default router;