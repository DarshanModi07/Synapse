import prisma from "../DB/db.config.js";

class TeamLeadMemberService {
    
    /**
     * Get all members across all teams led by the team lead.
     */
    async getAllTeamLeadMembers(leaderId) {
        // 1. Fetch all teams led by the user
        const teams = await prisma.team.findMany({
            where: { leaderId, is_deleted: false },
            include: {
                department: true,
                teamMembers: {
                    include: {
                        member: {
                            include: {
                                workspaceMembers: {
                                    select: { work_role: true }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!teams || teams.length === 0) {
            return { members: [], analytics: this._emptyAnalytics(), groupedTeams: [] };
        }

        // 2. Map users and deduplicate
        const userMap = new Map();
        
        teams.forEach(team => {
            team.teamMembers.forEach(tm => {
                const user = tm.member;
                if (!userMap.has(user.id)) {
                    userMap.set(user.id, {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        avatar: user.avatar,
                        isActive: user.isActive,
                        role: user.workspaceMembers?.[0]?.work_role || 'employee',
                        departments: new Set([team.department.name]),
                        teams: new Set([team.name]),
                        isTeamLead: false, // Will calculate if they lead any team
                    });
                } else {
                    const existing = userMap.get(user.id);
                    existing.departments.add(team.department.name);
                    existing.teams.add(team.name);
                }
            });
        });

        // 3. Mark if they are a team lead (even if just for styling)
        for (const [userId, user] of userMap.entries()) {
            const leads = await prisma.team.count({
                where: { leaderId: userId, is_deleted: false }
            });
            if (leads > 0) user.isTeamLead = true;
        }

        const membersList = Array.from(userMap.values()).map(u => ({
            ...u,
            departments: Array.from(u.departments),
            teams: Array.from(u.teams)
        }));

        // 4. Fetch tasks assigned to these members for the teams led by the leader
        const teamIds = teams.map(t => t.id);
        
        const projectTeams = await prisma.projectTeam.findMany({
            where: { teamId: { in: teamIds } },
            select: { id: true }
        });
        const projectTeamIds = projectTeams.map(pt => pt.id);

        const tasks = await prisma.task.findMany({
            where: { projectTeamId: { in: projectTeamIds }, is_deleted: false },
            select: { id: true }
        });
        const taskIds = tasks.map(t => t.id);

        const subTasks = await prisma.subTask.findMany({
            where: { 
                taskId: { in: taskIds },
                assignedToId: { in: membersList.map(m => m.id) },
                is_deleted: false
            },
            select: { id: true, assignedToId: true, status: true, progress: true }
        });

        // Calculate member specific stats
        let totalCompletedAll = 0;
        let activeMembersCount = 0;

        const enrichedMembers = membersList.map(member => {
            const memberSubTasks = subTasks.filter(st => st.assignedToId === member.id);
            const totalAssigned = memberSubTasks.length;
            const completed = memberSubTasks.filter(st => st.status === 'done').length;
            const hasActive = memberSubTasks.some(st => st.status !== 'done');
            
            if (hasActive) activeMembersCount++;
            totalCompletedAll += completed;

            const progress = totalAssigned > 0 ? Math.round((completed / totalAssigned) * 100) : 0;

            return {
                ...member,
                assignedTasks: totalAssigned,
                completedTasks: completed,
                progress
            };
        });

        const overallProgress = enrichedMembers.length > 0 
            ? Math.round(enrichedMembers.reduce((acc, m) => acc + m.progress, 0) / enrichedMembers.length)
            : 0;

        const analytics = {
            totalMembers: enrichedMembers.length,
            activeMembers: activeMembersCount,
            completedTasks: totalCompletedAll,
            teamProgress: overallProgress
        };

        // Format teams for the Grouping section
        const groupedTeams = teams.map(t => ({
            id: t.id,
            name: t.name,
            membersCount: t.teamMembers.length
        }));

        return {
            members: enrichedMembers,
            analytics,
            groupedTeams
        };
    }

    _emptyAnalytics() {
        return {
            totalMembers: 0,
            activeMembers: 0,
            completedTasks: 0,
            teamProgress: 0
        };
    }

    /**
     * Get detailed profile for a single member
     */
    async getTeamLeadMemberDetails(leaderId, memberId) {
        // 1. Verify this member belongs to a team led by this leader
        const membership = await prisma.teamMember.findFirst({
            where: {
                memberId: memberId,
                team: { leaderId: leaderId, is_deleted: false }
            },
            include: {
                member: {
                    include: {
                        workspaceMembers: {
                            select: { work_role: true }
                        }
                    }
                },
                team: {
                    include: { department: true }
                }
            }
        });

        if (!membership) {
            throw new Error("Member not found or not under your leadership.");
        }

        const user = membership.member;

        // Find all teams this member is part of that are LED BY THIS LEADER
        const allMemberships = await prisma.teamMember.findMany({
            where: {
                memberId: memberId,
                team: { leaderId: leaderId, is_deleted: false }
            },
            include: {
                team: { include: { department: true } }
            }
        });

        const departments = Array.from(new Set(allMemberships.map(m => m.team.department.name)));
        const teamsList = Array.from(new Set(allMemberships.map(m => m.team.name)));

        const profile = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.workspaceMembers?.[0]?.work_role || 'employee',
            joinedDate: membership.joinedAt,
            departments: departments.join(', '),
            teamName: teamsList.join(', ') // Joined string as per UI reqs
        };

        // Fetch Tasks context
        const teamIds = allMemberships.map(m => m.teamId);
        
        const projectTeams = await prisma.projectTeam.findMany({
            where: { teamId: { in: teamIds } },
            select: { id: true }
        });
        const projectTeamIds = projectTeams.map(pt => pt.id);

        const tasks = await prisma.task.findMany({
            where: { projectTeamId: { in: projectTeamIds }, is_deleted: false },
        });
        const taskIds = tasks.map(t => t.id);

        const subtasks = await prisma.subTask.findMany({
            where: { 
                taskId: { in: taskIds },
                assignedToId: memberId,
                is_deleted: false
            },
            include: {
                task: { select: { title: true, priority: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        const subtaskIds = subtasks.map(st => st.id);

        const workItems = await prisma.workItem.findMany({
            where: { 
                subTaskId: { in: subtaskIds }
            },
            orderBy: { createdAt: 'desc' }
        });

        // 1. Compute Stats
        const totalSubtasks = subtasks.length;
        const completedSubtasks = subtasks.filter(s => s.status === 'done').length;
        const activeSubtasks = subtasks.filter(s => s.status !== 'done').length;
        
        const totalWorkItems = workItems.length;
        const completedWorkItems = workItems.filter(w => w.status === 'done').length;
        const activeWorkItems = workItems.filter(w => w.status !== 'done').length;

        const productivity = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

        const stats = {
            assignedTasks: totalSubtasks, // Mapped to subtasks assigned to them
            completedTasks: completedSubtasks,
            activeTasks: activeSubtasks,
            assignedWorkItems: totalWorkItems,
            completedWorkItems,
            activeWorkItems,
            productivity
        };

        // Timeline (Activity)
        const timeline = [];
        subtasks.forEach(st => {
            timeline.push({
                id: `st_${st.id}_created`,
                action: 'Task Assigned',
                description: `Assigned to "${st.title}"`,
                time: st.createdAt
            });
            if (st.status === 'done' && st.updatedAt) {
                timeline.push({
                    id: `st_${st.id}_done`,
                    action: 'Subtask Completed',
                    description: `Completed "${st.title}"`,
                    time: st.updatedAt
                });
            }
        });

        workItems.forEach(wi => {
            if (wi.status === 'done' && wi.completedAt) {
                timeline.push({
                    id: `wi_${wi.id}_done`,
                    action: 'WorkItem Completed',
                    description: `Completed "${wi.title}"`,
                    time: wi.completedAt
                });
            }
        });

        timeline.sort((a, b) => new Date(b.time) - new Date(a.time));

        // Format tasks & subtasks for tables
        const uniqueTaskIds = new Set(subtasks.map(st => st.taskId));
        const memberTasks = tasks
            .filter(t => uniqueTaskIds.has(t.id))
            .map(t => ({
                id: t.id,
                title: t.title,
                priority: t.priority,
                status: t.status,
                dueDate: t.dueDate,
                progress: t.progress
            }));

        const memberSubtasks = subtasks.map(st => ({
            id: st.id,
            title: st.title,
            status: st.status,
            dueDate: st.dueDate,
            progress: st.progress,
            parentTask: st.task.title
        }));

        const memberWorkItems = workItems.map(wi => ({
            id: wi.id,
            title: wi.title,
            estimatedHours: wi.estimatedHours || 0,
            actualHours: wi.actualHours || 0,
            status: wi.status
        }));

        const analytics = {
            highestProductivity: productivity > 80 ? "Excellent" : productivity > 50 ? "Good" : "Needs Improvement",
            mostDelayed: "N/A"
        };

        return {
            profile,
            stats,
            timeline: timeline.slice(0, 20),
            tasks: memberTasks,
            subtasks: memberSubtasks,
            workItems: memberWorkItems,
            analytics
        };
    }
}

export default new TeamLeadMemberService();
