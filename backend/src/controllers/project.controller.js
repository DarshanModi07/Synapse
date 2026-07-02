import { start } from "repl"
import prisma from "../DB/db.config.js"

export const createProject = async (req, res) => {
    try {
        let { workspaceId, name, description, startDate, dueDate } = req.body;

        name = name?.trim();
        description = description?.trim();

        if (!workspaceId || !name || !startDate || !dueDate) {
            return res.status(400).json({
                message: "workspaceId, name, startDate and dueDate are required"
            });
        }

        const currentUserId = req.user.userId;

        const checkWorkspace = await prisma.workspace.findUnique({
            where: {
                id: workspaceId
            }
        });

        if (!checkWorkspace) {
            return res.status(404).json({
                message: "Workspace not found"
            });
        }

        const checkWorkSpaceMember = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId: currentUserId
                }
            }
        });

        if (!checkWorkSpaceMember) {
            return res.status(403).json({
                message: "You are not a member of this workspace"
            });
        }

        if (
            checkWorkSpaceMember.sys_role !== "owner" &&
            checkWorkSpaceMember.sys_role !== "manager"
        ) {
            return res.status(403).json({
                message: "You are not allowed to create projects"
            });
        }

        const checkNameAvail = await prisma.project.findUnique({
            where: {
                workspaceId_name: {
                    workspaceId,
                    name
                }
            }
        });

        if (checkNameAvail) {
            return res.status(409).json({
                message: "Project name already exists"
            });
        }

        const start = new Date(startDate);
        const due = new Date(dueDate);

        if (isNaN(start.getTime()) || isNaN(due.getTime())) {
            return res.status(400).json({
                message: "Invalid date format"
            });
        }

        if (start > due) {
            return res.status(400).json({
                message: "Start date cannot be after due date"
            });
        }

        const project = await prisma.project.create({
            data: {
                name,
                description: description || null,
                workspaceId,
                createdById: currentUserId,
                startDate: start,
                dueDate: due
            }
        });

        return res.status(201).json({
            message: "Project created successfully",
            data: project
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal Server Error while creating project"
        });
    }
};

export const getProject = async (req,res) => {
    try{
        const { projectId } = req.params

        if(!projectId){
            return res.status(400).json({
                message:"Credentials needed"
            })
        }

        const singleProject = await prisma.project.findFirst({
            where:{
                id:projectId,
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
            }
        })

        if(!singleProject){
            return res.status(404).json({
                message:"Project Not Found"
            })
        }

        const checkUser = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId:singleProject.workspaceId,
                    userId:req.user.userId
                }
            }
        })

        if(!checkUser){
            return res.status(403).json({
                message:"You are Not the Member of the Workspace"
            })
        }

        return res.status(200).json({
            message:"Project Fetched successfully",
            data:singleProject
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error while Getting a Project"
        })
    }
}

export const getAllProjects = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const userId = req.user.userId;

        if (!workspaceId) {
            return res.status(400).json({
                message: "Workspace ID is required"
            });
        }

        // Verify workspace membership
        const checkUser = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId
                }
            }
        });

        if (!checkUser) {
            return res.status(403).json({
                message: "You are not a member of this workspace"
            });
        }

        const totalProjects = await prisma.project.count({
            where: {
                workspaceId,
                is_deleted: false
            }
        });

        const allProjects = await prisma.project.findMany({
            where: {
                workspaceId,
                is_deleted: false
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            skip,
            take: limit
        });

        return res.status(200).json({
            message:
                allProjects.length > 0
                    ? "Projects fetched successfully"
                    : "No projects found",
            pagination: {
                total: totalProjects,
                page,
                limit,
                totalPages: Math.ceil(totalProjects / limit)
            },
            data: allProjects
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error while fetching projects"
        });
    }
};

