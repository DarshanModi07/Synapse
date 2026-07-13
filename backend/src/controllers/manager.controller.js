import { getProjectDashboardData } from "../service/projectDashboard.service.js";
import prisma from '../DB/db.config.js';
import { buildTeamPrompt } from "../ai/prompts/team.prompt.js";
import { generateSuggestion } from "../ai/ai.service.js";

export const getMyDepartments = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const userId = req.user.userId;

        if (!workspaceId) {
            return res.status(400).json({ message: "Workspace ID is required" });
        }

        const workspaceMember = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId
                }
            }
        });

        if (!workspaceMember) {
            return res.status(403).json({ message: "You are not a member of this workspace" });
        }

        if (workspaceMember.sys_role !== "manager" && workspaceMember.sys_role !== "owner") {
            return res.status(403).json({ message: "You do not have manager access" });
        }

        const departments = await prisma.department.findMany({
            where: {
                workspaceId,
                managerId: userId,
                is_deleted: false
            },
            include: {
                manager: {
                    select: { id: true, name: true, email: true, avatar: true }
                },
                teams: {
                    where: { is_deleted: false },
                    include: {
                        teamMembers: { select: { id: true } }
                    }
                },
                projects: {
                    select: { id: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        const formattedDepartments = departments.map((department) => {
            const memberCount = department.teams.reduce(
                (count, team) => count + team.teamMembers.length,
                0
            );

            return {
                id: department.id,
                name: department.name,
                createdAt: department.createdAt,
                updatedAt: department.updatedAt,
                manager: department.manager ? {
                    id: department.manager.id,
                    name: department.manager.name,
                    email: department.manager.email,
                    avatar: department.manager.avatar
                } : null,
                statistics: {
                    teams: department.teams.length,
                    projects: department.projects.length,
                    members: memberCount
                }
            };
        });

        return res.status(200).json({
            message: formattedDepartments.length ? "Departments fetched successfully" : "No departments found",
            data: formattedDepartments
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error while fetching departments" });
    }
};

export const getManagerDepartmentDashboard = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const userId = req.user.userId;

        if (!departmentId) {
            return res.status(400).json({ message: "Department ID is required" });
        }

        const department = await prisma.department.findUnique({
            where: { id: departmentId },
            include: {
                manager: {
                    select: { id: true, name: true, email: true, avatar: true }
                },
                workspace: {
                    select: { id: true, name: true, slug: true }
                }
            }
        });

        if (!department || department.is_deleted) {
            return res.status(404).json({ message: "Department not found" });
        }

        const workspaceMember = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId: department.workspaceId,
                    userId
                }
            }
        });

        if (!workspaceMember) {
            return res.status(403).json({ message: "You are not a member of this workspace" });
        }

        if (department.managerId !== userId && workspaceMember.sys_role !== "owner") {
            return res.status(403).json({ message: "You are not the manager of this department" });
        }

        const [teams, projectDepartments, teamMembers] = await Promise.all([
            prisma.team.findMany({
                where: { departmentId, is_deleted: false },
                include: {
                    leader: { select: { id: true, name: true, avatar: true } },
                    _count: { select: { teamMembers: true } }
                },
                orderBy: { createdAt: "asc" }
            }),
            prisma.projectDepartment.findMany({
                where: { departmentId },
                include: {
                    project: { select: { id: true, name: true, status: true, startDate: true, dueDate: true } }
                }
            }),
            prisma.teamMember.findMany({
                where: { team: { departmentId, is_deleted: false } },
                include: {
                    member: { select: { id: true, name: true, email: true, avatar: true } },
                    team: { select: { id: true, name: true } }
                },
                orderBy: { joinedAt: "asc" }
            })
        ]);

        const memberMap = new Map();
        const uniqueMembers = [];

        teamMembers.forEach((member) => {
            if (!memberMap.has(member.member.id)) {
                memberMap.set(member.member.id, true);
                uniqueMembers.push({
                    id: member.member.id,
                    name: member.member.name,
                    email: member.member.email,
                    avatar: member.member.avatar,
                    joinedAt: member.joinedAt,
                    team: { id: member.team.id, name: member.team.name }
                });
            }
        });

        return res.status(200).json({
            message: "Department dashboard fetched successfully",
            data: {
                department: {
                    id: department.id,
                    name: department.name,
                    createdAt: department.createdAt,
                    updatedAt: department.updatedAt,
                    manager: department.manager,
                    workspace: department.workspace
                },
                statistics: {
                    teams: teams.length,
                    members: uniqueMembers.length,
                    projects: projectDepartments.length
                },
                teams: teams.map(team => ({
                    id: team.id,
                    name: team.name,
                    leader: team.leader,
                    members: team._count.teamMembers,
                    createdAt: team.createdAt
                })),
                projects: projectDepartments.map(item => ({
                    id: item.project.id,
                    name: item.project.name,
                    status: item.project.status,
                    startDate: item.project.startDate,
                    dueDate: item.project.dueDate
                })),
                members: uniqueMembers
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error while fetching department dashboard" });
    }
};

const checkManagerPermission = async (userId, departmentId) => {
    if (!departmentId) return { error: "Department ID is required", status: 400 };

    const department = await prisma.department.findUnique({
        where: { id: departmentId },
        include: { workspace: true }
    });

    if (!department || department.is_deleted) {
        return { error: "Department not found", status: 404 };
    }

    if (department.managerId !== userId) {
        const workspaceMember = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId: department.workspaceId,
                    userId
                }
            }
        });

        if (!workspaceMember || workspaceMember.sys_role !== "owner") {
            return { error: "You do not manage this department", status: 403 };
        }
    }

    return { department, error: null };
};

