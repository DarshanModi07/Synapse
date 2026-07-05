import prisma from "../DB/db.config.js"
import { createNotification } from "../service/notification.service.js"

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
    select:{
        team:{
            select:{
                leaderId:true
            }
        },
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

        await createNotification({
            userId:checkProjectTeam.team.leaderId,
            type:"task_assigned",
            payload:{
                taskId:addTask.id,
                title:addTask.title
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
                        projectTeamId,
                        is_deleted:false
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
        priority = priority?.toLowerCase()

        if(!taskId){
            return res.status(400).json({
                message:"Credential Needed"
            })
        }

        title = title?.trim()
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

        if (status &&!allStatus.includes(status)){
            return res.status(400).json({
                message:"Please provide valid status"
            })
        }

        if (priority &&!TaskPriority.includes(priority)){
            return res.status(400).json({
                message:"Please provide valid status"
            })
        }

        const checkTaskId = await prisma.task.findUnique({
            where:{
                id:taskId
            }
        })

        if(!checkTaskId || checkTaskId.is_deleted){
            return res.status(404).json({
                message:"Task not found"
            })
        }

        const checkProjectTeam = await prisma.projectTeam.findUnique({
            where:{
                id: checkTaskId.projectTeamId
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
        return res.status(500).json({
            message:"Internal Server Error during updating task"
        })
    }
}

export const deleteTask = async(req,res) => {
    try{
        const { taskId } = req.params

        const userId = req.user.userId

        if(!taskId){
            return res.status(404).json({
                message:"credential needed"
            })
        }

        const checkTaskId = await prisma.task.findUnique({
            where:{
                id:taskId
            }
        })

        if(!checkTaskId || checkTaskId.is_deleted){
            return res.status(404).json({
                message:"Task not found"
            })
        }

        const checkProjectTeam = await prisma.projectTeam.findUnique({
            where:{
                id: checkTaskId.projectTeamId
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

        const getSubTask = await prisma.subTask.findMany({
            where:{
                taskId,
                is_deleted:false
            }
        })

        if(getSubTask.length !== 0){
            return res.status(400).json({
                message:"You can not delete Task when it's sub task exist"
            })
        }

        const deleteTask = await prisma.task.update({
            where:{
                id:taskId
            },
            data:{
                is_deleted:true,
                deletedAt:new Date()
            }
        })

        return res.status(200).json({
            message:"Task Deleted"
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error while Deleting task"
        })
    }
}

export const taskProgress = async (req, res) => {
    try {

        const { taskId } = req.params;
        const userId = req.user.userId;

        if (!taskId) {
            return res.status(400).json({
                message: "Task ID is required"
            });
        }

        /*
        =====================================================
        CHECK TASK
        =====================================================
        */

        const checkTask = await prisma.task.findUnique({
            where: {
                id: taskId
            }
        });

        if (!checkTask || checkTask.is_deleted) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        /*
        =====================================================
        CHECK PROJECT TEAM
        =====================================================
        */

        const projectTeam = await prisma.projectTeam.findUnique({
            where: {
                id: checkTask.projectTeamId
            },
            include: {
                projectDepartment: {
                    include: {
                        department: {
                            select: {
                                workspaceId: true
                            }
                        }
                    }
                }
            }
        });

        if (!projectTeam) {
            return res.status(404).json({
                message: "Project Team not found"
            });
        }

        const workspaceId =
            projectTeam.projectDepartment.department.workspaceId;

        /*
        =====================================================
        CHECK WORKSPACE MEMBER
        =====================================================
        */

        const workspaceMember =
            await prisma.workspaceMember.findUnique({
                where: {
                    workspaceId_userId: {
                        workspaceId,
                        userId
                    }
                }
            });

        if (!workspaceMember) {
            return res.status(403).json({
                message: "You are not a member of this workspace"
            });
        }

        /*
        =====================================================
        GET SUBTASK IDS
        =====================================================
        */

        const task = await prisma.task.findUnique({
            where: {
                id: taskId
            },
            select: {
                subtasks: {
                    where: {
                        is_deleted: false
                    },
                    select: {
                        id: true
                    }
                }
            }
        });

        const subtaskIds =
            task.subtasks.map(subtask => subtask.id);

        /*
        =====================================================
        WORK ITEM COUNTS
        =====================================================
        */

        const totalWorkItems =
            await prisma.workItem.count({
                where: {
                    subTaskId: {
                        in: subtaskIds
                    },
                    is_deleted: false
                }
            });

        const done =
            await prisma.workItem.count({
                where: {
                    subTaskId: {
                        in: subtaskIds
                    },
                    status: "done",
                    is_deleted: false
                }
            });

        const inProgress =
            await prisma.workItem.count({
                where: {
                    subTaskId: {
                        in: subtaskIds
                    },
                    status: "in_progress",
                    is_deleted: false
                }
            });

        const inReview =
            await prisma.workItem.count({
                where: {
                    subTaskId: {
                        in: subtaskIds
                    },
                    status: "in_review",
                    is_deleted: false
                }
            });

        const todo =
            await prisma.workItem.count({
                where: {
                    subTaskId: {
                        in: subtaskIds
                    },
                    status: "todo",
                    is_deleted: false
                }
            });

        const cancelled =
            await prisma.workItem.count({
                where: {
                    subTaskId: {
                        in: subtaskIds
                    },
                    status: "cancelled",
                    is_deleted: false
                }
            });

        /*
        =====================================================
        PROGRESS
        =====================================================
        */

        const divisor =
            totalWorkItems === 0
                ? 1
                : totalWorkItems;

        const progress = {

            done:
                Number(
                    ((done / divisor) * 100).toFixed(2)
                ),

            inProgress:
                Number(
                    ((inProgress / divisor) * 100).toFixed(2)
                ),

            inReview:
                Number(
                    ((inReview / divisor) * 100).toFixed(2)
                ),

            todo:
                Number(
                    ((todo / divisor) * 100).toFixed(2)
                ),

            cancelled:
                Number(
                    ((cancelled / divisor) * 100).toFixed(2)
                )

        };

        /*
        =====================================================
        TASK INFO
        =====================================================
        */

        const taskData = {

            id: checkTask.id,

            title: checkTask.title,

            description: checkTask.description,

            priority: checkTask.priority,

            status: checkTask.status,

            dueDate: checkTask.dueDate,

            progress

        };

        /*
        =====================================================
        RESPONSE
        =====================================================
        */

        return res.status(200).json({

            message: "Task progress fetched successfully",

            data: {

                task: taskData,

                statistics: {

                    totalWorkItems,

                    done,

                    inProgress,

                    inReview,

                    todo,

                    cancelled

                },

                progress

            }

        });

    }
    catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error while fetching task progress"
        });

    }
};
