import prisma from "../DB/db.config.js"

export const createTeam = async (req,res) => {
    try{
        let { departmentId , name } = req.body
        const userId = req.user.userId

        if(!departmentId || !name){
            return res.status(400).json({
                message:"Credential Needed"
            })
        }

         const checkDept = await prisma.department.findUnique({
            where:{
                id:departmentId
            }
        })

        if(!checkDept){
            return res.status(404).json({
                message:"Department not found"
            })
        }

        const checkUser = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId:checkDept.workspaceId,
                    userId
                }
            }
        })

        if(!checkUser){
            return res.status(404).json({
                message : "User not found"
            })
        }

        if(checkUser.sys_role != "owner" && checkUser.sys_role != "manager"){
            return res.status(403).json({
                message:"You are not able to create Team"
            })
        }
      

        const findTeam = await prisma.team.findUnique({
            where:{
                departmentId_name:{
                    departmentId,
                    name
                }
            }
        })

        if(findTeam){
            return res.status(409).json({
                message:"This name already exist"
            })
        }

        const makeTeam = await prisma.team.create({
            data:{
                name,
                departmentId
            }
        })

        return res.status(201).json({
            message:"Team Created",
            data:makeTeam
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server error during create team"
        })
    }
}