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

        if(!projectId){
            return res.status(400).json({
                message:"credentials needed"
            })
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const checkProject = await prisma.project.findUnique({
            where:{
                id:projectId
            }
        })

        if(!checkProject){
            return res.status(404).json({
                message:"Project not found"
            })   
        }

        const workspaceId = checkProject.workspaceId

        const checkUser = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId,
                    userId:req.user.userId
                }
            }
        })

        if(!checkUser){
            return res.status(403).json({
                message:"You are not the Member of this Workspace"
            })
        }

        const findTeams = await prisma.projectTeam.findMany({
            where:{
                projectId
            }
        })

        const teamIds = findTeams.map(team => team.teamId);

        if(teamIds.length === 0){
            return res.status(200).json({
                message:"No teams assigned to this project",
                data:[]
            })
        }

        const findData = await prisma.team.findMany({
            where:{
                id:{
                    in: teamIds
                },
                is_deleted:false
            },
            skip,
            take:limit,
            select:{
                id:true,
                name:true,
                department:{
                    select:{
                        id:true,
                        name:true
                    }
                },
                leader:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        avatar:true
                    }
                }
            }
        })

        return res.status(200).json({
            message:"Teams fetched successfully",
            count: findData.length,
            data: findData
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal server error while getting all teams of a project"
        })
    }
} 