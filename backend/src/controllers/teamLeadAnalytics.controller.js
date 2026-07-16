import prisma from "../DB/db.config.js";
import { generateAnalysis } from "../ai/ai.service.js";
import { buildTeamLeadAnalyticsPrompt } from "../ai/prompts/teamLeadAnalytics.prompt.js";

export const getTeamLeadAnalytics = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id;

        // Fetch all teams led by this user
        const teams = await prisma.team.findMany({
            where: { leaderId: userId, is_deleted: false },
            include: {
                teamMembers: {
                    include: {
                        member: { select: { id: true, name: true } }
                    }
                },
                teamProjects: {
                    include: {
                        projectDepartment: {
                            include: { project: { select: { id: true, status: true, is_deleted: false } } }
                        }
                    }
                }
            }
        });

        if (!teams || teams.length === 0) {
            return res.status(200).json({ success: true, data: null });
        }

        const teamIds = teams.map(t => t.id);

        const projectTeams = await prisma.projectTeam.findMany({
            where: { teamId: { in: teamIds } }
        });
        const projectTeamIds = projectTeams.map(pt => pt.id);

        // Tasks assigned to these teams
        const tasks = await prisma.task.findMany({
            where: { projectTeamId: { in: projectTeamIds }, is_deleted: false },
            include: {
                projectTeam: { include: { team: { select: { name: true } } } }
            }
        });
        const taskIds = tasks.map(t => t.id);

        // SubTasks and WorkItems
        const subtasks = await prisma.subTask.findMany({
            where: { taskId: { in: taskIds }, is_deleted: false },
            include: {
                task: { select: { title: true, projectTeam: { include: { team: { select: { name: true } } } } } }
            }
        });
        const subtaskIds = subtasks.map(st => st.id);

        const workItems = await prisma.workItem.findMany({
            where: { subTaskId: { in: subtaskIds } }
        });

        // 1. Overview Metrics
        const totalTeams = teams.length;
        const totalMembers = new Set(teams.flatMap(t => t.teamMembers.map(tm => tm.memberId))).size;
        
        const activeProjectsSet = new Set();
        teams.forEach(t => {
            t.teamProjects.forEach(tp => {
                if (tp.projectDepartment?.project?.status !== 'completed' && tp.projectDepartment?.project?.status !== 'cancelled') {
                    activeProjectsSet.add(tp.projectDepartment.project.id);
                }
            });
        });
        const activeProjects = activeProjectsSet.size;

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'done').length;

        // Calculate Average Team Progress
        let totalTeamProgress = 0;
        
        // Build Team Performance Table
        const teamPerformance = teams.map(t => {
            const memberCount = t.teamMembers.length;
            const projectCount = t.teamProjects.length;
            const teamTasks = tasks.filter(task => task.projectTeam?.team?.name === t.name);
            const tTasksCount = teamTasks.length;
            const tCompletedTasks = teamTasks.filter(task => task.status === 'done').length;
            
            const completionPercent = tTasksCount > 0 ? Math.round((tCompletedTasks / tTasksCount) * 100) : 0;
            totalTeamProgress += completionPercent;

            const overdue = teamTasks.filter(task => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done').length;
            let status = 'Healthy';
            if (completionPercent >= 80) status = 'Excellent';
            else if (overdue > 3) status = 'Warning';
            else if (completionPercent < 50 && tTasksCount > 0) status = 'Warning';

            return {
                id: t.id,
                name: t.name,
                members: memberCount,
                projects: projectCount,
                tasks: tTasksCount,
                completionPercent,
                status,
                overdue
            };
        });

        const averageTeamProgress = totalTeams > 0 ? Math.round(totalTeamProgress / totalTeams) : 0;

        // 2. Data payload for AI
        const aiDataPayload = {
            totalTeams,
            totalMembers,
            teams: teamPerformance.map(t => ({
                name: t.name,
                members: t.members,
                tasks: t.tasks,
                completionRate: t.completionPercent,
                overdueTasks: t.overdue
            })),
            workItemsCompleted: workItems.filter(wi => wi.status === 'done').length,
            totalWorkItems: workItems.length
        };

        // Fetch AI Insights
        const aiResultRaw = await generateAnalysis(buildTeamLeadAnalyticsPrompt(aiDataPayload));
        
        let aiInsights = {
            overloadedTeams: [],
            underutilizedTeams: [],
            delayedTeams: [],
            topPerformers: [],
            recommendations: [],
            risks: [],
            teamHealthScore: {},
            predictions: []
        };

        try {
            if (typeof aiResultRaw === 'string') {
                const cleaned = aiResultRaw.replace(/```json/g, '').replace(/```/g, '').trim();
                aiInsights = { ...aiInsights, ...JSON.parse(cleaned) };
            } else if (aiResultRaw && typeof aiResultRaw === 'object') {
                aiInsights = { ...aiInsights, ...aiResultRaw };
            }
        } catch (e) {
            console.error("AI parse error in Team Lead Analytics", e);
        }

        // 3. Productivity Analytics Charts
        const taskStatusChart = [
            { name: 'Todo', value: tasks.filter(t => t.status === 'todo').length },
            { name: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length },
            { name: 'In Review', value: tasks.filter(t => t.status === 'in_review').length },
            { name: 'Done', value: completedTasks }
        ];

        const subTaskStatusChart = [
            { name: 'Todo', value: subtasks.filter(t => t.status === 'todo').length },
            { name: 'In Progress', value: subtasks.filter(t => t.status === 'in_progress').length },
            { name: 'Done', value: subtasks.filter(t => t.status === 'done').length }
        ];

        const workItemStatusChart = [
            { name: 'Todo', value: workItems.filter(w => w.status === 'todo').length },
            { name: 'In Progress', value: workItems.filter(w => w.status === 'in_progress').length },
            { name: 'In Review', value: workItems.filter(w => w.status === 'in_review').length },
            { name: 'Done', value: workItems.filter(w => w.status === 'done').length }
        ];

        const teamProductivityChart = teamPerformance.map(t => ({
            name: t.name,
            productivity: t.completionPercent
        }));

        // 4. Top Performers (Member specific)
        const memberStats = {};
        subtasks.forEach(st => {
            if (st.assignedToId) {
                if (!memberStats[st.assignedToId]) memberStats[st.assignedToId] = { completed: 0, total: 0 };
                memberStats[st.assignedToId].total++;
                if (st.status === 'done') memberStats[st.assignedToId].completed++;
            }
        });

        let topMemberId = null;
        let maxCompleted = -1;
        Object.keys(memberStats).forEach(id => {
            if (memberStats[id].completed > maxCompleted) {
                maxCompleted = memberStats[id].completed;
                topMemberId = id;
            }
        });

        let topMemberName = "N/A";
        if (topMemberId) {
            const memberObj = await prisma.user.findUnique({ where: { id: topMemberId }, select: { name: true } });
            if (memberObj) topMemberName = memberObj.name;
        }

        const topTeam = teamPerformance.reduce((prev, current) => (prev.completionPercent > current.completionPercent) ? prev : current, { name: "N/A", completionPercent: 0 });

        const topPerformers = {
            topMember: topMemberName,
            topTeam: topTeam.name,
            highestCompletion: `${topTeam.completionPercent}%`
        };

        // 5. Upcoming Deadlines
        const upcomingDeadlines = tasks
            .filter(t => t.dueDate && t.status !== 'done')
            .map(t => ({
                id: t.id,
                title: t.title,
                team: t.projectTeam?.team?.name || "Unknown",
                dueDate: t.dueDate,
                priority: t.priority
            }))
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 5);

        // 6. Recent Activity
        const recentActivity = tasks
            .filter(t => t.status === 'done' && t.updatedAt)
            .map(t => ({
                id: t.id,
                action: 'Task Completed',
                description: `Completed "${t.title}" for ${t.projectTeam?.team?.name}`,
                time: t.updatedAt
            }))
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .slice(0, 5);


        return res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalTeams,
                    totalMembers,
                    activeProjects,
                    totalTasks,
                    completedTasks,
                    averageTeamProgress
                },
                teamPerformance,
                aiInsights,
                charts: {
                    taskStatus: taskStatusChart,
                    subTaskStatus: subTaskStatusChart,
                    workItemStatus: workItemStatusChart,
                    teamProductivity: teamProductivityChart
                },
                topPerformers,
                upcomingDeadlines,
                recentActivity
            }
        });

    } catch (error) {
        console.error("Error in getTeamLeadAnalytics:", error);
        return res.status(500).json({ message: "Internal server error fetching team lead analytics." });
    }
};