export const createManagerTeam = async (req, res) => {
    try {
        const { departmentId } = req.params;
        let { name, leaderId } = req.body;
        name = name?.trim();
        const userId = req.user.userId;

        if (!name) return res.status(400).json({ message: "Credential Needed" });

        const { department, error, status } = await checkManagerPermission(userId, departmentId);
        if (error) return res.status(status).json({ message: error });

        const findTeam = await prisma.team.findUnique({
            where: { departmentId_name: { departmentId, name } }
        });

        if (findTeam && !findTeam.is_deleted) {
            return res.status(409).json({ message: "This name already exist" });
        }

        if (leaderId) {
            const leader = await prisma.workspaceMember.findUnique({
                where: { workspaceId_userId: { workspaceId: department.workspaceId, userId: leaderId } }
            });
            if (!leader) return res.status(404).json({ message: "Leader not found" });
        }

        const makeTeam = await prisma.team.create({
            data: { name, departmentId, leaderId: leaderId || null }
        });

        return res.status(201).json({ message: "Team Created", data: makeTeam });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server error during create team" });
    }
};

export const updateManagerTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const tempTeam = await prisma.team.findUnique({ where: { id: teamId } });
        if (!tempTeam) return res.status(404).json({ message: 'Team not found' });
        const departmentId = tempTeam.departmentId;
        let { name, leaderId, is_deleted } = req.body;
        const userId = req.user.userId;

        if (!teamId) return res.status(400).json({ message: "Team ID is required" });

        const { department, error, status } = await checkManagerPermission(userId, departmentId);
        if (error) return res.status(status).json({ message: error });

        const team = await prisma.team.findUnique({ where: { id: teamId } });
        if (!team || team.departmentId !== departmentId) return res.status(404).json({ message: "Team not found in this department" });

        if (name) {
            name = name.trim();
            const existingTeam = await prisma.team.findFirst({
                where: { departmentId, name, id: { not: teamId } }
            });
            if (existingTeam) return res.status(409).json({ message: "Team name already exists" });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (typeof is_deleted === "boolean") {
            updateData.is_deleted = is_deleted;
            updateData.deletedAt = is_deleted ? new Date() : null;
        }

        await prisma.$transaction(async (tx) => {
            if (leaderId) {
                const leaderMembership = await tx.workspaceMember.findUnique({
                    where: { workspaceId_userId: { workspaceId: department.workspaceId, userId: leaderId } }
                });

                if (!leaderMembership) throw new Error("LEADER_NOT_FOUND");
                if (leaderMembership.sys_role === "owner") throw new Error("OWNER_CANNOT_BE_TEAM_LEAD");

                await tx.workspaceMember.update({
                    where: { workspaceId_userId: { workspaceId: department.workspaceId, userId: leaderId } },
                    data: { sys_role: "team_lead" }
                });

                const existingTeamMember = await tx.teamMember.findUnique({
                    where: { teamId_memberId: { teamId, memberId: leaderId } }
                });

                if (!existingTeamMember) {
                    await tx.teamMember.create({ data: { teamId, memberId: leaderId } });
                }

                updateData.leaderId = leaderId;
            }

            await tx.team.update({ where: { id: teamId }, data: updateData });
        });

        const updatedTeam = await prisma.team.findUnique({ where: { id: teamId } });
        return res.status(200).json({ message: "Team updated successfully", data: updatedTeam });
    } catch (err) {
        if (err.message === "OWNER_CANNOT_BE_TEAM_LEAD") {
            return res.status(400).json({ message: "Owner cannot be assigned as team leader" });
        }
        console.error(err);
        return res.status(500).json({ message: "Internal server error during team update" });
    }
};

