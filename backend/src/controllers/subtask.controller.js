import { use } from "react";
import prisma from "../DB/db.config.js"
import { createNotification } from "../service/notification.service.js";

export const createSubTask = async (req,res) => {
    try{
        const { taskId } = req.params

        let { title,description,priority,dueDate,assignedToId } = req.body
        const userId = req.user.userId;

        
        const allowedPriorities = [
              "low",
            "medium",
            "high",
            "urgent"
        ];

        priority = priority.toLowerCase()
        if(!allowedPriorities.includes(priority)){
            return res.status(400).json({
                message:"Only low,medium,high and urgent priority is allowed"
            })
        }

        title = title?.trim()
        const endDate = new Date(dueDate)

        if(endDate < Date.now()){
            return res.status(400).json({
                message:"Please Enter valid due Date"
            })
        }

        if(!taskId || !title){
            return res.status(400).json({
                message:"credential needed"
            })
        }

        const checkTaskId = await prisma.task.findUnique({
            where:{
                id:taskId
            }
        })

        if(!checkTaskId){
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

        if(checkUser.sys_role === "employee"){
            return res.status(403).json({
                message:"You are not allowed to do this action"
        })        
        }

        if(checkUser.sys_role === "manager"){
            const checkManagerOwnership = await prisma.department.findUnique({
                where:{
                    id: checkProjectTeam.projectDepartment.departmentId,
                    managerId: userId,
                    is_deleted: false
                }
            })
            if(!checkManagerOwnership){
                return res.status(403).json({
                    message:"You do not have permission to manage subtasks in this department"
                })
            }
        }


        const checkTarget = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                workspaceId,
                userId:assignedToId
            }
            }
        })

        if(!checkTarget){
            return res.status(404).json({
                message:"Can not find target user"
            })
        }

        if(checkTarget.sys_role !== "employee" && checkTarget.sys_role !== "team_lead"){
            return res.status(403).json({
                message:"Can not assign subtask to other than employee"
            })
        }

        const subTask = await prisma.subTask.create({
            data:{
                title,
                description: description || null,
                priority,
                dueDate: endDate,
                task:{
                    connect:{
                        id: taskId
                    }
                },

                assignedBy:{
                    connect:{
                        id: userId
                    }
                },

                assignedTo:{
                    connect:{
                        id:assignedToId
                    }
                }
            }
        })

        await createNotification({
            userId: assignedToId,
            type: "subtask_assigned",
            payload:{
                subTaskId:subTask.id,
                title
            }
        });

        return res.status(201).json({
            message:"sub task created",
            data:subTask
        })


    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error while creating subtask"
        })
    }
}

export const getAllSubTask = async (req,res) => {
    try{
        const { taskId } = req.params
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const userId = req.user.userId;

        if(!taskId){
            return res.status(400).json({
                message:"credential needed"
            })
        }

        const checkTaskId = await prisma.task.findUnique({
            where:{
                id:taskId
            }
        })

        if(!checkTaskId){
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

        if(checkUser.sys_role === "employee"){
            const checkTeamMember = await prisma.teamMember.findUnique({
                where:{
                    teamId_memberId:{
                        teamId:checkTaskId.projectTeamId,
                        memberId:req.user.userId
                    }
                }
            })
    
            if(!checkTeamMember){
                return res.status(403).json({
                    message:"You are not the Member of Team"
                })
            }
        }

        const subTasks = await prisma.subTask.findMany({
            where:{
                taskId,
                is_deleted:false
            },
            skip,
            take:limit
        })

        return res.status(201).json({
            message:"sub tasks fetched",
            data:subTasks,
            count:subTasks.length
        })


    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error while fetching all subtasks"
        })
    }
}

