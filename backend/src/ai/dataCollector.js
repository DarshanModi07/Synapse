import prisma from "../DB/db.config.js";

export const collectProjectData = async (projectId) => {

    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            workspace: {
                select: { id: true, name: true }
            },
            createdBy: {
                select: { id: true, name: true }
            },
            projectDepartments: {
                include: {
                    department: {
                        include: {
                            manager: {
                                select: { id: true, name: true }
                            }
                        }
                    },
                    projectTeams: {
                        include: {
                            team: {
                                include: {
                                    leader: {
                                        select: { id: true, name: true }
                                    },
                                    teamMembers: {
                                        include: {
                                            member: {
                                                select: { id: true, name: true }
                                            }
                                        }
                                    }
                                }
                            },
                            tasks: {
                                where: { is_deleted: false },
                                include: {
                                    createdBy: {
                                        select: { id: true, name: true }
                                    },
                                    subtasks: {
                                        where: { is_deleted: false },
                                        include: {
                                            assignedTo: {
                                                select: { id: true, name: true }
                                            },
                                            assignedBy: {
                                                select: { id: true, name: true }
                                            },
                                            workItems: {
                                                where: { is_deleted: false }
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

    return project;
};

export const buildAnalyticsPayload = (project) => {

    const now = new Date();

    // flatten all tasks
    const allTasks = project.projectDepartments
        .flatMap(pd => pd.projectTeams)
        .flatMap(pt => pt.tasks ?? []);

    // flatten all subtasks
    const allSubTasks = allTasks.flatMap(t => t.subtasks ?? []);

    // flatten all workitems
    const allWorkItems = allSubTasks.flatMap(s => s.workItems ?? []);

    // task stats
    const taskStats = {
        total: allTasks.length,
        done: allTasks.filter(t => t.status === "done").length,
        in_progress: allTasks.filter(t => t.status === "in_progress").length,
        in_review: allTasks.filter(t => t.status === "in_review").length,
        todo: allTasks.filter(t => t.status === "todo").length,
        cancelled: allTasks.filter(t => t.status === "cancelled").length,
        overdue: allTasks.filter(t =>
            t.dueDate &&
            new Date(t.dueDate) < now &&
            t.status !== "done" &&
            t.status !== "cancelled"
        ).length,
        high_priority: allTasks.filter(t => t.priority === "high" || t.priority === "urgent").length,
        avgProgress: allTasks.length
            ? Math.round(allTasks.reduce((s, t) => s + (t.progress ?? 0), 0) / allTasks.length)
            : 0
    };

    // subtask stats
    const subTaskStats = {
        total: allSubTasks.length,
        done: allSubTasks.filter(s => s.status === "done").length,
        in_progress: allSubTasks.filter(s => s.status === "in_progress").length,
        todo: allSubTasks.filter(s => s.status === "todo").length,
        overdue: allSubTasks.filter(s =>
            s.dueDate &&
            new Date(s.dueDate) < now &&
            s.status !== "done" &&
            s.status !== "cancelled"
        ).length,
        unassigned: allSubTasks.filter(s => !s.assignedToId).length
    };

    // workitem stats
    const workItemStats = {
        total: allWorkItems.length,
        done: allWorkItems.filter(w => w.status === "done").length,
        in_progress: allWorkItems.filter(w => w.status === "in_progress").length,
        todo: allWorkItems.filter(w => w.status === "todo").length,
        totalEstimatedHours: allWorkItems.reduce((s, w) => s + (w.estimatedHours ?? 0), 0),
        totalActualHours: allWorkItems.reduce((s, w) => s + (w.actualHours ?? 0), 0),
        burnRate: (() => {
            const est = allWorkItems.reduce((s, w) => s + (w.estimatedHours ?? 0), 0);
            const act = allWorkItems.reduce((s, w) => s + (w.actualHours ?? 0), 0);
            return est > 0 ? Math.round((act / est) * 100) : null;
        })()
    };

    // deadline info
    const daysRemaining = project.dueDate
        ? Math.ceil((new Date(project.dueDate) - now) / (1000 * 60 * 60 * 24))
        : null;

    const daysElapsed = project.startDate
        ? Math.ceil((now - new Date(project.startDate)) / (1000 * 60 * 60 * 24))
        : null;

    const timeProgress = (daysElapsed != null && daysRemaining != null)
        ? Math.round((daysElapsed / (daysElapsed + daysRemaining)) * 100)
        : null;

    // velocity (progress per day)
    const velocity = (daysElapsed && daysElapsed > 0 && taskStats.avgProgress > 0)
        ? Math.round((taskStats.avgProgress / daysElapsed) * 10) / 10
        : null;

    // per-employee workload
    const employeeWorkload = {};
    allSubTasks.forEach(s => {
        if (!s.assignedTo) return;
        const key = s.assignedTo.id;
        if (!employeeWorkload[key]) {
            employeeWorkload[key] = {
                id: s.assignedTo.id,
                name: s.assignedTo.name,
                total: 0,
                done: 0,
                overdue: 0,
                inProgress: 0
            };
        }
        employeeWorkload[key].total++;
        if (s.status === "done") employeeWorkload[key].done++;
        if (s.status === "in_progress") employeeWorkload[key].inProgress++;
        if (
            s.dueDate &&
            new Date(s.dueDate) < now &&
            s.status !== "done" &&
            s.status !== "cancelled"
        ) employeeWorkload[key].overdue++;
    });

    // per-team stats
    const teamStats = project.projectDepartments.flatMap(pd =>
        (pd.projectTeams ?? []).map(pt => {
            const tasks = pt.tasks ?? [];
            const subtasks = tasks.flatMap(t => t.subtasks ?? []);
            const workitems = subtasks.flatMap(s => s.workItems ?? []);

            return {
                teamId: pt.team?.id,
                teamName: pt.team?.name,
                departmentName: pd.department?.name,
                leadName: pt.team?.leader?.name ?? "No leader",
                memberCount: pt.team?.teamMembers?.length ?? 0,
                tasks: {
                    total: tasks.length,
                    done: tasks.filter(t => t.status === "done").length,
                    overdue: tasks.filter(t =>
                        t.dueDate && new Date(t.dueDate) < now &&
                        t.status !== "done" && t.status !== "cancelled"
                    ).length,
                    avgProgress: tasks.length
                        ? Math.round(tasks.reduce((s, t) => s + (t.progress ?? 0), 0) / tasks.length)
                        : 0
                },
                subtasks: {
                    total: subtasks.length,
                    done: subtasks.filter(s => s.status === "done").length,
                    unassigned: subtasks.filter(s => !s.assignedToId).length
                },
                hours: {
                    estimated: workitems.reduce((s, w) => s + (w.estimatedHours ?? 0), 0),
                    actual: workitems.reduce((s, w) => s + (w.actualHours ?? 0), 0)
                }
            };
        })
    );

    // blockers
    const blockers = allTasks
        .filter(t => {
            const isOverdue = t.dueDate && new Date(t.dueDate) < now;
            const isUrgent = t.priority === "urgent" || t.priority === "high";
            const isNotDone = t.status !== "done" && t.status !== "cancelled";
            return isNotDone && (isOverdue || isUrgent);
        })
        .map(t => ({
            title: t.title,
            priority: t.priority,
            status: t.status,
            dueDate: t.dueDate,
            daysOverdue: t.dueDate
                ? Math.ceil((now - new Date(t.dueDate)) / (1000 * 60 * 60 * 24))
                : null
        }))
        .sort((a, b) => (b.daysOverdue ?? 0) - (a.daysOverdue ?? 0))
        .slice(0, 10);

    return {
        project: {
            id: project.id,
            name: project.name,
            description: project.description,
            status: project.status,
            startDate: project.startDate,
            dueDate: project.dueDate,
            daysRemaining,
            daysElapsed,
            timeProgress,
            velocity
        },
        taskStats,
        subTaskStats,
        workItemStats,
        teamStats,
        employeeWorkload: Object.values(employeeWorkload),
        blockers,
        departmentCount: project.projectDepartments.length,
        teamCount: project.projectDepartments.flatMap(pd => pd.projectTeams).length
    };
};