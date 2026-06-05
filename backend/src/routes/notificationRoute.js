import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getAllNotifications , markAllNotificationRead , makeNotificationRead} from '../Controller/notificationController.js';

const router = Router();

router.get("/allNotifications", authMiddleware , getAllNotifications )
router.patch("/read-all",authMiddleware, markAllNotificationRead )
router.patch("/:notificationId/read",authMiddleware,makeNotificationRead)

export default router;