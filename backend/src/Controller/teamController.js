import prisma from "../DB/db.config.js"

export const createTeam = async (req,res) => {
    try{
        const { departmentId , name } = req.body

        if(!departmentId || !name){
            return res.status(400).json({
                message:"Credential Needed"
            })
        }

        const checkUser = await prisma.department.findUnique({
            where:{
                id:departmentId
            }
        })

        
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server error during create team"
        })
    }
}