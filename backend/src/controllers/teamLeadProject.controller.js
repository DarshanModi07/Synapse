import prisma from "../DB/db.config.js";
import { generateSuggestion } from "../ai/ai.service.js";

// ==========================================
// 1. GET ALL PROJECTS (Cross-Team Aggregation)
// ==========================================
export const getTeamLeadProjects = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.userId;
        
        console.log("==================================================");
        console.log("USER ID:", userId);

        const teams = await prisma.team.findMany({
            where: {
                leaderId: userId,
                is_deleted: false
            }
        });

        console.log(
            "TEAMS:",
            teams.map(t => ({
                id: t.id,
                name: t.name
            }))
        );
        console.log("==================================================");

        const teamIds = teams.map(t => t.id);

        if (teamIds.length === 0) {
            console.log("BREAK FOUND: TEAMS table has no records for this user.");
            return res.status(200).json({ success: true, data: [] });
        }

        let totalProjectTeamsCount = 0;
        let totalProjectDepartmentsCount = 0;
        let totalProjectsCount = 0;

        for (const team of teams) {
            const relations = await prisma.projectTeam.findMany({
                where: {
                    teamId: team.id
                }
            });

            console.log(team.name, "PROJECT TEAM RELATIONS:", relations.length);

            if (relations.length === 0) {
                console.log(`BREAK FOUND: ProjectTeam table has no records for ${team.name}.`);
            } else {
                totalProjectTeamsCount += relations.length;
                for (const relation of relations) {
                    const pd = await prisma.projectDepartment.findUnique({
                        where: {
                            id: relation.projectDepartmentId
                        }
                    });

                    if (!pd) {
                        console.log(`BREAK FOUND: ProjectDepartment missing for ProjectTeam ID ${relation.id}`);
                    } else {
                        totalProjectDepartmentsCount += 1;
                        const project = await prisma.project.findUnique({
                            where: {
                                id: pd.projectId
                            }
                        });

                        if (!project) {
                            console.log(`BREAK FOUND: Project missing for ProjectDepartment ID ${pd.id}`);
                        } else {
                            totalProjectsCount += 1;
                        }
                    }
                }
            }
        }
        
        console.log("==================================================");
        console.log({
            teams: teams.length,
            projectTeams: totalProjectTeamsCount,
            projectDepartments: totalProjectDepartmentsCount,
            projects: totalProjectsCount
        });
        console.log("==================================================");

        // Fetching exactly as before to return the payload
        const projectTeams = await prisma.projectTeam.findMany({
            where: {
                teamId: { in: teamIds }
            },
            include: {
                projectDepartment: {
                    include: { project: true }
                },
                tasks: {
                    where: { is_deleted: false },
                    select: { status: true }
                },
                team: {
                    include: { department: true }
                }
            }
        });

        const globalProjectsMap = new Map();

        projectTeams.forEach(pt => {
            const proj = pt.projectDepartment?.project;
            if (proj && !proj.is_deleted) {
                if (!globalProjectsMap.has(proj.id)) {
                    globalProjectsMap.set(proj.id, { 
                        ...proj, 
                        teamName: pt.team.name,
                        departmentName: pt.team.department.name,
                        teamsCount: 0,
                        tasks: [] 
                    });
                }
                
                globalProjectsMap.get(proj.id).tasks.push(...pt.tasks);
                globalProjectsMap.get(proj.id).teamsCount += 1;
            }
        });

        const formattedProjects = Array.from(globalProjectsMap.values()).map(p => {
            const totalTasks = p.tasks.length;
            const completedTasks = p.tasks.filter(t => t.status === 'done').length;
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            return {
                id: p.id,
                name: p.name,
                teamName: p.teamName,
                departmentName: p.departmentName,
                dueDate: p.dueDate || null,
                status: p.status || 'planning',
                totalTasks,
                completedTasks,
                progress,
                managerId: p.createdById,
                teamsAssigned: p.teamsCount
            };
        });

        console.log({
            teamsFound: teams.length,
            totalTasks: formattedProjects.reduce((sum, p) => sum + p.totalTasks, 0),
            totalProjectTeams: projectTeams.length,
            totalProjects: formattedProjects.length
        });

        return res.status(200).json({ success: true, data: formattedProjects });
    } catch (error) {
        console.error("Error in getTeamLeadProjects:", error);
        return res.status(500).json({ message: "Internal server error fetching projects." });
    }
};

