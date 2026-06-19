import prisma from "../DB/db.config.js" 
import {uploadToCloudinary} from "../utils/uploadToCloudinary.js";

export const userProfile = async (req,res) => {
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
        console.log(err)
        return res.status(500).json({message:"Error while Fetching ProfileData"})
    }
}

export const uploadAvatar = async(req,res)=>{

    try{

        const userId = req.user.userId;
        if(!req.file){
            return res.status(400).json({
                    message:"Image required"
                });
        }

        const result = await uploadToCloudinary(
                req.file.buffer
            );

        const user = await prisma.user.update({
                where:{
                    id:userId
                },
                data:{
                    avatar:
                        result.secure_url
                }
            });

        return res.status(200).json({
                message:
                    "Avatar Updated",
                avatar:
                    user.avatar
            });

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
                message:"Upload Failed"
            });
    }
}