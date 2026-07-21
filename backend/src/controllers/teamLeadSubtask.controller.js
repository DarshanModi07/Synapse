import prisma from "../DB/db.config.js";

export const getTeamLeadSubtasks = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id;

        // Fetch all subtasks assigned to this user
        const subtasks = await prisma.subTask.findMany({
            where: {
                assignedToId: userId,
                is_deleted: false,
            },
            include: {
                task: {
                    include: {
                        projectTeam: {
                            include: {
                                projectDepartment: {
                                    include: {
                                        project: true,
                                    }
                                }
                            }
                        }
                    }
                },
                assignedBy: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    }
                },
                workItems: {
                    where: { is_deleted: false }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const now = new Date();
        let inProgress = 0;
        let underReview = 0;
        let completed = 0;
        let overdue = 0;

        const formattedSubtasks = subtasks.map(subtask => {
            if (subtask.status === "in_progress") {
                inProgress++;
            }
            if (subtask.status === "in_review") {
                underReview++;
            }
            if (subtask.status === "done") {
                completed++;
            }
            if (subtask.dueDate && new Date(subtask.dueDate) < now && subtask.status !== "done") {
                overdue++;
            }

            return {
                id: subtask.id,
                title: subtask.title,
                description: subtask.description,
                status: subtask.status,
                priority: subtask.priority,
                progress: subtask.progress,
                dueDate: subtask.dueDate,
                createdAt: subtask.createdAt,
                project: subtask.task?.projectTeam?.projectDepartment?.project || null,
                task: subtask.task || null,
                assignedBy: subtask.assignedBy,
                workItems: subtask.workItems,
                workItemsCount: subtask.workItems.length,
                completedWorkItemsCount: subtask.workItems.filter(wi => wi.status === "done").length,
            };
        });

        return res.status(200).json({
            total: formattedSubtasks.length,
            inProgress,
            underReview,
            completed,
            overdue,
            subtasks: formattedSubtasks,
        });

    } catch (err) {
        console.error("getTeamLeadSubtasks Error:", err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
