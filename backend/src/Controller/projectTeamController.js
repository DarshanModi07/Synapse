import prisma from "../DB/db.config.js"

export const assignTeam = async (req,res) => {
    try{
        const { projectId } = req.params
        const { teamId } = req.body

        if(!projectId || !teamId){
            return res.status(400).json({
                message:"credential needed"
            })
        }

        const checkProject = await prisma.project.findUnique({
            where:{
                id:projectId
            }
        })

        if(!checkProject || checkProject.is_deleted){
            return res.status(404).json({
                message:"Project Not Found"
            })
        }

        const checkWorkspace = await prisma.workspace.findUnique({
            where:{
                id:checkProject.workspaceId
            }
        })

        if(!checkWorkspace){
            return res.status(404).json({
                message:"workspace Not Found"
            })
        }        

        const checkTeam = await prisma.team.findUnique({
            where:{
                id:teamId
            }
        })

        if(!checkTeam || checkTeam.is_deleted){
            return res.status(404).json({
                message:"Team Not Found"
            })
        }

        const checkUser = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId:checkProject.workspaceId,
                    userId:req.user.userId
                }
            }
        })

        if(!checkUser){
            return res.status(403).json({
                message:"you are not the workspace member"
            })
        }

        if(checkUser.sys_role === "employee" || checkUser.sys_role === "team_lead"){
            return res.status(404).json({
                message:"you are not able to do this with this sys_role"
            })
        }

        const teamDepartment = await prisma.department.findUnique({
            where:{
                id:checkTeam.departmentId
            }
        })

        if(!teamDepartment){
            return res.status(404).json({
                message:"Error in finding department"
            })
        }

        if(teamDepartment.workspaceId !== checkProject.workspaceId){
            return res.status(400).json({
                message:"Team belongs to different workspace"
            })
        }

        const existingAssignment = await prisma.projectTeam.findUnique({
            where:{
                projectId_teamId:{
                    projectId,
                    teamId
                }
            }
        })

        if(existingAssignment){
            return res.status(409).json({
                message:"Team already assigned to project"
            })
        }

        const createProjectTeam = await prisma.projectTeam.create({
            data:{
                projectId,
                teamId
            }
        })

        return res.status(201).json({
            message:"Team assigned successfully",
            data:createProjectTeam
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal server error during assigning team"
        })
    }
}

export const getTeams = async (req,res) => {
    try{
        const { projectId } = req.params
        const { page,limits } = req.query

        if(!projectId){
            return res.status(400).json({
                message:"credentials needed"
            })
        }

        

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal server error while getting all teams of a project"
        })
    }
}