export const deleteManagerTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const tempTeam = await prisma.team.findUnique({ where: { id: teamId } });
        if (!tempTeam) return res.status(404).json({ message: 'Team not found' });
        const departmentId = tempTeam.departmentId;
        const userId = req.user.userId;

        if (!teamId) return res.status(400).json({ message: "Team ID is required" });

        const { department, error, status } = await checkManagerPermission(userId, departmentId);
        if (error) return res.status(status).json({ message: error });

        const team = await prisma.team.findUnique({ where: { id: teamId } });
        if (!team || team.is_deleted || team.departmentId !== departmentId) {
            return res.status(404).json({ message: "Team not found in this department" });
        }

        const memberCount = await prisma.teamMember.count({ where: { teamId } });
        if (memberCount > 0) return res.status(409).json({ message: "Cannot delete team because it contains team members" });

        const deletedTeam = await prisma.team.update({
            where: { id: teamId },
            data: { is_deleted: true, deletedAt: new Date() }
        });

        return res.status(200).json({ message: "Team deleted successfully", data: deletedTeam });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error during team deletion" });
    }
};

export const addManagerTeamMember = async (req, res) => {
    try {
        const { teamId } = req.params;
        const tempTeam = await prisma.team.findUnique({ where: { id: teamId } });
        if (!tempTeam) return res.status(404).json({ message: 'Team not found' });
        const departmentId = tempTeam.departmentId;
        const { memberId } = req.body;
        const userId = req.user.userId;

        if (!teamId || !memberId) return res.status(400).json({ message: "credential needed" });

        const { department, error, status } = await checkManagerPermission(userId, departmentId);
        if (error) return res.status(status).json({ message: error });

        const team = await prisma.team.findUnique({ where: { id: teamId } });
        if (!team || team.is_deleted || team.departmentId !== departmentId) {
            return res.status(404).json({ message: "Team not found in this department" });
        }

        if (userId === memberId) return res.status(400).json({ message: "You cannot add yourself" });

        const existingMember = await prisma.teamMember.findUnique({
            where: { teamId_memberId: { teamId, memberId } }
        });
        if (existingMember) return res.status(409).json({ message: "Member already exists in this team" });

        const checkTargetUser = await prisma.workspaceMember.findUnique({
            where: { workspaceId_userId: { workspaceId: department.workspaceId, userId: memberId } }
        });

        if (!checkTargetUser) return res.status(404).json({ message: "Target Member not found" });

        if (checkTargetUser.sys_role === "manager" || checkTargetUser.sys_role === "owner" || checkTargetUser.sys_role === "team_lead") {
            return res.status(403).json({ message: "Target User can not be TeamLead or Owner or Manager" });
        }

        const addTeamMember = await prisma.teamMember.create({
            data: { teamId, memberId }
        });

        return res.status(201).json({ message: "Team member added successfully", teamMember: addTeamMember });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server error during Adding Team Member" });
    }
};

export const removeManagerTeamMember = async (req, res) => {
    try {
        const { teamId } = req.params;
        const tempTeam = await prisma.team.findUnique({ where: { id: teamId } });
        if (!tempTeam) return res.status(404).json({ message: 'Team not found' });
        const departmentId = tempTeam.departmentId;
        const { memberId } = req.body;
        const userId = req.user.userId;

        if (!teamId || !memberId) return res.status(400).json({ message: "credential needed" });

        const { department, error, status } = await checkManagerPermission(userId, departmentId);
        if (error) return res.status(status).json({ message: error });

        const team = await prisma.team.findUnique({ where: { id: teamId } });
        if (!team || team.is_deleted || team.departmentId !== departmentId) {
            return res.status(404).json({ message: "Team not found in this department" });
        }

        const existingMember = await prisma.teamMember.findUnique({
            where: { teamId_memberId: { teamId, memberId } }
        });

        if (!existingMember) return res.status(404).json({ message: "Member not found in this team" });

        const removedMember = await prisma.teamMember.delete({
            where: { teamId_memberId: { teamId, memberId } }
        });

        return res.status(200).json({ message: "Team member removed successfully", data: removedMember });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error while removing team member" });
    }
};

