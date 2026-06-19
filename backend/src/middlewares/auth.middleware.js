import jwt from "jsonwebtoken"
import prisma from "../DB/db.config.js"

export const authMiddleware = async (req,res,next) => {
    try{

        if(!req.headers.authorization){
            return res.status(401).json({
                message:"Unauthorized"
            })
        }

        const authHeader = req.headers.authorization

        const token = authHeader.split(" ")[1]

        const decoded = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET
            )

        const id = decoded.userId

        const checkUser = await prisma.user.findUnique({
            where:{
                id
            }
        })

        if(!checkUser){
            return res.status(401).json({
                message:"Unauthorized"
             })
        }

        if(decoded){
            req.user = decoded
            next()
        }
        else{
            res.status(401).json({message:"Please Login"})
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"Token Verification Failed"})
    }
}