export const getOneSubTask = async (req,res) => {
    try{
        const { subtaskId } = req.params;
        const userId = req.user.userId;

        if(!subtaskId){
            return res.status(400).json({
                message:"Credential needed"
            });
        }

        const checkSubTaskId = await prisma.subTask.findUnique({
            where:{
                id: subtaskId
            },
            include:{
                task:{
                    select:{
                        id:true,
                        title:true,
                        description:true,
                        priority:true,
                        status:true,
                        projectTeamId:true,
                        createdBy:{
                            select:{
                                id:true,
                                name:true,
                                email:true
                            }
                        }
                    }
                },
                assignedBy:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        avatar:true
                    }
                }
            }
        });

        if(!checkSubTaskId){
            return res.status(404).json({
                message:"Subtask not found"
            });
        }

        const checkProjectTeam = await prisma.projectTeam.findUnique({
            where:{
                id: checkSubTaskId.task.projectTeamId
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
        });

        if(!checkProjectTeam){
            return res.status(404).json({
                message:"Project Team Not Found"
            });
        }

        const workspaceId =
            checkProjectTeam.projectDepartment.department.workspaceId;

        const checkUser = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId,
                    userId
                }
            }
        });

        if(!checkUser){
            return res.status(403).json({
                message:"You are not the member of workspace"
            });
        }

        if(checkUser.sys_role === "employee"){

            const checkTeamMember = await prisma.teamMember.findUnique({
                where:{
                    teamId_memberId:{
                        teamId: checkProjectTeam.teamId,
                        memberId: userId
                    }
                }
            });

            if(!checkTeamMember){
                return res.status(403).json({
                    message:"You are not the Member of Team"
                });
            }
        }

        return res.status(200).json({
            message:"Subtask fetched successfully",
            data: checkSubTaskId
        });

    }
    catch(err){
        console.log(err);

        return res.status(500).json({
            message:"Internal Server Error while fetching a subtask"
        });
    }
}

export const updateSubTask = async (req,res) => {
    try{
        const { subtaskId } = req.params;

        if(!subtaskId){
            return res.status(400).json({
                message:"Credential needed"
            });
        }

        const userId = req.user.userId;
        let { title,description,priority,status } = req.body

        title = title?.trim()
        description = description?.trim()
        status = status?.trim()
        priority = priority?.trim()

        const allowedPriorities = [
              "low",
            "medium",
            "high",
            "urgent"
        ];

        priority = priority.toLowerCase()
        if(!allowedPriorities.includes(priority)){
            return res.status(400).json({
                message:"Invalid priority"
            })
        }

         const allStatus = [
            "todo",
            "in_progress",
            "in_review",
            "done",
            "cancelled"
        ]

        if(!status || !allStatus.includes(status)){
            return res.status(400).json({
                message:"Invalid status"
            })
        }

        const checkSubTaskId = await prisma.subTask.findUnique({
            where:{
                id: subtaskId
            },
            include:{
                task:{
                    select:{
                        id:true,
                        title:true,
                        description:true,
                        priority:true,
                        status:true,
                        projectTeamId:true,
                        createdBy:{
                            select:{
                                id:true,
                                name:true,
                                email:true
                            }
                        }
                    }
                },
                assignedBy:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        avatar:true
                    }
                }
            }
        });

        if(!checkSubTaskId){
            return res.status(404).json({
                message:"Subtask not found"
            });
        }

        const checkProjectTeam = await prisma.projectTeam.findUnique({
            where:{
                id: checkSubTaskId.task.projectTeamId
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
        });

        if(!checkProjectTeam){
            return res.status(404).json({
                message:"Project Team Not Found"
            });
        }

        const workspaceId = checkProjectTeam.projectDepartment.department.workspaceId;

        const checkUser = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId,
                    userId
                }
            }
        });

        if(!checkUser){
            return res.status(403).json({
                message:"You are not the member of workspace"
            });
        }

        if(checkUser.sys_role === "employee"){

            const checkTeamMember = await prisma.teamMember.findUnique({
                where:{
                    teamId_memberId:{
                        teamId: checkProjectTeam.teamId,
                        memberId: userId
                    }
                }
            });

            if(!checkTeamMember){
                return res.status(403).json({
                    message:"You are not the Member of Team"
                });
            }
        }

        const update = await prisma.subTask.update({
            where:{
                id:subtaskId
            },
            data:{
                priority,
                status,
                title,
                description
            }
        })

        return res.status(200).json({
            message:"Subtask updated successfully",
            data: update
        });

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error while fetching a subtask"
        });
    }
}

