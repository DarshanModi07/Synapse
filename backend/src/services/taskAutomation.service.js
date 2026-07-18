import prisma from "../DB/db.config.js";
import { createNotification } from "../service/notification.service.js";

export const recalculateSubTaskProgress = async (subTaskId) => {
    try {
        const subTask = await prisma.subTask.findUnique({
            where: { id: subTaskId },
            include: { workItems: { where: { is_deleted: false } } }
        });

        if (!subTask) return;

        const totalWorkItems = subTask.workItems.length;
        let newProgress = 0;
        
        if (totalWorkItems > 0) {
            const completedWorkItems = subTask.workItems.filter(wi => wi.status === "done").length;
            newProgress = Math.round((completedWorkItems / totalWorkItems) * 100);
        }

        let newStatus = subTask.status;

        if (newProgress === 100 && (subTask.status === "todo" || subTask.status === "in_progress")) {
            newStatus = "in_review";
        }

        const updatedSubTask = await prisma.subTask.update({
            where: { id: subTaskId },
            data: {
                progress: newProgress,
                status: newStatus
            }
        });

        if (newStatus === "in_review" && subTask.status !== "in_review") {
            await createNotification({
                userId: updatedSubTask.assignedById,
                type: "workitem_in_review",
                payload: {
                    subTaskId: subTaskId,
                    message: `Subtask "${updatedSubTask.title}" is ready for review.`
                }
            });
        }

        await recalculateTaskProgress(updatedSubTask.taskId);
    } catch (err) {
        console.error("Error in recalculateSubTaskProgress:", err);
    }
};

export const recalculateTaskProgress = async (taskId) => {
    try {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: { subtasks: { where: { is_deleted: false } } }
        });

        if (!task) return;

        const totalSubTasks = task.subtasks.length;
        let newProgress = 0;
        
        if (totalSubTasks > 0) {
            const totalProgress = task.subtasks.reduce((sum, st) => sum + st.progress, 0);
            newProgress = Math.round(totalProgress / totalSubTasks);
        }

        let newStatus = "todo";
        
        if (totalSubTasks > 0) {
            const statuses = task.subtasks.map(st => st.status);
            
            if (statuses.every(s => s === "todo")) {
                newStatus = "todo";
            } else if (statuses.every(s => s === "done")) {
                newStatus = "done";
            } else if (statuses.some(s => s === "in_progress")) {
                newStatus = "in_progress";
            } else if (statuses.some(s => s === "in_review")) {
                newStatus = "in_review";
            } else {
                newStatus = "in_progress";
            }
        }

        await prisma.task.update({
            where: { id: taskId },
            data: {
                progress: newProgress,
                status: newStatus
            }
        });
    } catch (err) {
        console.error("Error in recalculateTaskProgress:", err);
    }
};
