import jwt from "jsonwebtoken"

export const authMiddleware = (req,res,next) => {
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

        if(decoded){
            req.user = decoded.userId
            next()
        }
        else{
            res.status(401).json({message:"Please Login"})
        }
    }
    catch(err){
        return res.status(500).json({message:"Error while login"})
    }
}