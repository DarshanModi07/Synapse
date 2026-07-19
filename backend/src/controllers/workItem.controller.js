import prisma from "../DB/db.config.js"
import { recalculateSubTaskProgress } from "../services/taskAutomation.service.js"

export const createWorkItem = async (req,res) => {
    try{
        const { subtaskId } = req.params

        let  { title,description,priority,estimatedHours } = req.body

        estimatedHours = Number(estimatedHours)

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

          if(!subtaskId){
            return res.status(400).json({
                message:"Credential needed"
            });
        }

        if(!title?.trim()){
            return res.status(400).json({
                message:"Title is required"
            })
        }

        if(estimatedHours < 0 || estimatedHours == 0){
            return res.status(400).json({
                message:"Give Proper Estimated Hours"
            })
        }

        const userId = req.user.userId;

        const checkSubtaskId = await prisma.subTask.findUnique({
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

        if(!checkSubtaskId){
            return res.status(404).json({
                message:"Subtask not found"
            });
        }

        const checkProjectTeam = await prisma.projectTeam.findUnique({
            where:{
                id: checkSubtaskId.task.projectTeamId
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

        if(checkUser.sys_role !== "team_lead"){
            return res.status(403).json({
                message:"You have not authority to perform this action"
            })
        }       

        const existingWorkItem = await prisma.workItem.findFirst({
            where:{
                subTaskId:subtaskId,
                title: title.trim(),
                is_deleted:false
            }
        });

        if(existingWorkItem){
            return res.status(409).json({
                message:"Work item with same title already exists in this subtask"
            });
        }

        const workItem = await prisma.workItem.create({
            data:{
                title,
                description: description || null,
                priority,
                estimatedHours,
                subTask:{
                    connect:{
                        id: subtaskId
                    }
                }
            }
        })

        return res.status(201).json({
            message:"WorkItems created",
            data:workItem
        })

    }
    catch(err){
        return res.status(500).json({
            message:"Internal Server Error happen during creating work items"
        })
    }
}

export const getAllWorkItems = async (req,res) => {
    try{
        const { subtaskId } = req.params

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

          if(!subtaskId){
            return res.status(400).json({
                message:"Credential needed"
            });
        }

        const userId = req.user.userId;

        const checkSubtaskId = await prisma.subTask.findUnique({
            where:{
                id: subtaskId,
                is_deleted:false
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

        if(!checkSubtaskId){
            return res.status(404).json({
                message:"Subtask not found"
            });
        }


        const checkProjectTeam = await prisma.projectTeam.findUnique({
            where:{
                id: checkSubtaskId.task.projectTeamId
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

        if(checkUser.sys_role === "employee" && checkUser.id !== checkSubtaskId.assignedToId){
            return res.status(403).json({
                message:"You can not see other person's workItems"
            })
        }

        const workItems = await prisma.workItem.findMany({
            where:{
                subTaskId:subtaskId,
                is_deleted:false
            },
            skip,
            take:limit
        })

        if(workItems.length === 0){
            return res.status(200).json({
                message:"There is not workItems for this subtask"
            })
        }

        return res.status(200).json({
            message:"All WorkItems are fetched",
            count:workItems.length,
            data:workItems
        })

    }
    catch(err){
        return res.status(500).json({
            message:"Internal Server Error Happen During getting all work items of subtask"
        })
    }
}

export const getAWorkItem = async (req,res) => {
    try{
        const { workItemId } = req.params

          if(!workItemId){
            return res.status(400).json({
                message:"Credential needed"
            });
        }

const existingWorkItem = await prisma.workItem.findUnique({
    where:{
        id:workItemId
    },
    select:{
        id:true,
        status:true,
        actualHours:true,
        is_deleted:true,

        subTask:{
            select:{
                id:true,
                assignedToId:true,
                assignedById:true,

                task:{
                    select:{
                        projectTeam:{
                            select:{
                                projectDepartment:{
                                    select:{
                                        department:{
                                            select:{
                                                workspaceId:true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});

        if(!existingWorkItem || existingWorkItem.is_deleted){
            return res.status(409).json({
                message:"work item not found"
            });
        }

        const userId = req.user.userId;

        const workspaceId = existingWorkItem.subTask.task.projectTeam.projectDepartment.department.workspaceId

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

        if(checkUser.sys_role === "employee" && userId !== existingWorkItem.subTask.assignedToId){
            return res.status(403).json({
                message:"You can not see other person's workItems"
            })
        }


        return res.status(200).json({
            message:"A WorkItem is fetched",
            data:existingWorkItem
        })

    }
    catch(err){
        return res.status(500).json({
            message:"Internal Server Error Happen During getting a work item of subtask"
        })
    }
}

export const updateWorkItemEmployee = async (req,res) => {
    try{
        const { workItemId } = req.params

        let { actualHours,status } = req.body
        status = status?.trim()
        status = status?.toLowerCase()
        actualHours = Number(actualHours)

        const employeeAllowedStatus = [
            "todo",
            "in_progress",
            "done"
        ];

        if(!status || !employeeAllowedStatus.includes(status)){
            return res.status(400).json({
                message:"Invalid status"
            })
        }

        if(isNaN(actualHours) || actualHours <= 0){
            return res.status(400).json({
                message:"Enter proper actual hours"
            });
        }

          if(!workItemId){
            return res.status(400).json({
                message:"Credential needed"
            });
        }

const existingWorkItem = await prisma.workItem.findUnique({
    where:{
        id:workItemId
    },
    select:{
        id:true,
        status:true,
        actualHours:true,
        is_deleted:true,

        subTask:{
            select:{
                id:true,
                assignedToId:true,
                assignedById:true,

                task:{
                    select:{
                        projectTeam:{
                            select:{
                                projectDepartment:{
                                    select:{
                                        department:{
                                            select:{
                                                workspaceId:true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});

        if(!existingWorkItem || existingWorkItem.is_deleted){
            return res.status(404).json({
                message:"work item not found"
            });
        }

        if(existingWorkItem.is_deleted){
            return res.status(404).json({
                message:"Work item not found"
            });
        }

        const userId = req.user.userId;

        const workspaceId = existingWorkItem.subTask.task.projectTeam.projectDepartment.department.workspaceId

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

        if(checkUser.sys_role !== "employee"){
            return res.status(403).json({
                message:"Only employees can update work items"
            });
        }

        if(userId !== existingWorkItem.subTask.assignedToId){
            return res.status(403).json({
                message:"You are not assigned to this subtask"
            })
        }

        if(existingWorkItem.status === "done" && status === "done"){
            return res.status(400).json({
                message:"Work item is already completed"
            });
        }

        const update = await prisma.workItem.update({
            where:{
                id:workItemId
            },
            data:{
                actualHours,
                status
            }
        })

        await recalculateSubTaskProgress(existingWorkItem.subTask.id);

        return res.status(200).json({
            message:"Work item updated successfully",
            data:update
        })

    }
    catch(err){
        return res.status(500).json({
            message:"Internal Server Error Happen During getting a work item of subtask"
        })
    }
}

export const updateWorkItemTeamLead = async (req,res) => {
    try{
        const { workItemId } = req.params

        let { title,description,priority,estimatedHours,is_deleted,status } = req.body
        title = title?.trim()
        description = description?.trim()
        priority = priority?.trim()?.toLowerCase()
        estimatedHours = Number(estimatedHours)
        is_deleted = is_deleted || false

        if(!title || !priority || !estimatedHours || !workItemId || !status){
            return res.status(400).json({
                message:"Credential Needed"
            })
        }

        const checkTitle = await prisma.workItem.findFirst({
            where:{
                title
            }
        })

        if(checkTitle){
            res.status({
                message:"this title already existed in this subtask"
            })
        }

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

        const teamLeadAllowedStatus = [
            "todo",
            "in_progress",
            "in_review",
            "cancelled",
            "done"
        ];
        
        status = status.toLowerCase()
        if(!teamLeadAllowedStatus.includes(status)){
            return res.status(400).json({
                message:"Invalid status"
            })
        }

        if(isNaN(estimatedHours) || estimatedHours <= 0){
            return res.status(400).json({
                message:"Enter proper actual hours"
            });
        }

        if(!workItemId){
            return res.status(400).json({
                message:"Credential needed"
            });
        }

        const existingWorkItem = await prisma.workItem.findUnique({
            where:{
                id:workItemId
            },
            select:{
                id:true,
                status:true,
                actualHours:true,
                is_deleted:true,

                subTask:{
                    select:{
                        id:true,
                        assignedToId:true,
                        assignedById:true,

                        task:{
                            select:{
                                projectTeam:{
                                    select:{
                                        projectDepartment:{
                                            select:{
                                                department:{
                                                    select:{
                                                        workspaceId:true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if(!existingWorkItem || existingWorkItem.is_deleted){
            return res.status(404).json({
                message:"work item not found"
            });
        }

        if(existingWorkItem.is_deleted){
            return res.status(404).json({
                message:"Work item not found"
            });
        }

        const userId = req.user.userId;

        const workspaceId = existingWorkItem.subTask.task.projectTeam.projectDepartment.department.workspaceId

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

        if(checkUser.sys_role !== "team_lead"){
            return res.status(403).json({
                message:"Only team_lead can update work items"
            });
        }

        if(userId !== existingWorkItem.subTask.assignedById){
            return res.status(403).json({
                message:"You have not assigned this subtask"
            })
        }

        const update = await prisma.workItem.update({
            where:{
                id:workItemId
            },
            data:{
                title,
                description,
                priority,
                estimatedHours,
                status,
                is_deleted
            }
        })

        await recalculateSubTaskProgress(existingWorkItem.subTask.id);

        return res.status(200).json({
            message:"Work item updated successfully",
            data:update
        })

    }
    catch(err){
        return res.status(500).json({
            message:"Internal Server Error Happen During getting a work item of subtask"
        })
    }
}

export const deleteWorkItem = async (req,res) => {
    try{
       const { workItemId } = req.params

          if(!workItemId){
            return res.status(400).json({
                message:"Credential needed"
            });
        }

        const existingWorkItem = await prisma.workItem.findUnique({
            where:{
                id:workItemId
            },
            select:{
                id:true,
                status:true,
                actualHours:true,
                is_deleted:true,

                subTask:{
                    select:{
                        id:true,
                        assignedToId:true,
                        assignedById:true,

                        task:{
                            select:{
                                projectTeam:{
                                    select:{
                                        projectDepartment:{
                                            select:{
                                                department:{
                                                    select:{
                                                        workspaceId:true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if(!existingWorkItem || existingWorkItem.is_deleted){
            return res.status(404).json({
                message:"work item not found"
            });
        }

        if(existingWorkItem.is_deleted){
            return res.status(404).json({
                message:"Work item not found"
            });
        }

        const userId = req.user.userId;

        const workspaceId = existingWorkItem.subTask.task.projectTeam.projectDepartment.department.workspaceId

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


        if(checkUser.sys_role !== "team_lead"){
            return res.status(403).json({
                message:"Only team_lead can update work items"
            });
        }

        const deleteIt = await prisma.workItem.update({
            where:{
                id:workItemId
            },
            data:{
                is_deleted:true
            }
        })

        return res.status(200).json({
            message:"Work Item deleted successfully",
            data:deleteIt
        })

    }
    catch(err){
        return res.status(500).json({
            message:"Error happen during Deleting work item"
        })
    }
}

