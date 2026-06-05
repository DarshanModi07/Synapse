import { rmSync } from "node:fs"
import prisma from "../DB/db.config.js"

export const getAllNotifications = async (req,res) => {
    try{
        
        const userId = req.user.userId

        const getNotification = await prisma.notification.findMany({
            where:{
                userId,
                is_read:false
            }
        })

        if(getNotification.length == 0){
            return res.status(400).json({
                message:"There is No Notification for You",
                data:getNotification
            })
        }

        return res.status(200).json({
            message:"All Notifications",
            data:getNotification
        })

    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            message:"Internal Server Error while get all notification"
        })
    }
}

export const makeNotificationRead = async (req,res) => {
    try{
        const { notificationId } = req.params;

        if(!notificationId){
            return res.status(400).json({
                message:"Please pass notification id"
            });
        }

        const userId = req.user.userId;

        const getNotification = await prisma.notification.findFirst({
            where:{
                id: notificationId,
                userId
            }
        });

        if(!getNotification){
            return res.status(404).json({
                message:"Notification not found"
            });
        }

        const markItRead = await prisma.notification.update({
            where:{
                id: notificationId
            },
            data:{
                is_read: true
            }
        });

        return res.status(200).json({
            message:"Notification marked as read",
            data: markItRead
        });

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Error while marking notification"
        });
    }
}

export const markAllNotificationRead = async (req,res) => {
    try{
        const userId = req.user.userId;

        const markAllRead = await prisma.notification.updateMany({
            where:{
                userId,
                is_read:false
            },
            data:{
                is_read:true
            }
        });

        if(markAllRead.count === 0){
            return res.status(200).json({
                message:"No unread notifications found"
            });
        }

        return res.status(200).json({
            message:"All notifications marked as read",
            updatedCount: markAllRead.count
        });

    }
    catch(err){
        console.log(err);

        return res.status(500).json({
            message:"Internal Server Error while marking all notifications read"
        });
    }
}