export const updateProject = async (req,res) => {
    try{
        const { projectId } = req.params

        let { startDate , dueDate , name , description , is_deleted , status } = req.body

        if(!projectId){
            return res.status(400).json({
                message:"credential needed"
            })
        }

        const checkProject = await prisma.project.findFirst({
            where:{
                id:projectId,
                is_deleted:false
            }
        })

        if(!checkProject){
            return res.status(404).json({
                message:"Project Not found"
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
                message:"You are not member of the workspace"
            })
        }

        const allowedRoles = ["owner","manager"];

        if(!allowedRoles.includes(checkUser.sys_role)){
            return res.status(403).json({
                message:"You do not have permission to update projects"
            });
        }

        const existingProject = await prisma.project.findFirst({
            where:{
                workspaceId: checkProject.workspaceId,
                name,
                is_deleted:false,
                id:{
                    not: projectId
                }
            }
        });

        if(existingProject){
            return res.status(409).json({
                message:"Project name already exists"
            });
        }

        const updateData = {}

        const allowedStatus = [
            "planning",
            "active",
            "on_hold",
            "completed",
            "cancelled"
        ];

        if(name){
            name = name.trim()
            if(!name || name === ""){
                return res.status(404).json({
                    message:"Give Proper Name"
                })
            }
            else{
                updateData.name = name
            }
        }
        if(description){
            description = description.trim()
            if(!description || description === ""){
                return res.status(404).json({
                    message:"Give Proper description"
                })
            }
            else{
                updateData.description = description
            }
        }
        if(typeof is_deleted === "boolean"){
            updateData.is_deleted = is_deleted;

            updateData.deletedAt = is_deleted ? new Date() : null;
        }
        const finalStartDate = startDate ? new Date(startDate) : checkProject.startDate;

        const finalDueDate = dueDate ? new Date(dueDate) : checkProject.dueDate;

        if( finalStartDate && finalDueDate && finalStartDate > finalDueDate){
            return res.status(400).json({
                message:"Due date must be after start date"
            });
        }
        if (status !== undefined) {
            status = status.trim().toLowerCase();

            if (!allowedStatus.includes(status)) {
                return res.status(400).json({
                    message: `Status must be one of: ${allowedStatus.join(", ")}`
                });
            }

            updateData.status = status;
        }

        if(Object.keys(updateData).length === 0){
            return res.status(400).json({
                message:"No valid fields provided for update"
            });
        }

        const updateProject = await prisma.project.update({
            where:{
                id:projectId
            },
            data:updateData
        })

        return res.status(200).json({
            message:"Project data updated",
            data:updateProject
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error during updating Error"
        })
    }
}

export const deleteProject = async (req,res) => {
    try{
        const { projectId } = req.params

        if(!projectId){
            return res.status(400).json({
                message:"Credentials needed"
            })
        }

        const singleProject = await prisma.project.findUnique({
            where:{
                id:projectId
            }
        })

        if(!singleProject || singleProject.is_deleted){
            return res.status(404).json({
                message:"Project Not Found"
            })
        }

        const checkWorkspace = await prisma.workspace.findUnique({
            where: {
                id: singleProject.workspaceId
            }
        });

        if (!checkWorkspace) {
            return res.status(404).json({
                message: "Workspace not found"
            });
        }

        const checkUser = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId:singleProject.workspaceId,
                    userId:req.user.userId
                }
            }
        })

        if(!checkUser){
            return res.status(403).json({
                message:"You are Not the Member of the Workspace"
            })
        }

        if(checkUser.sys_role !== "owner" && checkUser.sys_role !== "manager"){
            return res.status(403).json({
                message:"You can not delete the Project"
            })
        }

        const deletedProject = await prisma.project.update({
            where:{
                id:projectId
            },
            data:{
                is_deleted:true,
                deletedAt:new Date()
            }
        })

        return res.status(200).json({
            message:"Project deleted successfully",
            data:deletedProject
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error while deleting a Project"
        })
    }
}

