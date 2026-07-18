import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { getAllNotifications , markAllNotificationRead , makeNotificationRead, getUnreadCount, deleteNotification } from '../controllers/notification.controller.js';

const router = Router();

router.get("/allNotifications", authMiddleware , getAllNotifications )
router.patch("/read-all",authMiddleware, markAllNotificationRead )
router.patch("/:notificationId/read",authMiddleware,makeNotificationRead)
router.get("/unreadCount",authMiddleware,getUnreadCount)
router.delete("/:notificationId", authMiddleware, deleteNotification)

export default router;