export const deleteSubTask = async (req,res) => {
    try{
        const { subtaskId } = req.params;

        if(!subtaskId){
            return res.status(400).json({
                message:"Credential needed"
            });
        }

        const userId = req.user.userId;

        const checkSubTaskId = await prisma.subTask.findUnique({
            where:{
                id: subtaskId
            },
            include:{
                task:{
                    select:{
                        id:true,
                        title:true,
                        description:true,
                        priority:true,
                        status:true,
                        projectTeamId:true,
                        createdBy:{
                            select:{
                                id:true,
                                name:true,
                                email:true
                            }
                        }
                    }
                },
                assignedBy:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        avatar:true
                    }
                }
            }
        });

        if(!checkSubTaskId){
            return res.status(404).json({
                message:"Subtask not found"
            });
        }

        const checkProjectTeam = await prisma.projectTeam.findUnique({
            where:{
                id: checkSubTaskId.task.projectTeamId
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
        });

        if(!checkProjectTeam){
            return res.status(404).json({
                message:"Project Team Not Found"
            });
        }

        const workspaceId = checkProjectTeam.projectDepartment.department.workspaceId;

        const checkUser = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId,
                    userId
                }
            }
        });

        if(!checkUser){
            return res.status(403).json({
                message:"You are not the member of workspace"
            });
        }

        if(checkUser.sys_role === "employee"){
            return res.status(403).json({
                message:"You have not authority to perform this action"
            })
        }

        const update = await prisma.subTask.update({
            where:{
                id:subtaskId
            },
            data:{
                is_deleted:true
            }
        })

        return res.status(200).json({
            message:"Subtask deleted successfully",
            data: update
        });

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error while fetching a subtask"
        });
    }
}

export const subtaskProgress = async (req,res) => {
    try{    
        const { subtaskId } = req.params

        const userId = req.user.userId;

        if(!subtaskId){
            return res.status(400).json({
                message:"Credential needed"
            });
        }

const checkSubTaskId = await prisma.subTask.findUnique({
    where: {
        id: subtaskId
    },
    select: {
        id: true,
        title: true,
        description: true,
        priority: true,
        status: true,
        is_deleted: true,
        dueDate: true,
        createdAt: true,

        task: {
            select: {
                id: true,
                title: true,
                description: true,
                priority: true,
                status: true,
                projectTeamId: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        },

        assignedBy: {
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true
            }
        }
    }
});

        if(!checkSubTaskId || checkSubTaskId.is_deleted){
            return res.status(404).json({
                message:"Subtask not found"
            });
        }

        const checkProjectTeam = await prisma.projectTeam.findUnique({
            where:{
                id: checkSubTaskId.task.projectTeamId
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
        });

        if(!checkProjectTeam){
            return res.status(404).json({
                message:"Project Team Not Found"
            });
        }

        const workspaceId = checkProjectTeam.projectDepartment.department.workspaceId;

        const checkUser = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId,
                    userId
                }
            }
        });

        if(!checkUser){
            return res.status(403).json({
                message:"You are not the member of workspace"
            });
        }

        let total = await prisma.workItem.count({
            where:{
                subTaskId: subtaskId
            }
        })

        const done = await prisma.workItem.count({
            where:{
                subTaskId: subtaskId,
                status:"done",
                is_deleted:false
            }
        });

        const in_progress = await prisma.workItem.count({
            where:{
                subTaskId: subtaskId,
                status:"in_progress",
                is_deleted:false
            }
        });

        const in_review = await prisma.workItem.count({
            where:{
                subTaskId: subtaskId,
                status:"in_review",
                is_deleted:false
            }
        });
        const todo = await prisma.workItem.count({
            where:{
                subTaskId: subtaskId,
                status:"todo",
                is_deleted:false
            }
        });
        const cancelled = await prisma.workItem.count({
            where:{
                subTaskId: subtaskId,
                status:"cancelled",
                is_deleted:false
            }
        });

        const progress = {}
        progress.done = Number(((done / total) * 100).toFixed(2));
        progress.inProgress = Number(((inProgress / total) * 100).toFixed(2));
        progress.inReview = Number(((inReview / total) * 100).toFixed(2));
        progress.todo = Number(((todo / total) * 100).toFixed(2));
        progress.cancelled = Number(((cancelled / total) * 100).toFixed(2));

        const subtask = {}
        subtask.title = checkSubTaskId.title
        subtask.description = checkSubTaskId.description
        subtask.priority = checkSubTaskId.priority
        subtask.status = checkSubTaskId.status

        return res.status(200).json({
            message:"progress of subtask",
            data:progress,
            subtask,
            total,
            done,
            in_progress,
            in_review,
            todo,
            cancelled
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error During SubtaskProgress"
        })
    }
}