export const projectProgress = async (req,res) => {
    try{
        const { projectId } = req.params

        if(!projectId){
            return res.status(400).json({
                message:"Credentials needed"
            })
        }

        const singleProject = await prisma.project.findUnique({
            where:{
                id:projectId
            }
        })

        if(!singleProject || singleProject.is_deleted){
            return res.status(404).json({
                message:"Project Not Found"
            })
        }

        const checkWorkspace = await prisma.workspace.findUnique({
            where: {
                id: singleProject.workspaceId
            }
        });

        if (!checkWorkspace) {
            return res.status(404).json({
                message: "Workspace not found"
            });
        }

        const checkUser = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId:singleProject.workspaceId,
                    userId:req.user.userId
                }
            }
        })

        if(!checkUser){
            return res.status(403).json({
                message:"You are Not the Member of the Workspace"
            })
        }

        const data = await prisma.project.findUnique({
            where:{
                id:projectId
            },
            select:{
                name:true,
                is_deleted:true,
                status:true,
                dueDate:true,
                projectDepartments:{
                    select:{
                        projectTeams:{
                            select:{
                                tasks:{
                                    select:{
                                        subtasks:{
                                            select:{
                                                workItems:{
                                                    select:{
                                                        id:true,
                                                        title:true,
                                                        is_deleted:true,
                                                        priority:true,
                                                        status:true
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
        })

        const workItems = data.projectDepartments.flatMap(projectDepartment =>
            projectDepartment.projectTeams.flatMap(team =>
                team.tasks.flatMap(task =>
                    task.subtasks.flatMap(subtask =>
                        subtask.workItems
                    )
                )
            )
        );

        const activeWorkItems = workItems.filter(item => !item.is_deleted);

        const total = activeWorkItems.length;

        if(total === 0){
            return res.status(200).json({
                message:"Project Progress Fetched",
                data:{
                    done:0,
                    inProgress:0,
                    inReview:0
                },
                name:data.name,
                dueDate:data.dueDate
            });
        }

        const done = activeWorkItems.filter(
            item => item.status === "done"
        ).length;

        const inProgress = activeWorkItems.filter(
            item => item.status === "in_progress"
        ).length;

        const inReview = activeWorkItems.filter(
            item => item.status === "in_review"
        ).length;

        const todo = activeWorkItems.filter(
            item => item.status === "todo"
        ).length;

        const cancelled = activeWorkItems.filter(
            item => item.status === "cancelled"
        ).length;

        const progress = {}
        progress.done = Number(((done / total) * 100).toFixed(2));
        progress.inProgress = Number(((inProgress / total) * 100).toFixed(2));
        progress.inReview = Number(((inReview / total) * 100).toFixed(2));
        progress.todo = Number(((todo / total) * 100).toFixed(2));
        progress.cancelled = Number(((cancelled / total) * 100).toFixed(2));

        return res.status(200).json({
            message:"Project Progress Fetched",
            data:progress,
            name:data.name,
            todo,
            inProgress,
            inReview,
            todo,
            cancelled,
            dueDate:data.dueDate
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server error during fetching project progress"
        })
    }
}

export const projectDashboard = async (req, res) => {

    try {

        const { projectId } = req.params;

        const userId = req.user.userId;

        if (!projectId) {

            return res.status(400).json({
                message: "Project ID is required"
            });

        }

        /*
        ----------------------------------------------------
        Find Project
        ----------------------------------------------------
        */

        const project = await prisma.project.findUnique({

            where: {
                id: projectId
            },

            include: {

                workspace: {

                    select: {

                        id: true,
                        name: true,
                        slug: true

                    }

                },

                createdBy: {

                    select: {

                        id: true,
                        name: true,
                        email: true,
                        avatar: true

                    }

                }

            }

        });

        if (!project || project.is_deleted) {

            return res.status(404).json({

                message: "Project not found"

            });

        }

        /*
        ----------------------------------------------------
        Workspace Permission
        ----------------------------------------------------
        */

        const workspaceMember =
            await prisma.workspaceMember.findUnique({

                where: {

                    workspaceId_userId: {

                        workspaceId: project.workspaceId,

                        userId

                    }

                }

            });

        if (!workspaceMember) {

            return res.status(403).json({

                message:
                    "You are not a member of this workspace"

            });

        }

        if (

            workspaceMember.sys_role !== "owner" &&
            workspaceMember.sys_role !== "manager"

        ) {

            return res.status(403).json({

                message:
                    "You are not allowed to access this dashboard"

            });

        }

        /*
        ----------------------------------------------------
        Fetch Project Departments
        ----------------------------------------------------
        */

        const projectDepartments =
            await prisma.projectDepartment.findMany({

                where: {

                    projectId

                },

                include: {

                    department: {

                        include: {

                            manager: {

                                select: {

                                    id: true,
                                    name: true,
                                    email: true,
                                    avatar: true

                                }

                            }

                        }

                    }

                }

            });

                    /*
        ----------------------------------------------------
        Fetch Project Teams
        ----------------------------------------------------
        */

        const projectTeams =
            await prisma.projectTeam.findMany({

                where: {

                    projectDepartment: {

                        projectId

                    }

                },

                include: {

                    team: {

                        include: {

                            leader: {

                                select: {

                                    id: true,
                                    name: true,
                                    email: true,
                                    avatar: true

                                }

                            },

                            department: {

                                select: {

                                    id: true,
                                    name: true

                                }

                            },

                            _count: {

                                select: {

                                    teamMembers: true

                                }

                            }

                        }

                    }

                }

            });

        /*
        ----------------------------------------------------
        Fetch Tasks
        ----------------------------------------------------
        */

        const tasks =
            await prisma.task.findMany({

                where: {

                    projectTeam: {

                        projectDepartment: {

                            projectId

                        }

                    },

                    is_deleted: false

                },

                include: {

                    projectTeam: {

                        include: {

                            team: {

                                select: {

                                    id: true,
                                    name: true

                                }

                            }

                        }

                    }

                },

                orderBy: {

                    createdAt: "desc"

                }

            });

        /*
        ----------------------------------------------------
        Fetch SubTasks
        ----------------------------------------------------
        */

        const subtasks =
            await prisma.subTask.findMany({

                where: {

                    task: {

                        projectTeam: {

                            projectDepartment: {

                                projectId

                            }

                        }

                    },

                    is_deleted: false

                },

                include: {

                    assignedTo: {

                        select: {

                            id: true,
                            name: true

                        }

                    }

                }

            });

        /*
        ----------------------------------------------------
        Fetch Work Items
        ----------------------------------------------------
        */

        const workItems =
            await prisma.workItem.findMany({

                where: {

                    subTask: {

                        task: {

                            projectTeam: {

                                projectDepartment: {

                                    projectId

                                }

                            }

                        }

                    },

                    is_deleted: false

                }

            });

                    /*
        ----------------------------------------------------
        Overall Statistics
        ----------------------------------------------------
        */

        const completedTasks =
            tasks.filter(
                task => task.status === "done"
            ).length;

        const pendingTasks =
            tasks.filter(
                task => task.status === "todo"
            ).length;

        const inProgressTasks =
            tasks.filter(
                task => task.status === "in_progress"
            ).length;

        const completedSubTasks =
            subtasks.filter(
                subtask => subtask.status === "done"
            ).length;

        const completedWorkItems =
            workItems.filter(
                workItem => workItem.status === "done"
            ).length;

        const overallProgress =
            workItems.length === 0
                ? 0
                : Math.round(
                    (completedWorkItems * 100) /
                    workItems.length
                );

        /*
        ----------------------------------------------------
        Department Summary
        ----------------------------------------------------
        */

        const departments =
            projectDepartments.map(projectDepartment => {

                const departmentTeams =
                    projectTeams.filter(
                        team =>
                            team.projectDepartment.departmentId ===
                            projectDepartment.departmentId
                    );

                const departmentTeamIds =
                    departmentTeams.map(
                        team => team.id
                    );

                const departmentTasks =
                    tasks.filter(
                        task =>
                            departmentTeamIds.includes(
                                task.projectTeamId
                            )
                    );

                const departmentSubTasks =
                    subtasks.filter(
                        subtask =>
                            departmentTasks.some(
                                task =>
                                    task.id === subtask.taskId
                            )
                    );

                const departmentWorkItems =
                    workItems.filter(
                        workItem =>
                            departmentSubTasks.some(
                                subtask =>
                                    subtask.id ===
                                    workItem.subTaskId
                            )
                    );

                const completedDepartmentWorkItems =
                    departmentWorkItems.filter(
                        workItem =>
                            workItem.status === "done"
                    ).length;

                const progress =
                    departmentWorkItems.length === 0
                        ? 0
                        : Math.round(
                            completedDepartmentWorkItems *
                            100 /
                            departmentWorkItems.length
                        );

                return {

                    id:
                        projectDepartment.department.id,

                    name:
                        projectDepartment.department.name,

                    manager:
                        projectDepartment.department.manager,

                    teams:
                        departmentTeams.length,

                    tasks:
                        departmentTasks.length,

                    progress

                };

            });

        /*
        ----------------------------------------------------
        Team Summary
        ----------------------------------------------------
        */

        const teams =
            projectTeams.map(projectTeam => {

                const teamTasks =
                    tasks.filter(
                        task =>
                            task.projectTeamId ===
                            projectTeam.id
                    );

                const teamSubTasks =
                    subtasks.filter(
                        subtask =>
                            teamTasks.some(
                                task =>
                                    task.id === subtask.taskId
                            )
                    );

                const teamWorkItems =
                    workItems.filter(
                        workItem =>
                            teamSubTasks.some(
                                subtask =>
                                    subtask.id ===
                                    workItem.subTaskId
                            )
                    );

                const completed =
                    teamWorkItems.filter(
                        workItem =>
                            workItem.status === "done"
                    ).length;

                const progress =
                    teamWorkItems.length === 0
                        ? 0
                        : Math.round(
                            completed *
                            100 /
                            teamWorkItems.length
                        );

                return {

                    id:
                        projectTeam.team.id,

                    name:
                        projectTeam.team.name,

                    leader:
                        projectTeam.team.leader,

                    department:
                        projectTeam.team.department,

                    members:
                        projectTeam.team._count.teamMembers,

                    tasks:
                        teamTasks.length,

                    progress

                };

            });

                    /*
        ----------------------------------------------------
        Recent Tasks
        ----------------------------------------------------
        */

        const recentTasks = tasks

            .slice()

            .sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            )

            .slice(0, 10)

            .map(task => ({

                id: task.id,

                title: task.title,

                status: task.status,

                priority: task.priority,

                progress: task.progress,

                dueDate: task.dueDate,

                team: {

                    id: task.projectTeam.team.id,

                    name: task.projectTeam.team.name

                }

            }));


        /*
        ----------------------------------------------------
        Recent Activity
        ----------------------------------------------------
        */

        const activity = [

            ...projectDepartments.map(item => ({

                type: "department",

                title: `${item.department.name} assigned to project`,

                createdAt: item.assignedAt

            })),

            ...projectTeams.map(item => ({

                type: "team",

                title: `${item.team.name} assigned`,

                createdAt: item.assignedAt

            })),

            ...tasks.map(task => ({

                type: "task",

                title: `Task "${task.title}" created`,

                createdAt: task.createdAt

            }))

        ]

            .sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            )

            .slice(0, 20);


        /*
        ----------------------------------------------------
        Final Response
        ----------------------------------------------------
        */

        return res.status(200).json({

            message:
                "Project dashboard fetched successfully",

            data: {

                project: {

                    id: project.id,

                    name: project.name,

                    description: project.description,

                    status: project.status,

                    startDate: project.startDate,

                    dueDate: project.dueDate,

                    createdAt: project.createdAt,

                    updatedAt: project.updatedAt,

                    workspace: project.workspace,

                    createdBy: project.createdBy

                },

                statistics: {

                    departments:
                        projectDepartments.length,

                    teams:
                        projectTeams.length,

                    tasks:
                        tasks.length,

                    completedTasks,

                    pendingTasks,

                    inProgressTasks,

                    subTasks:
                        subtasks.length,

                    completedSubTasks,

                    workItems:
                        workItems.length,

                    completedWorkItems,

                    overallProgress

                },

                departments,

                teams,

                recentTasks,

                activity

            }

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            message:
                "Internal Server Error while fetching project dashboard"

        });

    }

};