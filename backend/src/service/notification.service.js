import prisma from "../DB/db.config.js";
import { getIO } from "../socket/socket.js";

export const createNotification = async ({ userId, type, payload }) => {
    const notification = await prisma.notification.create({
        data: {
            userId,
            type,
            payload
        }
    });

    // emit real-time to the target user's private room
    // if user is not connected, they'll fetch it via REST on next load — no data lost
    try {
        const io = getIO();
        io.to(userId).emit("new_notification", notification);
    } catch (_) {
        // socket not initialized yet — safe to ignore (e.g. during tests)
    }

    return notification;
};