// ==========================================
// 2. GET PROJECT DETAILS (Command Center)
// ==========================================
export const getTeamLeadProjectDetails = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.userId || req.user.id;

        // Verify the user leads a team that is assigned to this project
        const userTeams = await prisma.team.findMany({
            where: { leaderId: userId, is_deleted: false },
            select: { id: true, name: true, leader: { select: { name: true } } }
        });
        const teamIds = userTeams.map(t => t.id);

        const projectTeams = await prisma.projectTeam.findMany({
            where: { teamId: { in: teamIds }, projectDepartment: { projectId } },
            include: {
                team: { include: { department: true, teamMembers: { include: { member: { select: { id: true, name: true, avatar: true, email: true } } } } } },
                projectDepartment: { include: { project: { include: { createdBy: { select: { name: true } } } } } },
                tasks: {
                    where: { is_deleted: false },
                    include: {
                        createdBy: { select: { name: true } },
                        subtasks: {
                            where: { is_deleted: false },
                            include: {
                                assignedTo: { select: { name: true, avatar: true } },
                                assignedBy: { select: { name: true } },
                                workItems: { where: { completedAt: null } } // Fetch active work items to derive progress if needed
                            }
                        }
                    }
                }
            }
        });

        if (!projectTeams || projectTeams.length === 0) {
            return res.status(403).json({ message: "Access denied. You do not lead a team assigned to this project." });
        }

        const project = projectTeams[0].projectDepartment.project;
        
        // Aggregate Tasks and Members
        const allTasks = [];
        const allMembersMap = new Map();
        
        projectTeams.forEach(pt => {
            // Push tasks
            pt.tasks.forEach(t => allTasks.push({...t, teamName: pt.team.name}));
            // Push members
            pt.team.teamMembers.forEach(tm => {
                if (!allMembersMap.has(tm.member.id)) {
                    allMembersMap.set(tm.member.id, { ...tm.member, teamName: pt.team.name, activeTasks: 0 });
                }
            });
        });

        // Compute Subtask/WorkItem progresses natively
        // Calculate member active task counts
        allTasks.forEach(task => {
            task.subtasks.forEach(sub => {
                if (sub.assignedToId && sub.status !== 'done' && allMembersMap.has(sub.assignedToId)) {
                    allMembersMap.get(sub.assignedToId).activeTasks += 1;
                }
            });
        });

        const overview = {
            id: project.id,
            name: project.name,
            description: project.description,
            status: project.status,
            dueDate: project.dueDate,
            department: projectTeams[0].team.department.name,
            manager: project.createdBy?.name || "System",
            progress: allTasks.length > 0 ? Math.round((allTasks.filter(t => t.status === 'done').length / allTasks.length) * 100) : 0
        };

        const teamInfo = projectTeams.map(pt => ({
            id: pt.team.id,
            name: pt.team.name,
            leader: pt.team.leader?.name || "Leader",
            members: pt.team.teamMembers.length,
            totalTasks: pt.tasks.length,
            completedTasks: pt.tasks.filter(t => t.status === 'done').length
        }));

        // Analytics
        const analytics = {
            todo: allTasks.filter(t => t.status === 'todo').length,
            inProgress: allTasks.filter(t => t.status === 'in_progress').length,
            inReview: allTasks.filter(t => t.status === 'in_review').length,
            completed: allTasks.filter(t => t.status === 'done').length
        };

        return res.status(200).json({
            success: true,
            data: {
                overview,
                teamInfo,
                tasks: allTasks,
                members: Array.from(allMembersMap.values()),
                analytics
            }
        });

    } catch (error) {
        console.error("Error in getTeamLeadProjectDetails:", error);
        return res.status(500).json({ message: "Internal server error fetching project details." });
    }
};

// ==========================================
// 3. SUBTASK CRUD
// ==========================================
export const createSubTask = async (req, res) => {
    try {
        console.log("================================");
        console.log("TASK ID:", req.params.taskId);
        console.log("USER:", req.user?.id || req.user?.userId);
        console.log("BODY:", req.body);
        
        const { taskId } = req.params;
        const { title, description, priority, assignedToId, dueDate } = req.body;
        const userId = req.user?.id || req.user?.userId;

        const task = await prisma.task.findUnique({
            where: {
                id: taskId
            }
        });

        console.log("TASK:", task);

        try {
            const subTask = await prisma.subTask.create({
                data: {
                    title,
                    description,
                    priority,
                    taskId,
                    assignedToId: assignedToId ? assignedToId : null,
                    assignedById: userId,
                    dueDate: dueDate ? new Date(dueDate) : null
                }
            });
            console.log("SUBTASK CREATED:", subTask);
            console.log("================================");
            return res.status(201).json({ success: true, data: subTask });
        } catch (error) {
            console.log("PRISMA ERROR:", error.message);
            console.dir(error, { depth: null });
            throw error;
        }
    } catch (error) {
        console.log("OUTER ERROR:", error.message);
        return res.status(500).json({ message: "Error creating subtask." });
    }
};

