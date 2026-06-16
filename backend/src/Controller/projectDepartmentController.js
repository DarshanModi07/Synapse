import prisma from "../DB/db.config.js";

export const assignDepartment = async (req,res) => {
    try{
        const { projectId } = req.params
        const { departmentId } = req.body

        if(!projectId || !departmentId){
            return res.status(400).json({
                message:"Credentials needed"
            })
        }

        const checkProject = await prisma.project.findUnique({
            where:{
                id:projectId
            }
        })

        if(!checkProject || checkProject.is_deleted){
            return res.status(404).json({
                message:"Project not found"
            })
        }

        const checkDepartment = await prisma.department.findUnique({
            where:{
                id:departmentId
            }
        })

        if(!checkDepartment || checkDepartment.is_deleted){
            return res.status(404).json({
                message:"Department Not Found"
            })
        }

        if(checkProject.workspaceId !== checkDepartment.workspaceId){
            return res.status(400).json({
                message:"Department and Project Belongs to Diff-Diff Workspaces"
            })
        }

        const workspaceId = checkDepartment.workspaceId
        const userId = req.user.userId

        const checkUser = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId,
                    userId
                }
            }
        })

        if(!checkUser){
            return res.status(403).json({
                message:"You are not member of this workspace"
            })
        }

        if(checkUser.sys_role !== "owner"){
            return res.status(403).json({
                message:"You are not allowed to do this action"
            })
        }

        const existingAssignment = await prisma.projectDepartment.findUnique({
            where:{
                projectId_departmentId:{
                    projectId,
                    departmentId,
                }
            }
        })

        if(existingAssignment){
            return res.status(409).json({
                message:"Department already assigned to project"
            })
        }

        const createProjectDepartment = await prisma.projectDepartment.create({
            data:{
                project:{
                    connect:{
                        id: projectId
                    }
                },
                department:{
                    connect:{
                        id: departmentId
                    }
                },
                assignedBy:{
                    connect:{
                        id: userId
                    }
                }
            }
        })

        return res.status(201).json({
            message:"Department assigned successfully",
            data:createProjectDepartment
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error while assigning Department to Project"
        })
    }
}

export const getDepartments = async (req,res) => {
    try{
        const { projectId } = req.params

        if(!projectId){
            return res.status(404).json({
                message:"credential needed"
            })
        }

        const checkProject = await prisma.project.findUnique({
            where:{
                id:projectId
            }
        })

        if(!checkProject){
            return res.status(404).json({
                message:"Project Not Found"
            })
        }

        const checkDept = await prisma.projectDepartment.findMany({
            where:{
                projectId
            },
            select:{
                id:true,
                assignedBy:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        avatar:true,
                    }
                },
                department:{
                    select:{
                        id:true,
                        name:true,
                        workspace:{
                            select:{
                                id:true,
                                name:true
                            }
                        }
                    }
                },
                project:{
                    select:{
                        id:true,
                        name:true,
                        startDate:true,
                        dueDate:true,
                        status:true
                    }
                }
                                
            }
        });

        if(!checkDept){
            return res.status(404).json({
                message:"No department found"
            })
        }

        if(checkDept.length === 0){
            return res.status(404).json({
                message:"No departments found"
            })
        }

        const workspaceId = checkDept[0].department.workspace.id
        const userId = req.user.userId

        const checkUser = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId,
                    userId
                }
            }
        })

        if(!checkUser){
            return res.status(403).json({
                message:"You are not the member of the workspace",
            })
        }

        return res.status(200).json({
            message:"Department fetched successfully",
            count:checkDept.length,
            data:checkDept
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error during Fetching a Departments"
        })
    }
}

export const removeDepartment = async (req,res) => {
    try{
        const { projectId , departmentId } = req.params
        const userId = req.user.userId

        if(!projectId || !departmentId){
            return res.status(400).json({
                message:"Credential needed"
            })
        }

        const checkProject = await prisma.project.findUnique({
            where:{
                id:projectId
            }
        })

        if(!checkProject){
            return res.status(404).json({
                message:"Project Not found"
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

        if(checkProject.workspaceId !== checkDept.workspaceId){
            return res.status(400).json({
                message:"Project and Department belong to different workspaces"
            })
        }

        const checkUser = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId:checkProject.workspaceId,
                    userId
                }
            }
        })

        if(!checkUser){
            return res.status(404).json({
                message:"You are not the member of this workspace"
            })
        }

        if(checkUser.sys_role !== "owner"){
            return res.status(403).json({
                message:"You are not allowed to perform this action"
            })
        }

        const existingAssignment = await prisma.projectDepartment.findUnique({
            where:{
                projectId_departmentId:{
                    projectId,
                    departmentId
                }
            }
        })

        if(!existingAssignment){
            return res.status(404).json({
                message:"Department is not assigned to this project"
            })
        }

        const removeDept = await prisma.projectDepartment.delete({
            where:{
                projectId_departmentId:{
                    projectId,
                    departmentId
                }
            }
        })

        return res.status(200).json({
            message:"Department Removed",
            data:removeDept
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error during removing department"
        })
    }
}
