import prisma from "../DB/db.config.js"

export const assignTeam = async (req, res) => {
    try {
        const { projectDepartmentId } = req.params;
        const { teamId } = req.body;

        const userId = req.user.userId;

        if (!projectDepartmentId || !teamId) {
            return res.status(400).json({
                message: "Credentials needed"
            });
        }

        const projectDepartment =
            await prisma.projectDepartment.findUnique({
                where: {
                    id: projectDepartmentId
                },
                include: {
                    project: true,
                    department: true
                }
            });

        if (!projectDepartment) {
            return res.status(404).json({
                message: "Project Department not found"
            });
        }

        const checkUser =
            await prisma.workspaceMember.findUnique({
                where: {
                    workspaceId_userId: {
                        workspaceId:
                            projectDepartment.project.workspaceId,
                        userId
                    }
                }
            });

        if (!checkUser) {
            return res.status(403).json({
                message:
                    "You are not a member of this workspace"
            });
        }

        const checkTeam = await prisma.team.findUnique({
            where: {
                id: teamId
            }
        });

        if (!checkTeam || checkTeam.is_deleted) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        if (
            checkTeam.departmentId !==
            projectDepartment.departmentId
        ) {
            return res.status(400).json({
                message:
                    "Team does not belong to this department"
            });
        }

        const existingAssignment =
            await prisma.projectTeam.findFirst({
                where: {
                    projectDepartmentId,
                    teamId
                }
            });

        if (existingAssignment) {
            return res.status(409).json({
                message:
                    "Team already assigned to project department"
            });
        }

        const createProjectTeam = await prisma.projectTeam.create({
            data: {
                projectDepartmentId,
                teamId,
                assignedById: userId
            },
            include: {
                team: {
                    include: {
                        leader: true,
                        department: true
                    }
                }
            }
        });

        return res.status(201).json({
            message: "Team assigned successfully",
            data: createProjectTeam
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message:
                "Internal server error during assigning team"
        });
    }
};

export const getTeams = async (req, res) => {
    try {
        const { projectDepartmentId } = req.params;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const projectDepartment =
            await prisma.projectDepartment.findUnique({
                where: {
                    id: projectDepartmentId
                },
                include: {
                    project: true
                }
            });

        if (!projectDepartment) {
            return res.status(404).json({
                message: "Project Department not found"
            });
        }

        const checkUser =
            await prisma.workspaceMember.findUnique({
                where: {
                    workspaceId_userId: {
                        workspaceId:
                            projectDepartment.project.workspaceId,
                        userId: req.user.userId
                    }
                }
            });

        if (!checkUser) {
            return res.status(403).json({
                message:
                    "You are not a member of this workspace"
            });
        }

        const totalTeams =
            await prisma.projectTeam.count({
                where: {
                    projectDepartmentId
                }
            });

        const teams =
            await prisma.projectTeam.findMany({
                where: {
                    projectDepartmentId
                },
                include: {
                    team: {
                        include: {
                            department: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                            leader: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    avatar: true
                                }
                            }
                        }
                    }
                },
                skip,
                take: limit
            });

        return res.status(200).json({
            message: "Teams fetched successfully",
            pagination: {
                total: totalTeams,
                page,
                limit,
                totalPages:
                    Math.ceil(totalTeams / limit)
            },
            count: teams.length,
            data: teams
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message:
                "Internal server error while getting teams"
        });
    }
};

export const removeTeam = async (req, res) => {
    try {

        const {
            projectDepartmentId,
            teamId
        } = req.params;

        const userId = req.user.userId;

        if (!projectDepartmentId || !teamId) {
            return res.status(400).json({
                message: "Project Department ID and Team ID are required"
            });
        }

        /*
        ----------------------------------------------------
        Check Assignment
        ----------------------------------------------------
        */

        const assignment = await prisma.projectTeam.findFirst({

            where: {
                projectDepartmentId,
                teamId
            },

            include: {

                projectDepartment: {

                    include: {

                        project: {

                            select: {
                                workspaceId: true
                            }

                        }

                    }

                }

            }

        });

        if (!assignment) {

            return res.status(404).json({
                message: "Team is not assigned to this project department"
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

                        workspaceId:
                            assignment.projectDepartment.project.workspaceId,

                        userId

                    }

                }

            });

        if (!workspaceMember) {

            return res.status(403).json({
                message: "You are not a member of this workspace"
            });

        }

        if (
            workspaceMember.sys_role !== "owner" &&
            workspaceMember.sys_role !== "manager"
        ) {

            return res.status(403).json({
                message: "Only Owner and Manager can remove teams"
            });

        }

        /*
        ----------------------------------------------------
        Prevent deletion if tasks exist
        ----------------------------------------------------
        */

        const taskCount = await prisma.task.count({

            where: {

                projectTeamId: assignment.id,

                is_deleted: false

            }

        });

        if (taskCount > 0) {

            return res.status(400).json({

                message:
                    "Cannot remove team because it still has active tasks."

            });

        }

        /*
        ----------------------------------------------------
        Remove Team
        ----------------------------------------------------
        */

        await prisma.projectTeam.delete({

            where: {

                projectDepartmentId_teamId: {

                    projectDepartmentId,

                    teamId

                }

            }

        });

        return res.status(200).json({

            message: "Team removed successfully"

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            message: "Internal server error while removing team"

        });

    }

};