export const updateSubTask = async (req, res) => {
    try {
        const { subTaskId } = req.params;
        const updates = req.body;
        
        if (updates.dueDate) updates.dueDate = new Date(updates.dueDate);

        const subTask = await prisma.subTask.update({
            where: { id: subTaskId },
            data: updates
        });
        return res.status(200).json({ success: true, data: subTask });
    } catch (error) {
        return res.status(500).json({ message: "Error updating subtask." });
    }
};

// ==========================================
// 4. WORK ITEM CRUD
// ==========================================
export const createWorkItem = async (req, res) => {
    try {
        const { subTaskId } = req.params;
        const { title, description, estimatedHours } = req.body;

        const workItem = await prisma.workItem.create({
            data: {
                title,
                description,
                subTaskId,
                estimatedHours: estimatedHours ? parseInt(estimatedHours) : null
            }
        });
        return res.status(201).json({ success: true, data: workItem });
    } catch (error) {
        return res.status(500).json({ message: "Error creating work item." });
    }
};

export const updateWorkItem = async (req, res) => {
    try {
        const { workItemId } = req.params;
        const updates = req.body;

        if (updates.status === 'done' && !updates.completedAt) {
            updates.completedAt = new Date();
        }

        const workItem = await prisma.workItem.update({
            where: { id: workItemId },
            data: updates
        });
        return res.status(200).json({ success: true, data: workItem });
    } catch (error) {
        return res.status(500).json({ message: "Error updating work item." });
    }
};

// ==========================================
// 5. AI GENERATION
// ==========================================
export const generateSubTasksAI = async (req, res) => {
    try {
        const { taskId } = req.params;
        
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: { projectTeam: { include: { team: { include: { teamMembers: { include: { member: true } } } } } } }
        });

        if (!task) return res.status(404).json({ message: "Task not found." });

        const prompt = `
        You are an expert Project Manager. Break down the following task into actionable subtasks.
        Task Title: ${task.title}
        Task Description: ${task.description || "N/A"}
        Team Name: ${task.projectTeam?.team?.name || "N/A"}
        Team Size: ${task.projectTeam?.team?.teamMembers?.length || 0}
        
        Respond with a JSON object containing an array "subtasks". Each subtask must have:
        - title (string)
        - description (string)
        - priority (low, medium, high)
        - estimatedHours (integer)
        - reason (string)
        `;

        const aiRaw = await generateSuggestion(prompt);
        const cleaned = typeof aiRaw === 'string' ? aiRaw.replace(/```json/g, '').replace(/```/g, '').trim() : JSON.stringify(aiRaw);
        const plan = JSON.parse(cleaned);

        return res.status(200).json({ success: true, data: plan });
    } catch (error) {
        console.error("AI SubTask Error:", error);
        return res.status(500).json({ message: "Failed to generate AI Subtasks." });
    }
};

export const generateWorkItemsAI = async (req, res) => {
    try {
        const { subTaskId } = req.params;
        const subTask = await prisma.subTask.findUnique({ where: { id: subTaskId } });

        const prompt = `
        Break down the following subtask into tiny executable work items.
        SubTask: ${subTask.title}
        Description: ${subTask.description || "N/A"}
        
        Respond with a JSON object containing an array "workItems". Each work item must have:
        - title (string)
        - description (string)
        - estimatedHours (integer)
        `;

        const aiRaw = await generateSuggestion(prompt);
        const cleaned = typeof aiRaw === 'string' ? aiRaw.replace(/```json/g, '').replace(/```/g, '').trim() : JSON.stringify(aiRaw);
        const plan = JSON.parse(cleaned);

        return res.status(200).json({ success: true, data: plan });
    } catch (error) {
        console.error("AI WorkItem Error:", error);
        return res.status(500).json({ message: "Failed to generate AI Work Items." });
    }
};