export const getManagerTeamDashboard = async (req, res) => {
    try {
        const { teamId } = req.params;
        const tempTeam = await prisma.team.findUnique({ where: { id: teamId } });
        if (!tempTeam) return res.status(404).json({ message: 'Team not found' });
        const departmentId = tempTeam.departmentId;
        const userId = req.user.userId;

        const { department, error, status } = await checkManagerPermission(userId, departmentId);
        if (error) return res.status(status).json({ message: error });

        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: {
                leader: { select: { id: true, name: true, email: true, avatar: true } },
                department: { select: { id: true, name: true, workspace: { select: { id: true, name: true, slug: true } } } },
                _count: { select: { teamMembers: true, teamProjects: true } }
            }
        });

        if (!team || team.is_deleted || team.departmentId !== departmentId) {
            return res.status(404).json({ message: "Team not found in this department" });
        }

        const projectTeams = await prisma.projectTeam.findMany({
            where: { teamId },
            include: {
                projectDepartment: {
                    include: {
                        project: {
                            select: { id: true, name: true, status: true, startDate: true, dueDate: true }
                        }
                    }
                },
                tasks: {
                    where: { is_deleted: false },
                    select: { status: true }
                }
            },
            orderBy: { assignedAt: "desc" }
        });

        const members = await prisma.teamMember.findMany({
            where: { teamId },
            include: { member: { select: { id: true, name: true, email: true, avatar: true, createdAt: true } } },
            orderBy: { joinedAt: "desc" },
            take: 10
        });

        const allTasks = projectTeams.flatMap(item => item.tasks);

        const taskStats = allTasks.reduce((acc, task) => {
            if (task.status === "todo") acc.todo++;
            else if (task.status === "in_progress") acc.inProgress++;
            else if (task.status === "in_review") acc.inReview++;
            else if (task.status === "completed") acc.completed++;
            return acc;
        }, { todo: 0, inProgress: 0, inReview: 0, completed: 0 });

        return res.status(200).json({
            message: "Team dashboard fetched successfully",
            data: {
                team: {
                    id: team.id,
                    name: team.name,
                    createdAt: team.createdAt,
                    leader: team.leader,
                    department: team.department
                },
                statistics: {
                    members: team._count.teamMembers,
                    projects: team._count.teamProjects,
                    tasks: { total: allTasks.length, ...taskStats }
                },
                recentProjects: projectTeams.slice(0, 5).map(tp => tp.projectDepartment?.project).filter(Boolean),
                members: members.map(m => m.member)
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getManagerAvailableLeaders = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const userId = req.user.userId;

        const { department, error, status } = await checkManagerPermission(userId, departmentId);
        if (error) return res.status(status).json({ message: error });

        const availableMembers = await prisma.workspaceMember.findMany({
            where: {
                workspaceId: department.workspaceId,
                sys_role: { in: ["employee", "team_lead"] },
                is_active: true
            },
            select: { userId: true, user: { select: { id: true, name: true, email: true, avatar: true } } }
        });

        const formattedLeaders = availableMembers.map(member => ({
            id: member.user.id,
            name: member.user.name,
            email: member.user.email,
            avatar: member.user.avatar
        }));

        return res.status(200).json({
            message: "Available leaders fetched successfully",
            data: formattedLeaders
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error while getting available leaders" });
    }
};

export const getAllManagerTeams = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const userId = req.user.userId;

        const { department, error, status } = await checkManagerPermission(userId, departmentId);
        if (error) return res.status(status).json({ message: error });

        const teams = await prisma.team.findMany({
            where: {
                departmentId,
                is_deleted: false
            },
            include: {
                leader: { select: { id: true, name: true, email: true, avatar: true } },
                department: { select: { id: true, name: true } },
                _count: { select: { teamMembers: true, teamProjects: true } }
            },
            orderBy: { createdAt: "desc" }
        });

        const formattedTeams = teams.map((team) => ({
            id: team.id,
            name: team.name,
            createdAt: team.createdAt,
            leader: team.leader,
            department: team.department,
            members: team._count.teamMembers,
            projects: team._count.teamProjects
        }));

        return res.status(200).json({
            message: formattedTeams.length ? "Teams fetched successfully" : "No teams found",
            data: formattedTeams
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error while fetching teams" });
    }
};

export const getAllMyManagerTeams = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const userId = req.user.userId;

        if (!workspaceId) {
            return res.status(400).json({ message: "Workspace ID is required" });
        }

        const workspaceMember = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId
                }
            }
        });

        if (!workspaceMember || (workspaceMember.sys_role !== "manager" && workspaceMember.sys_role !== "owner")) {
            return res.status(403).json({ message: "You do not have manager access" });
        }

        const teams = await prisma.team.findMany({
            where: {
                department: {
                    workspaceId,
                    managerId: userId,
                    is_deleted: false
                },
                is_deleted: false
            },
            include: {
                leader: { select: { id: true, name: true, email: true, avatar: true } },
                department: { select: { id: true, name: true } },
                _count: { select: { teamMembers: true, teamProjects: true } }
            },
            orderBy: { createdAt: "desc" }
        });

        const formattedTeams = teams.map((team) => ({
            id: team.id,
            name: team.name,
            createdAt: team.createdAt,
            leader: team.leader,
            department: team.department,
            members: team._count.teamMembers,
            projects: team._count.teamProjects
        }));

        return res.status(200).json({
            message: formattedTeams.length ? "Teams fetched successfully" : "No teams found",
            data: formattedTeams
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error while fetching workspace teams" });
    }
};

