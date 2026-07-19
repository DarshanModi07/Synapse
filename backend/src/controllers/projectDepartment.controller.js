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
        return res.status(500).json({
            message:"Internal Server Error during removing department"
        })
    }
}

export const progressDepartment = async (req,res) => {
    try{
        const { projectDepartmentId } = req.params

        const userId = req.user.userId

        if(!projectDepartmentId){
            return res.status(400).json({
                message:"project department not found"
            })
        }

        const checkProjectDept = await prisma.projectDepartment.findUnique({
            where:{
                id:projectDepartmentId
            }
        })

        if(!checkProjectDept){
            return res.status.json({
                message:"project department not found"
            })
        }

        const data = await prisma.projectDepartment.findUnique({
            where:{
                id: projectDepartmentId
            },
            select:{
                department:{
                    select:{
                        name:true,
                        workspaceId:true
                    }
                },
                projectTeams:{
                    select:{
                        tasks:{
                            select:{
                                subtasks:{
                                    select:{
                                        workItems:{
                                            select:{
                                                id:true,
                                                status:true,
                                                is_deleted:true
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

        const workspaceId = data?.department?.workspaceId

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
                message:"You are not the member of this workspace"
            })
        }

        const workItems = data.projectTeams.flatMap(team =>
            team.tasks.flatMap(task =>
                task.subtasks.flatMap(subtask =>
                    subtask.workItems
                )
            )
        );

        const done = workItems.filter(
            item => item.status === "done" && !item.is_deleted
        ).length;

        const inProgress = workItems.filter(
            item => item.status === "in_progress" && !item.is_deleted
        ).length;

        const inReview = workItems.filter(
            item => item.status === "in_review" && !item.is_deleted
        ).length;

        const total = workItems.filter(item => !item.is_deleted).length;

        const progress = {}
        progress.done = (done/total)*100
        progress.inProgress = (inProgress/total)*100
        progress.inReview = (inReview/total)*100
    
        return res.status(200).json({
            message:"Department Progress Fetched",
            data:progress,
            name:data?.department?.name,
            total,
            done,
            inProgress,
            inReview
        })

    }
    catch(err){
        return res.status(500).json({
            message:"Internal Server Error while progress department"
        })
    }
}

export const managerDashboard = async (req,res) => {
    try{

        const { projectDepartmentId } = req.params;
        const userId = req.user.userId;

        if(!projectDepartmentId){
            return res.status(400).json({
                message:"Credentials needed"
            });
        }

        const data = await prisma.projectDepartment.findUnique({
            where:{
                id:projectDepartmentId
            },
            select:{
                department:{
                    select:{
                        id:true,
                        name:true,
                        workspaceId:true
                    }
                },
                projectTeams:{
                    select:{
                        id:true,
                        team:{
                            select:{
                                id:true,
                                name:true
                            }
                        },
                        tasks:{
                            select:{
                                id:true,
                                title:true,
                                createdAt:true,
                                subtasks:{
                                    select:{
                                        id:true,
                                        workItems:{
                                            select:{
                                                status:true,
                                                is_deleted:true
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

        if(!data){
            return res.status(404).json({
                message:"Project Department not found"
            });
        }

        const checkUser =
            await prisma.workspaceMember.findUnique({
                where:{
                    workspaceId_userId:{
                        workspaceId:
                            data.department.workspaceId,
                        userId
                    }
                }
            });

        if(!checkUser){
            return res.status(403).json({
                message:"You are not member of workspace"
            });
        }

        if(
            checkUser.sys_role !== "owner" &&
            checkUser.sys_role !== "manager"
        ){
            return res.status(403).json({
                message:"You are not allowed"
            });
        }

        const teams =
            data.projectTeams;

        const tasks =
            teams.flatMap(team =>
                team.tasks
            );

        const subTasks =
            tasks.flatMap(task =>
                task.subtasks
            );

        const workItems =
            subTasks.flatMap(subtask =>
                subtask.workItems
            );

        const totalWorkItems =
            workItems.filter(
                item => !item.is_deleted
            ).length;

        const done =
            workItems.filter(
                item =>
                    item.status === "done" &&
                    !item.is_deleted
            ).length;

        const inProgress =
            workItems.filter(
                item =>
                    item.status === "in_progress" &&
                    !item.is_deleted
            ).length;

        const inReview =
            workItems.filter(
                item =>
                    item.status === "in_review" &&
                    !item.is_deleted
            ).length;

        const overall =
            totalWorkItems === 0
                ? 0
                : Number(
                    (
                        done * 100 /
                        totalWorkItems
                    ).toFixed(2)
                );

        const teamProgress =
            teams.map(team => {

                const teamWorkItems =
                    team.tasks.flatMap(task =>
                        task.subtasks.flatMap(
                            subtask =>
                                subtask.workItems
                        )
                    );

                const total =
                    teamWorkItems.filter(
                        item => !item.is_deleted
                    ).length;

                const completed =
                    teamWorkItems.filter(
                        item =>
                            item.status === "done" &&
                            !item.is_deleted
                    ).length;

                return {
                    id:team.team.id,
                    name:team.team.name,
                    progress:
                        total === 0
                            ? 0
                            : Number(
                                (
                                    completed *
                                    100 /
                                    total
                                ).toFixed(2)
                            )
                };
            });

        return res.status(200).json({
            message:"Department Dashboard Fetched",

            department:data.department,

            overview:{
                teams:teams.length,
                tasks:tasks.length,
                subTasks:subTasks.length,
                workItems:totalWorkItems
            },

            progress:{
                overall,
                done,
                inProgress,
                inReview
            },

            teams:teamProgress,

            recentTasks:
                tasks
                    .sort(
                        (a,b) =>
                            new Date(b.createdAt) -
                            new Date(a.createdAt)
                    )
                    .slice(0,5)
        });

    }
    catch(err){
        return res.status(500).json({
            message:"Internal Server Error while fetching manager dashboard"
        });
    }
}