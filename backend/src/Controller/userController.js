import prisma from "../DB/db.config.js" 

export const userProfile = (req,res) => {
    try{
        const id = req.user.userId

        const userData = await prisma.user.findUnique({
            where:{
                id
            },
            select:{
                id:true,
                name:true,
                email:true,
                avatar:true,
                isActive:true,
                createdAt:true
            }
        })

        if(!userData){
            res.status(401).json({message:"User Profile Data not found"})
        }

        res.status(200).json({
            message:"User Profile Fetched Successful",
            data:userData
        })

    }
    catch(err){
        return res.status(500).json({message:"Error while Fetching ProfileData"})
    }
}