export const myDashboard = async (req,res) => {
    try{
        const userId = req.user.userId;

        const subTasks = await prisma.subTask.findMany({
            where:{
                assignedToId:userId,
                is_deleted:false
            },
            select:{
                id:true,
                title:true,
                priority:true,
                status:true,
                dueDate:true,
                updatedAt:true
            },
            orderBy:{
                updatedAt:"desc"
            }
        });

        const subTaskIds = subTasks.map(
            subtask => subtask.id
        );

        const totalSubTasks = subTasks.length;

        const completedSubTasks = subTasks.filter(
            subtask => subtask.status === "done"
        ).length;

        const inProgressSubTasks = subTasks.filter(
            subtask => subtask.status === "in_progress"
        ).length;

        const inReviewSubTasks = subTasks.filter(
            subtask => subtask.status === "in_review"
        ).length;

        const todoSubTasks = subTasks.filter(
            subtask => subtask.status === "todo"
        ).length;

        const totalWorkItems = await prisma.workItem.count({
            where:{
                subTaskId:{
                    in:subTaskIds
                },
                is_deleted:false
            }
        });

        const doneWorkItems = await prisma.workItem.count({
            where:{
                subTaskId:{
                    in:subTaskIds
                },
                status:"done",
                is_deleted:false
            }
        });

        const inProgressWorkItems = await prisma.workItem.count({
            where:{
                subTaskId:{
                    in:subTaskIds
                },
                status:"in_progress",
                is_deleted:false
            }
        });

        const inReviewWorkItems = await prisma.workItem.count({
            where:{
                subTaskId:{
                    in:subTaskIds
                },
                status:"in_review",
                is_deleted:false
            }
        });

        const todoWorkItems = await prisma.workItem.count({
            where:{
                subTaskId:{
                    in:subTaskIds
                },
                status:"todo",
                is_deleted:false
            }
        });

        const progress =
            totalWorkItems === 0
                ? 0
                : Number(
                    (
                        doneWorkItems * 100 /
                        totalWorkItems
                    ).toFixed(2)
                );

        const recentWorkItems = await prisma.workItem.findMany({
            where:{
                subTaskId:{
                    in:subTaskIds
                },
                is_deleted:false
            },
            select:{
                id:true,
                title:true,
                status:true,
                priority:true,
                updatedAt:true
            },
            orderBy:{
                updatedAt:"desc"
            },
            take:10
        });

        return res.status(200).json({
            message:"Dashboard fetched successfully",

            progress,

            subtasks:{
                total:totalSubTasks,
                completed:completedSubTasks,
                in_progress:inProgressSubTasks,
                in_review:inReviewSubTasks,
                todo:todoSubTasks
            },

            workItems:{
                total:totalWorkItems,
                completed:doneWorkItems,
                in_progress:inProgressWorkItems,
                in_review:inReviewWorkItems,
                todo:todoWorkItems
            },

            recentSubTasks:subTasks.slice(0,5),

            recentWorkItems
        });

    }
    catch(err){
        console.log(err);

        return res.status(500).json({
            message:"Internal Server Error while fetching dashboard"
        });
    }
};