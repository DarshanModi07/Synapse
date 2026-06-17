import prisma from "../DB/db.config.js";

export const createNotification = async ({userId,type,payload}) => {
    const notification =await prisma.notification.create({
            data:{
                userId,
                type,
                payload
            }
        });
    return notification;
};