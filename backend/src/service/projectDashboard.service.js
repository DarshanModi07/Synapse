import prisma from "../DB/db.config.js";
import { getVisibleDepartmentsFilter } from "../utils/rbacHelpers.js";

export const getProjectDashboardData = async (projectId, userId, role) => {
    try {
        const departmentFilter = getVisibleDepartmentsFilter(userId, role);

        if (!projectId) {
            return { status: 400, data: {
                message: "Project ID is required"
            }};
        }

        /*
        =====================================================
        PROJECT
        =====================================================
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
            return { status: 404, data: {
                message: "Project not found"
            }};
        }

        /*
        =====================================================
        WORKSPACE MEMBER
        =====================================================
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
            return { status: 403, data: {
                message: "You are not a member of this workspace"
            }};
        }

        if (
            workspaceMember.sys_role !== "owner" &&
            workspaceMember.sys_role !== "manager"
        ) {
            return { status: 403, data: {
                message: "Permission denied"
            }};
        }

        /*
        =====================================================
        PROJECT DEPARTMENTS
        =====================================================
        */

        const projectDepartments =
            await prisma.projectDepartment.findMany({
                where: {
                    projectId,
                    department: departmentFilter
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

                },

                orderBy: {

                    assignedAt: "asc"

                }

            });

        /*
        =====================================================
        PROJECT TEAMS
        =====================================================
        */

        const projectTeams =
            await prisma.projectTeam.findMany({

                where: {
                    projectDepartment: {
                        projectId,
                        department: departmentFilter
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

                            },

                            teamMembers: {
                                include: {
                                    member: {
                                        select: {
                                            id: true,
                                            name: true,
                                            avatar: true
                                        }
                                    }
                                }
                            }

                        }

                    }

                },

                orderBy: {

                    assignedAt: "asc"

                }

            });

        /*
        =====================================================
        TASKS
        =====================================================
        */

        const tasks =
            await prisma.task.findMany({

                where: {
                    projectTeam: {
                        projectDepartment: {
                            projectId,
                            department: departmentFilter
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
        =====================================================
        SUBTASKS
        =====================================================
        */

        const subtasks =
            await prisma.subTask.findMany({

                where: {
                    task: {
                        projectTeam: {
                            projectDepartment: {
                                projectId,
                                department: departmentFilter
                            }
                        }
                    },
                    is_deleted: false
                },

            });

        /*
        =====================================================
        WORK ITEMS
        =====================================================
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

        // ===== PART 2 STARTS HERE =====

                /*
        =====================================================
        OVERALL STATISTICS
        =====================================================
        */

        const completedTasks =
            tasks.filter(task => task.status === "done").length;

        const pendingTasks =
            tasks.filter(task => task.status === "todo").length;

        const inProgressTasks =
            tasks.filter(task => task.status === "in_progress").length;

        const completedSubTasks =
            subtasks.filter(
                subtask => subtask.status === "done"
            ).length;

        const completedWorkItems =
            workItems.filter(
                workItem => workItem.status === "done"
            ).length;

        const overdueTasks =
            tasks.filter(task =>
                task.dueDate &&
                new Date(task.dueDate) < new Date() &&
                task.status !== "done"
            ).length;

        const overallProgress =
            workItems.length === 0
                ? 0
                : Math.round(
                    (completedWorkItems * 100) /
                    workItems.length
                );

        /*
        =====================================================
        DEPARTMENT SUMMARY
        =====================================================
        */

        const departments =
            projectDepartments.map(projectDepartment => {

                const relatedProjectTeams =
                    projectTeams.filter(
                        projectTeam =>
                            projectTeam.projectDepartmentId ===
                            projectDepartment.id
                    );

                const projectTeamIds =
                    relatedProjectTeams.map(
                        projectTeam => projectTeam.id
                    );

                const relatedTasks =
                    tasks.filter(
                        task =>
                            projectTeamIds.includes(
                                task.projectTeamId
                            )
                    );

                const taskIds =
                    relatedTasks.map(
                        task => task.id
                    );

                const relatedSubTasks =
                    subtasks.filter(
                        subtask =>
                            taskIds.includes(
                                subtask.taskId
                            )
                    );

                const subTaskIds =
                    relatedSubTasks.map(
                        subtask => subtask.id
                    );

                const relatedWorkItems =
                    workItems.filter(
                        workItem =>
                            subTaskIds.includes(
                                workItem.subTaskId
                            )
                    );

                const completed =
                    relatedWorkItems.filter(
                        workItem =>
                            workItem.status === "done"
                    ).length;

                const progress =
                    relatedWorkItems.length === 0
                        ? 0
                        : Math.round(
                            (completed * 100) /
                            relatedWorkItems.length
                        );

                return {

                    /*
                    -------------------------------
                    IMPORTANT IDS
                    -------------------------------
                    */

                    projectDepartmentId:
                        projectDepartment.id,

                    departmentId:
                        projectDepartment.department.id,

                    /*
                    -------------------------------
                    Department
                    -------------------------------
                    */

                    id:
                        projectDepartment.department.id,

                    name:
                        projectDepartment.department.name,

                    manager:
                        projectDepartment.department.manager,

                    /*
                    -------------------------------
                    Counts
                    -------------------------------
                    */

                    teams:
                        relatedProjectTeams.length,

                    tasks:
                        relatedTasks.length,

                    subTasks:
                        relatedSubTasks.length,

                    workItems:
                        relatedWorkItems.length,

                    progress

                };

            });

        /*
        =====================================================
        STATISTICS OBJECT
        =====================================================
        */

        const statistics = {

            departments:
                departments.length,

            teams:
                projectTeams.length,

            tasks:
                tasks.length,

            completedTasks,

            pendingTasks,

            inProgressTasks,

            overdueTasks,

            subTasks:
                subtasks.length,

            completedSubTasks,

            workItems:
                workItems.length,

            completedWorkItems,

            overallProgress

        };

        // ===== PART 3 STARTS HERE =====

                /*
        =====================================================
        TEAM SUMMARY
        =====================================================
        */

        const teams =
            projectTeams.map(projectTeam => {

                const relatedTasks =
                    tasks.filter(
                        task =>
                            task.projectTeamId ===
                            projectTeam.id
                    );

                const taskIds =
                    relatedTasks.map(
                        task => task.id
                    );

                const relatedSubTasks =
                    subtasks.filter(
                        subtask =>
                            taskIds.includes(
                                subtask.taskId
                            )
                    );

                const subTaskIds =
                    relatedSubTasks.map(
                        subtask => subtask.id
                    );

                const relatedWorkItems =
                    workItems.filter(
                        workItem =>
                            subTaskIds.includes(
                                workItem.subTaskId
                            )
                    );

                const completed =
                    relatedWorkItems.filter(
                        workItem =>
                            workItem.status === "done"
                    ).length;

                const progress =
                    relatedWorkItems.length === 0
                        ? 0
                        : Math.round(
                            (completed * 100) /
                            relatedWorkItems.length
                        );

                return {

                    /*
                    ----------------------------------
                    IMPORTANT IDS
                    ----------------------------------
                    */

                    projectTeamId:
                        projectTeam.id,

                    projectDepartmentId:
                        projectTeam.projectDepartmentId,

                    teamId:
                        projectTeam.team.id,

                    /*
                    ----------------------------------
                    Team
                    ----------------------------------
                    */

                    id:
                        projectTeam.team.id,

                    name:
                        projectTeam.team.name,

                    leader:
                        projectTeam.team.leader,

                    department:
                        projectTeam.team.department,
                    
                    teamMembers:
                        projectTeam.team.teamMembers,

                    /*
                    ----------------------------------
                    Counts
                    ----------------------------------
                    */

                    members:
                        projectTeam.team._count.teamMembers,

                    tasks:
                        relatedTasks.length,

                    subTasks:
                        relatedSubTasks.length,

                    workItems:
                        relatedWorkItems.length,

                    progress

                };

            });

        /*
        =====================================================
        RECENT TASKS
        =====================================================
        */

        const recentTasks =

            tasks

                .slice()

                .sort(

                    (a, b) =>

                        new Date(b.createdAt) -

                        new Date(a.createdAt)

                )

                .slice(0, 10)

                .map(task => ({

                    id:
                        task.id,

                    title:
                        task.title,

                    status:
                        task.status,

                    priority:
                        task.priority,

                    progress:
                        task.progress,

                    dueDate:
                        task.dueDate,

                    projectTeamId:
                        task.projectTeam.id,

                    team: {

                        teamId:
                            task.projectTeam.team.id,

                        id:
                            task.projectTeam.team.id,

                        name:
                            task.projectTeam.team.name

                    }

                }));

        /*
        =====================================================
        PERMISSIONS
        =====================================================
        */

        const permissions = {

            canEdit:
                workspaceMember.sys_role === "owner",

            canDelete:
                workspaceMember.sys_role === "owner",

            canAssignDepartment:
                workspaceMember.sys_role === "owner",

            canRemoveDepartment:
                workspaceMember.sys_role === "owner",

            canAssignTeam:
                workspaceMember.sys_role === "owner" ||
                workspaceMember.sys_role === "manager",

            canRemoveTeam:
                workspaceMember.sys_role === "owner" ||
                workspaceMember.sys_role === "manager",

            canCreateTask:
                workspaceMember.sys_role === "owner" ||
                workspaceMember.sys_role === "manager"

        };

        /*
        =====================================================
        ACTIVITY
        =====================================================
        */

        const activity = [

            ...projectDepartments.map(item => ({

                type:
                    "DEPARTMENT_ASSIGNED",

                title:
                    `${item.department.name} assigned to project`,

                createdAt:
                    item.assignedAt

            })),

            ...projectTeams.map(item => ({

                type:
                    "TEAM_ASSIGNED",

                title:
                    `${item.team.name} assigned to project`,

                createdAt:
                    item.assignedAt

            })),

            ...tasks.map(task => ({

                type:
                    "TASK_CREATED",

                title:
                    `Task "${task.title}" created`,

                createdAt:
                    task.createdAt

            }))

        ]

            .sort(

                (a, b) =>

                    new Date(b.createdAt) -

                    new Date(a.createdAt)

            )

            .slice(0, 20);

        // ===== PART 4 STARTS HERE =====

                /*
        =====================================================
        PROJECT OBJECT
        =====================================================
        */

        const projectInfo = {

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

        };

        /*
        =====================================================
        FINAL RESPONSE
        =====================================================
        */

        return { status: 200, data: {

            message: "Project dashboard fetched successfully",

            data: {

                project: projectInfo,

                permissions,

                statistics,

                departments,

                teams,

                tasks,

                recentTasks,

                activity

            }

        }};

    } catch (err) {
        console.error(err);
        return { status: 500, data: { message: "Internal server error" } };
    }
};