export const suggestManagerTeams = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const userId = req.user.userId;

        const { department, error, status } = await checkManagerPermission(userId, departmentId);
        if (error) return res.status(status).json({ message: error });

        const existingTeams = await prisma.team.findMany({
            where: {
                departmentId,
                is_deleted: false
            },
            select: { name: true }
        });

        const prompt = buildTeamPrompt({
            workspaceName: department.workspace?.name || "Workspace",
            departmentName: department.name,
            existingTeams: existingTeams.map(team => team.name)
        });

        const response = await generateSuggestion(prompt);

        const cleaned = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
        
        let suggestions;
        try {
            suggestions = JSON.parse(cleaned);
        } catch (e) {
            console.error("Failed to parse AI response:", cleaned);
            return res.status(500).json({ message: "Failed to generate valid suggestions from AI" });
        }

        return res.status(200).json({
            message: "Team suggestions generated successfully",
            data: { teams: suggestions.teams || [] }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error during AI suggestion" });
    }
};


export const managerProjectDashboard = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.userId;
        if (!projectId) {
            return res.status(400).json({ message: "Project ID is required" });
        }
        
        const result = await getProjectDashboardData(projectId, userId, 'manager');
        if (result.status === 200) {
            return res.status(200).json({ message: "Dashboard fetched successfully", data: result.data });
        } else {
            return res.status(result.status).json(result.data || { message: result.message });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllManagerProjects = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const userId = req.user.userId;
        if (!workspaceId) {
            return res.status(400).json({ message: 'Workspace ID is required' });
        }

        const workspaceMember = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId
                }
            }
        });

        if (!workspaceMember || (workspaceMember.sys_role !== 'manager' && workspaceMember.sys_role !== 'owner')) {
            return res.status(403).json({ message: 'You do not have manager access' });
        }

        // Get projects that have at least one department managed by this user
        const projects = await prisma.project.findMany({
            where: {
                workspaceId,
                is_deleted: false,
                projectDepartments: {
                    some: {
                        department: {
                            managerId: userId,
                            is_deleted: false
                        }
                    }
                }
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                },
                projectDepartments: {
                    include: {
                        projectTeams: {
                            include: {
                                tasks: {
                                    where: {
                                        is_deleted: false
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const formattedProjects = projects.map(project => {
            const departments = project.projectDepartments.length;
            const teams = project.projectDepartments.reduce(
                (count, department) => count + department.projectTeams.length,
                0
            );
            const tasks = project.projectDepartments.reduce(
                (count, department) => count + department.projectTeams.reduce(
                    (teamCount, team) => teamCount + team.tasks.length,
                    0
                ),
                0
            );

            return {
                id: project.id,
                name: project.name,
                description: project.description,
                status: project.status,
                startDate: project.startDate,
                dueDate: project.dueDate,
                createdAt: project.createdAt,
                createdBy: project.createdBy,
                departments,
                teams,
                tasks
            };
        });

        return res.status(200).json({
            message: formattedProjects.length ? 'Projects fetched successfully' : 'No projects found',
            data: formattedProjects
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error while fetching projects' });
    }
};

export const generateManagerProjectTasksAI = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.userId;

        // 1. Verify Project
        const project = await prisma.project.findUnique({
            where: { id: projectId, is_deleted: false },
            include: {
                projectDepartments: {
                    include: { department: true }
                },
                projectTeams: {
                    include: { team: true }
                },
                tasks: {
                    where: { is_deleted: false }
                }
            }
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // 2. Verify Manager Ownership
        const managerDepartments = project.projectDepartments.filter(
            pd => pd.department.managerId === userId && !pd.department.is_deleted
        );

        if (managerDepartments.length === 0) {
            return res.status(403).json({ message: 'You do not have permission to manage this project' });
        }

        // 3. Prepare AI Prompt
        const managerTeams = project.projectTeams.filter(
            pt => managerDepartments.some(md => md.departmentId === pt.team.departmentId)
        );

        const prompt = `
You are an expert technical project manager. 
A project named "${project.name}" requires a comprehensive task breakdown.
Project Priority: ${project.priority}
Project Deadline: ${project.dueDate}

We have the following teams available:
${managerTeams.map(pt => pt.team.name).join(', ') || 'No specific teams assigned yet.'}

Current Progress: ${project.tasks.filter(t => t.status === 'completed').length} completed out of ${project.tasks.length} total tasks.

Please generate a structured list of milestones, and for each milestone, generate tasks and subtasks. 
Suggest which team should handle each task. 
Return ONLY valid JSON in the exact following structure:
{
  "milestones": [
    {
      "title": "Milestone Name",
      "tasks": [
        {
          "title": "Task Name",
          "description": "Task Description",
          "priority": "medium",
          "recommendedTeam": "Team Name",
          "subtasks": [
            { "title": "Subtask Name", "priority": "medium" }
          ]
        }
      ]
    }
  ]
}
`;

        // 4. Call AI Service
        const { generateSuggestion } = await import('../ai/ai.service.js');
        const response = await generateSuggestion(prompt);

        const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
        
        let plan;
        try {
            plan = JSON.parse(cleaned);
        } catch (e) {
            console.error('Failed to parse AI response:', cleaned);
            return res.status(500).json({ message: 'Failed to generate a valid plan from AI' });
        }

        return res.status(200).json({
            message: 'AI Task Plan generated successfully',
            data: plan
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error during AI task generation' });
    }
};

export const approveManagerProjectTasks = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { tasks } = req.body;
        const userId = req.user.userId;

        // 1. Verify Project
        const project = await prisma.project.findUnique({
            where: { id: projectId, is_deleted: false },
            include: {
                projectDepartments: {
                    include: { department: true }
                },
                projectTeams: {
                    include: { team: true }
                }
            }
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // 2. Verify Manager Ownership
        const managerDepartments = project.projectDepartments.filter(
            pd => pd.department.managerId === userId && !pd.department.is_deleted
        );

        if (managerDepartments.length === 0) {
            return res.status(403).json({ message: 'You do not have permission to manage this project' });
        }

        // 3. Flatten & Validate assigned teams
        const allowedProjectTeamIds = project.projectTeams
            .filter(pt => managerDepartments.some(md => md.departmentId === pt.team.departmentId))
            .map(pt => pt.id);

        let createdCount = 0;

        // 4. Create tasks and subtasks sequentially to ensure integrity
        for (const t of tasks) {
            if (!t.projectTeamId || !allowedProjectTeamIds.includes(t.projectTeamId)) {
                continue; // Skip tasks not properly assigned to a manager's team
            }

            const newTask = await prisma.task.create({
                data: {
                    title: t.title,
                    description: t.description || null,
                    priority: t.priority || 'medium',
                    dueDate: project.dueDate,
                    projectTeam: { connect: { id: t.projectTeamId } },
                    createdBy: { connect: { id: userId } },
                    status: 'todo'
                }
            });
            createdCount++;

            if (t.subtasks && Array.isArray(t.subtasks)) {
                for (const st of t.subtasks) {
                    await prisma.subTask.create({
                        data: {
                            title: st.title,
                            priority: st.priority || 'medium',
                            dueDate: project.dueDate,
                            task: { connect: { id: newTask.id } },
                            assignedBy: { connect: { id: userId } },
                            status: 'todo'
                        }
                    });
                }
            }
        }

        return res.status(200).json({
            message: 'Tasks created successfully',
            data: { created: createdCount }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error during task approval' });
    }
};
