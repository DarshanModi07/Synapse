import prisma from "../DB/db.config.js";

export const getTeamLeadDashboard = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id;

        // 1. Fetch ALL teams where user is leader
        const teams = await prisma.team.findMany({
            where: { leaderId: userId, is_deleted: false },
            include: {
                department: true,
                leader: { select: { name: true } },
                teamMembers: {
                    include: {
                        member: { 
                            select: { 
                                id: true, 
                                name: true, 
                                avatar: true, 
                                email: true,
                                workspaceMembers: {
                                    select: {
                                        work_role: true,
                                        workspaceId: true
                                    }
                                }
                            } 
                        }
                    }
                },
                teamProjects: {
                    include: {
                        projectDepartment: {
                            include: { project: true }
                        }
                    }
                }
            }
        });

        if (!teams || teams.length === 0) {
            return res.status(404).json({ message: "You are not assigned as a Team Lead for any active teams." });
        }

        // Global Aggregations
        const globalProjectsMap = new Map(); // Maps project id to project details with associated team names
        const allTasks = [];
        const formattedTeams = [];
        const groupedMembers = {}; // Maps teamName to array of members
        const teamProjectIds = [];

        // Single pass over teams to extract projects and prepare projectTeamIds for tasks
        teams.forEach(team => {
            const teamProjectsMap = new Map();
            team.teamProjects.forEach(pt => {
                teamProjectIds.push(pt.id); // For fetching tasks later
                const proj = pt.projectDepartment?.project;
                if (proj && !proj.is_deleted) {
                    teamProjectsMap.set(proj.id, proj);
                    if (!globalProjectsMap.has(proj.id)) {
                        globalProjectsMap.set(proj.id, { ...proj, teamName: team.name });
                    }
                }
            });

            const uniqueTeamProjectsCount = teamProjectsMap.size;
            const teamMemberCount = team.teamMembers.length;

            formattedTeams.push({
                id: team.id,
                name: team.name,
                department: team.department.name,
                createdAt: team.createdAt,
                membersCount: teamMemberCount,
                projectsCount: uniqueTeamProjectsCount,
                tasksCount: 0 // Will populate after fetching tasks
            });

            // Group Members
            groupedMembers[team.name] = team.teamMembers.map(tm => ({
                id: tm.member.id,
                name: tm.member.name,
                email: tm.member.email,
                avatar: tm.member.avatar,
                role: tm.member.workspaceMembers?.[0]?.work_role || "employee",
                teamName: team.name,
                memberId: tm.member.id,
                activeTasks: 0 // Will map later
            }));
        });

        const projects = Array.from(globalProjectsMap.values());

        // Fetch tasks assigned to ALL teams
        const tasks = await prisma.task.findMany({
            where: { projectTeamId: { in: teamProjectIds }, is_deleted: false },
            orderBy: { createdAt: 'desc' },
            include: {
                createdBy: { select: { id: true, name: true } },
                projectTeam: { include: { team: { select: { name: true } } } }
            }
        });

        // Members with active task counts
        const subtasks = await prisma.subTask.findMany({
            where: { taskId: { in: tasks.map(t => t.id) }, is_deleted: false },
            select: { assignedToId: true, status: true }
        });

        // Assign task counts per team to formattedTeams
        formattedTeams.forEach(ft => {
            ft.tasksCount = tasks.filter(t => t.projectTeam?.team?.name === ft.name).length;
        });

        // Update grouped members with active subtasks
        Object.keys(groupedMembers).forEach(teamName => {
            groupedMembers[teamName].forEach(member => {
                const memberSubtasks = subtasks.filter(st => st.assignedToId === member.memberId && st.status !== 'done');
                member.activeTasks = memberSubtasks.length;
            });
        });

        // Global Overview stats
        let totalTeamsLed = teams.length;
        let totalMembers = Object.values(groupedMembers).flat().length; // If a user is in multiple teams, they count for each role context, as requested
        let totalProjects = projects.length;
        let totalTasks = tasks.length;
        let completedTasks = tasks.filter(t => t.status === 'done').length;
        let pendingTasks = tasks.filter(t => ['todo', 'in_progress', 'in_review'].includes(t.status)).length;
        let pendingReviews = tasks.filter(t => t.status === 'in_review').length;
        let teamProgress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

        const overview = {
            totalTeamsLed,
            totalMembers,
            totalProjects,
            totalTasks,
            completedTasks,
            pendingTasks,
            teamProgress,
            pendingReviews
        };

        const analytics = {
            todo: tasks.filter(t => t.status === 'todo').length,
            inProgress: tasks.filter(t => t.status === 'in_progress').length,
            inReview: pendingReviews,
            completed: completedTasks
        };

        // Recent tasks across ALL teams
        const recentTasks = tasks.slice(0, 5).map(t => ({
            id: t.id,
            name: t.title,
            teamName: t.projectTeam?.team?.name || "Unknown Team",
            priority: t.priority,
            status: t.status,
            dueDate: t.dueDate,
            assignedBy: t.createdBy?.name || "System",
            progress: t.progress || 0
        }));

        // Deadlines across ALL teams
        const upcomingDeadlines = tasks
            .filter(t => t.dueDate && t.status !== 'done')
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 5)
            .map(t => ({
                id: t.id,
                name: t.title,
                teamName: t.projectTeam?.team?.name || "Unknown Team",
                dueDate: t.dueDate,
                priority: t.priority
            }));

        // Projects Simplified
        const formattedProjects = projects.map(p => ({
            id: p.id,
            name: p.name,
            teamName: p.teamName, // Includes team name for UI mapping
            progress: 0, 
            dueDate: p.dueDate,
            status: p.status || "In Progress"
        }));

        // Activities across ALL teams
        const recentActivity = tasks.slice(0, 5).map(t => ({
            id: `act_${t.id}`,
            description: `${t.createdBy?.name || "System"} assigned task "${t.title}" to ${t.projectTeam?.team?.name || "Team"}`,
            time: t.createdAt
        }));

        return res.status(200).json({
            success: true,
            data: {
                leaderName: teams[0]?.leader?.name || "Leader",
                teams: formattedTeams,
                overview,
                projects: formattedProjects,
                groupedMembers,
                recentTasks,
                upcomingDeadlines,
                analytics,
                recentActivity
            }
        });
    } catch (error) {
        console.error("Error in getTeamLeadDashboard:", error);
        return res.status(500).json({ message: "Internal server error fetching team lead dashboard." });
    }
};

export const getTeamLeadProjects = async (req, res) => res.status(200).json({ data: [] });
export const getTeamLeadMembers = async (req, res) => res.status(200).json({ data: [] });
export const getTeamLeadAnalytics = async (req, res) => res.status(200).json({ data: {} });
