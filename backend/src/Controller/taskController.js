import prisma from "../DB/db.config.js"

export const createTask = async (req,res) => {
    try{
        const { projectTeamId } = req.params
        let { title,description,priority,dueDate } = req.body

        title = title.trim()

        if(!projectTeamId || !title ){
            return res.status(400).json({
                message:"Credential needed"
            })
        }

        const checkProjectTeam = await prisma.projectTeam.findUnique({
            where:{
                id: projectTeamId
            },
            include:{
                projectDepartment:{
                    include:{
                        department:{
                            select:{
                                workspaceId:true
                            }
                        }
                    }
                }
            }
        }) 

        if(!checkProjectTeam){
            return res.status(404).json({
                message:"Project Team Not Found"
            })
        }

        const userId = req.user.userId
        const workspaceId = checkProjectTeam.projectDepartment.department.workspaceId

        if(!workspaceId){
            return res.status(404).json({
                message:"workspaceId not found"
            })
        }

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
                message:"You are not the member of workspace"
            })
        }

        if(checkUser.sys_role === "team_lead" || checkUser.sys_role === "employee"){
            return res.status(403).json({
                message:"You are not allowed to do this action"
            })
        }

        const endDate = new Date(dueDate);

        if(isNaN(endDate.getTime())){
            return res.status(400).json({
                message:"Invalid due date"
            });
        }

        if(endDate.getTime() < Date.now()){
            return res.status(400).json({
                message:"Enter a future due date"
            });
        }

        const allowedPriorities = [
              "low",
            "medium",
            "high",
            "urgent"
        ];

        if(priority && !allowedPriorities.includes(priority)){
            return res.status(400).json({
                message:"Invalid priority"
            });
        }

       const addTask = await prisma.task.create({
            data:{
                title,
                description: description || null,
                priority: priority || "medium",
                dueDate: dueDate ? endDate : null,

                projectTeam:{
                    connect:{
                        id: projectTeamId
                    }
                },

                createdBy:{
                    connect:{
                        id: userId
                    }
                }
            }
        })

        return res.status(201).json({
            message:"Task created successfully",
            data:addTask
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error During creating task"
        })
    }
}

export const getAllTask = async (req,res) => {
    try{
        const { projectTeamId } = req.params

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit

        if(!projectTeamId){
            return res.status(400).json({
                message:"Credential needed"
            })
        }

        const checkProjectTeam = await prisma.projectTeam.findUnique({
            where:{
                id: projectTeamId
            },
            include:{
                projectDepartment:{
                    include:{
                        department:{
                            select:{
                                workspaceId:true
                            }
                        }
                    }
                }
            }
        }) 

        if(!checkProjectTeam){
            return res.status(404).json({
                message:"Project Team Not Found"
            })
        }

        const userId = req.user.userId
        const workspaceId = checkProjectTeam.projectDepartment.department.workspaceId

        if(!workspaceId){
            return res.status(404).json({
                message:"workspaceId not found"
            })
        }

        

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
                        message:"You are not the member of workspace"
                    })
                }

                const totalTasks = await prisma.task.count({
                    where:{
                        projectTeamId
                    }
                })

                const getAllTask = await prisma.task.findMany({
                    where:{
                        projectTeamId
                    },
                    include:{
                        createdBy:{
                            select:{
                                id:true,
                                name:true,
                                email:true,
                                avatar:true
                            }
                        }
                    },
                    orderBy:{
                        createdAt:"desc"
                    },
                    skip,
                    take:limit
                });

        if(getAllTask.length==0){
            return res.status(200).json({
            message:"No tasks found",
            count:0,
            data:[]
        })
        }

        return res.status(200).json({
            message:"All Tasks fetched",
            page,
            limit,
            totalTasks,
            totalPages: Math.ceil(totalTasks / limit),
            data:getAllTask
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server error during Getting all Task"
        })
    }
}

export const updateTask = async (req,res) => {
    try{
        const  { taskId } = req.params
        let { title , status , priority } = req.body
        status = status?.toLowerCase()
        priority = priority.toLowerCase()

        if(!taskId){
            return res.status(400).json({
                message:"Credential Needed"
            })
        }

        title = title.trim()
        const allStatus = [
            "todo",
            "in_progress",
            "in_review",
            "done",
            "cancelled"
        ]

        const TaskPriority = [
                "low",
                "medium",
                "high",
                "urgent"
            ]

        if(priority && status && (!allStatus.includes(status) || !TaskPriority.includes(priority))){
            return res.status(400).json({
                message:"Please provide valid status and priority"
            })
        }

        const checkTaskId = await prisma.task.findUnique({
            where:{
                id:taskId
            }
        })

        const updateData = await prisma.task.update({
            where:{
                id:taskId
            },
            data:{
                priority,
                status,
                title
            }
        })

        return res.status(200).json({
            message:"Updated task successfully",
            data:updateData
        })
        
    }
    catch(err){
        console.log(err);
        
    }
}
