import cron from "node-cron";
import { notificationService } from "../service/notification.service.js";

export const initSchedulers = () => {

    cron.schedule("0 * * * *", async () => {
        try {
            await notificationService.sendDeadlineNotifications();
        } catch (error) {
            console.error("Error in hourly deadline scheduler:", error);
        }
    });

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
};
