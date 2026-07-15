import prisma from "../DB/db.config.js";
import { generateAnalysis } from "../ai/ai.service.js";
import { buildManagerAnalyticsPrompt } from "../ai/prompts/managerAnalytics.prompt.js";

export const getManagerAnalytics = async (req, res) => {
    try {
        console.log("Analytics endpoint hit");
        console.log(req.originalUrl);
        console.log(req.method);
        
        const userId = req.user.userId;

        // 1. Fetch managed departments
        const managedDepartments = await prisma.department.findMany({
            where: { managerId: userId, is_deleted: false },
            select: { id: true, name: true, createdAt: true }
        });

        const departmentIds = managedDepartments.map(d => d.id);

        if (departmentIds.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    departmentCount: 0,
                    teamCount: 0,
                    memberCount: 0,
                    projectCount: 0,
                    taskCount: 0,
                    completedTasks: 0,
                    pendingTasks: 0,
                    completionRate: 0,
                    departments: [],
                    teams: [],
                    projects: [],
                    tasks: [],
                    aiInsights: {
                        overloadedTeams: [],
                        underutilizedTeams: [],
                        delayedProjects: [],
                        topEmployees: [],
                        suggestedAssignments: [],
                        riskAnalysis: [],
                        departmentHealthScore: 100
                    }
                }
            });
        }

        // 2. Fetch Teams in those departments
        const teams = await prisma.team.findMany({
            where: { departmentId: { in: departmentIds }, is_deleted: false },
            select: { id: true, name: true, departmentId: true }
        });
        const teamIds = teams.map(t => t.id);

        // 3. Fetch Projects assigned to those departments (if applicable) or teams
        const projectTeams = await prisma.projectTeam.findMany({
            where: { teamId: { in: teamIds } },
            include: { projectDepartment: { include: { project: true } } }
        });
        
        // 4. Extract unique projects
        const projectsMap = new Map();
        projectTeams.forEach(pt => {
            const project = pt.projectDepartment?.project;
            if (project && !project.is_deleted) {
                projectsMap.set(project.id, project);
            }
        });
        const projects = Array.from(projectsMap.values());
        
        // 5. Fetch Tasks assigned to those teams
        const tasks = await prisma.task.findMany({
            where: { projectTeamId: { in: projectTeams.map(pt => pt.id) }, is_deleted: false },
            include: { subtasks: { where: { is_deleted: false } } }
        });

        // 6. Member Count
        const teamMembers = await prisma.teamMember.findMany({
            where: { teamId: { in: teamIds } }
        });
        const memberIds = new Set(teamMembers.map(tm => tm.memberId));

        // Calculate stats
        let totalSubtasks = 0;
        let completedSubtasks = 0;
        
        tasks.forEach(t => {
            t.subtasks.forEach(st => {
                totalSubtasks++;
                if (st.status === 'done') completedSubtasks++;
            });
        });

        const completionRate = totalSubtasks === 0 ? 0 : Math.round((completedSubtasks / totalSubtasks) * 100);

        // Build data payload for AI
        const dataPayload = {
            departments: managedDepartments,
            teams,
            projects: projects.map(p => ({ id: p.id, name: p.name, status: p.status, dueDate: p.dueDate })),
            tasks: tasks.map(t => ({ id: t.id, name: t.title, status: t.status, subtaskCount: t.subtasks.length }))
        };

        const aiResultRaw = await generateAnalysis(buildManagerAnalyticsPrompt(dataPayload));
        
        console.log("AI RESULT:", aiResultRaw);
        console.log("TYPE:", typeof aiResultRaw);
        console.log("IS ARRAY:", Array.isArray(aiResultRaw));

        let aiInsights = {
            overloadedTeams: [],
            underutilizedTeams: [],
            delayedProjects: [],
            topEmployees: [],
            suggestedAssignments: [],
            riskAnalysis: [],
            departmentHealthScore: 80
        };

        try {
            if (aiResultRaw && typeof aiResultRaw === 'object') {
                aiInsights = { ...aiInsights, ...aiResultRaw };
            }
        } catch (e) {
            console.error("AI parse error", e);
        }

        return res.status(200).json({
            success: true,
            data: {
                departmentCount: managedDepartments.length,
                teamCount: teams.length,
                memberCount: memberIds.size,
                projectCount: projects.length,
                taskCount: tasks.length,
                completedTasks: completedSubtasks,
                pendingTasks: totalSubtasks - completedSubtasks,
                completionRate,
                departments: managedDepartments,
                teams,
                projects,
                tasks,
                aiInsights
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error generating manager analytics" });
    }
};
