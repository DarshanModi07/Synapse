import { use } from "react";
import prisma from "../DB/db.config.js"

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

        if(checkTarget.sys_role !== "employee"){
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

        const progress = {}
        progress.done = (done/total)*100
        progress.in_progress = (in_progress/total)*100
        progress.in_review = (in_review/total)*100

        return res.status(200).json({
            message:"progress of subtask",
            data:progress
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error During SubtaskProgress"
        })
    }
}