export const teamDashboard = async (req,res) => {
    try{
        const { projectTeamId } = req.params;
        const userId = req.user.userId;

        if(!projectTeamId){
            return res.status(400).json({
                message:"Credential needed"
            });
        }

        const projectTeam = await prisma.projectTeam.findUnique({
            where:{
                id:projectTeamId
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
                },
                team:{
                    select:{
                        id:true,
                        name:true
                    }
                }
            }
        });

        if(!projectTeam){
            return res.status(404).json({
                message:"Project Team Not Found"
            });
        }

        const workspaceId =
            projectTeam.projectDepartment.department.workspaceId;

        const checkUser =
            await prisma.workspaceMember.findUnique({
                where:{
                    workspaceId_userId:{
                        workspaceId,
                        userId
                    }
                }
            });

        if(!checkUser){
            return res.status(403).json({
                message:"You are not member of workspace"
            });
        }

        if(checkUser.sys_role === "employee"){
            return res.status(403).json({
                message:"You are not able to see this data"
            })
        }

        const tasks = await prisma.task.findMany({
            where:{
                projectTeamId,
                is_deleted:false
            },
            select:{
                id:true,
                title:true,
                status:true,
                priority:true,
                createdAt:true
            }
        });

        const taskIds = tasks.map(
            task => task.id
        );

        const subTasks =
            await prisma.subTask.findMany({
                where:{
                    taskId:{
                        in:taskIds
                    },
                    is_deleted:false
                },
                select:{
                    id:true,
                    title:true,
                    status:true,
                    assignedTo:{
                        select:{
                            id:true,
                            name:true
                        }
                    }
                }
            });

        const subTaskIds =
            subTasks.map(
                subtask => subtask.id
            );

        const totalWorkItems =
            await prisma.workItem.count({
                where:{
                    subTaskId:{
                        in:subTaskIds
                    },
                    is_deleted:false
                }
            });

        const completedWorkItems =
            await prisma.workItem.count({
                where:{
                    subTaskId:{
                        in:subTaskIds
                    },
                    status:"done",
                    is_deleted:false
                }
            });

        const progress =
            totalWorkItems === 0
                ? 0
                : Number(
                    (
                        completedWorkItems *
                        100 /
                        totalWorkItems
                    ).toFixed(2)
                );

        return res.status(200).json({
            message:"Team dashboard fetched",

            team:{
                id:projectTeam.team.id,
                name:projectTeam.team.name
            },

            tasks:{
                total:tasks.length,
                completed:
                    tasks.filter(
                        t => t.status === "done"
                    ).length
            },

            subtasks:{
                total:subTasks.length,
                completed:
                    subTasks.filter(
                        st => st.status === "done"
                    ).length
            },

            workItems:{
                total:totalWorkItems,
                completed:completedWorkItems
            },

            progress,

            recentTasks:
                tasks
                .sort(
                    (a,b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
                )
                .slice(0,5),

            recentSubTasks:
                subTasks.slice(0,10)
        });

    }
    catch(err){
        console.log(err);

        return res.status(500).json({
            message:"Internal Server Error while fetching dashboard"
        });
    }
};

export const getAvailableTeams = async (req, res) => {
    try {

        const { projectDepartmentId } = req.params;
        const userId = req.user.userId;

        if (!projectDepartmentId) {
            return res.status(400).json({
                message: "Project Department ID is required"
            });
        }

        /*
        ----------------------------------------------------
        Check Project Department
        ----------------------------------------------------
        */

        const projectDepartment =
            await prisma.projectDepartment.findUnique({

                where: {
                    id: projectDepartmentId
                },

                include: {

                    department: {
                        select: {
                            id: true,
                            workspaceId: true
                        }
                    }

                }

            });

        if (!projectDepartment) {

            return res.status(404).json({
                message: "Project Department not found"
            });

        }

        /*
        ----------------------------------------------------
        Check Workspace Permission
        ----------------------------------------------------
        */

        const workspaceMember =
            await prisma.workspaceMember.findUnique({

                where: {

                    workspaceId_userId: {

                        workspaceId:
                            projectDepartment.department.workspaceId,

                        userId

                    }

                }

            });

        if (!workspaceMember) {

            return res.status(403).json({
                message: "You are not a member of this workspace"
            });

        }

        if (
            workspaceMember.sys_role !== "owner" &&
            workspaceMember.sys_role !== "manager"
        ) {

            return res.status(403).json({
                message: "You are not allowed to perform this action"
            });

        }

        /*
        ----------------------------------------------------
        Already Assigned Teams
        ----------------------------------------------------
        */

        const assignedTeams =
            await prisma.projectTeam.findMany({

                where: {
                    projectDepartmentId
                },

                select: {
                    teamId: true
                }

            });

        const assignedIds =
            assignedTeams.map(
                item => item.teamId
            );

        /*
        ----------------------------------------------------
        Available Teams
        ----------------------------------------------------
        */

        const teams =
            await prisma.team.findMany({

                where: {

                    departmentId:
                        projectDepartment.departmentId,

                    is_deleted: false,

                    id: {
                        notIn: assignedIds
                    }

                },

                include: {

                    leader: {

                        select: {

                            id: true,
                            name: true,
                            email: true,
                            avatar: true

                        }

                    },

                    _count: {

                        select: {

                            teamMembers: true,

                            teamProjects: true

                        }

                    }

                },

                orderBy: {

                    name: "asc"

                }

            });

        return res.status(200).json({

            message:
                "Available teams fetched successfully",

            data:

                teams.map(team => ({

                    id: team.id,

                    name: team.name,

                    leader: team.leader,

                    members:
                        team._count.teamMembers,

                    activeProjects:
                        team._count.teamProjects,

                    createdAt:
                        team.createdAt

                }))

        });

    }
    catch (err) {

        console.error(err);

        return res.status(500).json({

            message:
                "Internal Server Error while fetching available teams"

        });

    }
};

