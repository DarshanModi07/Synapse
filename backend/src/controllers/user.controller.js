import prisma from "../DB/db.config.js" 
import {uploadToCloudinary} from "../utils/uploadToCloudinary.js";

export const userProfile = async (req,res) => {
    try{
        const id = req.user?.userId || req.user?.id; // fallback in case it's id instead of userId

        if (!id) {
            return res.status(401).json({ message: "Invalid token payload" });
        }

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
            return res.status(401).json({message:"User Profile Data not found"})
        }

        res.status(200).json({
            message:"User Profile Fetched Successful",
            data:userData
        })
    }
    catch(err){
        return res.status(500).json({message:"Error while Fetching ProfileData", error: err.message})
    }
}

export const uploadAvatar = async(req,res)=>{

    try{
        console.log("REQUEST RECEIVED: uploadAvatar");
        console.log(req.body);
        console.log(req.user);

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
        return res.status(500).json({
                message:"Upload Failed"
            });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const id = req.user?.userId || req.user?.id;

        if (!id) {
            return res.status(401).json({ message: "Invalid token payload" });
        }

        const { name } = req.body;

        if (!name || typeof name !== "string") {
            return res.status(400).json({ message: "Name is required" });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { name },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                isActive: true,
                createdAt: true
            }
        });

        return res.status(200).json({
            message: "Profile updated successfully",
            data: updatedUser
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error updating profile", error: err.message });
    }
};