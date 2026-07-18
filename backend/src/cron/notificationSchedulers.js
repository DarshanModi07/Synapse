import cron from "node-cron";
import { notificationService } from "../service/notification.service.js";

/**
 * Enterprise Schedulers
 * Registers cron jobs for automated system notifications.
 */
export const initSchedulers = () => {
    // 1. Every hour: Check for impending deadlines (24h, 6h, overdue)
    // Runs at the 0th minute of every hour (e.g. 1:00, 2:00)
    cron.schedule("0 * * * *", async () => {
        try {
            await notificationService.sendDeadlineNotifications();
        } catch (error) {
            console.error("Error in hourly deadline scheduler:", error);
        }
    });

    // 2. Every day at 8:00 AM: Send Daily Summaries
    cron.schedule("0 8 * * *", async () => {
        try {
            await notificationService.sendDailySummary();
        } catch (error) {
            console.error("Error in daily summary scheduler:", error);
        }
    });

    // 3. Every Monday at 8:00 AM: Send Weekly Summaries
    // 1 = Monday
    cron.schedule("0 8 * * 1", async () => {
        try {
            await notificationService.sendWeeklySummary();
        } catch (error) {
            console.error("Error in weekly summary scheduler:", error);
        }
    });

    console.log("[Schedulers] Enterprise notification schedulers initialized.");
};
