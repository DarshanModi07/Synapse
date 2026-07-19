import prisma from "../DB/db.config.js";
import { getIO } from "../socket/socket.js";

// Legacy export to not break existing code
export const createNotification = async ({ userId, type, payload }) => {
    const notification = await prisma.notification.create({
        data: {
            userId,
            type,
            payload
        }
    });

    try {
        const io = getIO();
        io.to(userId).emit("new_notification", notification);
        io.to(userId).emit("notification", notification); // Also emit the new event name
    } catch (_) {
    }

    return notification;
};

/**
 * Enterprise Notification Service
 * Handles unified push notifications (Socket.io) and database persistence.
 */
class NotificationService {
  async sendNotification({ userId, type, title, message, entityType, entityId, actionUrl, metadata = {} }) {
    try {
      const payload = {
        title,
        message,
        type,
        entityType,
        entityId,
        actionUrl,
        metadata
      };

      const notification = await prisma.notification.create({
        data: {
          type,
          payload,
          userId
        }
      });

      // Push in real-time
      try {
        const io = getIO();
        io.to(userId).emit("notification", notification);
        io.to(userId).emit("notification:new", notification);
      } catch (socketErr) {
        console.error("Socket emit failed", socketErr);
      }

      return notification;
    } catch (err) {
      console.error("Error creating notification:", err);
      return null;
    }
  }

  async sendBulkNotification({ userIds, type, title, message, entityType, entityId, actionUrl, metadata = {} }) {
    const promises = userIds.map(userId => 
      this.sendNotification({ userId, type, title, message, entityType, entityId, actionUrl, metadata })
    );
    return Promise.all(promises);
  }

  // --- SCHEDULER METHODS ---
  async sendDeadlineNotifications() {
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 24);
    const tomorrowStart = new Date(tomorrow);
    tomorrowStart.setMinutes(tomorrowStart.getMinutes() - 30);
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setMinutes(tomorrowEnd.getMinutes() + 30);

    const subTasksDueTomorrow = await prisma.subTask.findMany({
      where: {
        dueDate: { gte: tomorrowStart, lte: tomorrowEnd },
        status: { notIn: ['done', 'cancelled'] },
        assignedToId: { not: null }
      }
    });

    for (const st of subTasksDueTomorrow) {
      await this.sendNotification({
        userId: st.assignedToId,
        type: "subtask_due_soon",
        title: "Upcoming Deadline",
        message: `SubTask "${st.title}" is due in 24 hours.`,
        entityType: "SubTask",
        entityId: st.id,
        actionUrl: `/employee/tasks`
      });
    }
  }

  async sendDailySummary() {
    const users = await prisma.user.findMany({ where: { isActive: true } });

    for (const user of users) {
      const activeCount = await prisma.subTask.count({
        where: { assignedToId: user.id, status: { in: ['todo', 'in_progress', 'in_review'] } }
      });
      
      if (activeCount > 0) {
        await this.sendNotification({
          userId: user.id,
          type: "daily_summary",
          title: "Today's Summary",
          message: `You have ${activeCount} active SubTasks pending today.`,
          entityType: "System",
          entityId: "daily_summary",
          actionUrl: `/employee/tasks`
        });
      }
    }
  }

  async sendWeeklySummary() {
    const users = await prisma.user.findMany({ where: { isActive: true } });

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    for (const user of users) {
      const completedCount = await prisma.subTask.count({
        where: { assignedToId: user.id, status: 'done', updatedAt: { gte: lastWeek } }
      });

      if (completedCount > 0) {
        await this.sendNotification({
          userId: user.id,
          type: "weekly_summary",
          title: "Weekly Productivity",
          message: `You completed ${completedCount} SubTasks last week! Keep it up!`,
          entityType: "System",
          entityId: "weekly_summary",
          actionUrl: `/employee/tasks`
        });
      }
    }
  }
}

export const notificationService = new NotificationService();