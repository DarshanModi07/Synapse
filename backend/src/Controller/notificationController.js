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

export const makeNotificationRead = async (req,res) =>{
    try{

    }
    catch(err){

    }
}