import prisma from "../DB/db.config.js";
import { validateAddMembers } from "../validations/team.validation.js";
import { notificationService } from "./notification.service.js";
import { getIO } from "../socket/socket.js";

class TeamService {
    async addMembers(teamId, memberIds, userContext) {
        // 1. Validation Layer
        validateAddMembers(teamId, memberIds);

        // 2. Fetch Team & Department Context
        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: { department: true }
        });

        if (!team) {
            throw new Error("TEAM_NOT_FOUND");
        }

        const workspaceId = team.department.workspaceId;

        // 3. RBAC Validation
        const requesterMembership = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId: userContext.userId
                }
            }
        });

        if (!requesterMembership) {
            throw new Error("UNAUTHORIZED");
        }

        const isOwner = requesterMembership.sys_role === "owner";
        const isManager = requesterMembership.sys_role === "manager" && team.department.managerId === userContext.userId;
        const isTeamLead = team.leaderId === userContext.userId;

        if (!isOwner && !isManager && !isTeamLead) {
            throw new Error("UNAUTHORIZED_TO_ADD_MEMBERS");
        }

        // 4. Validate all memberIds belong to the workspace
        const validWorkspaceMembers = await prisma.workspaceMember.findMany({
            where: {
                workspaceId,
                userId: { in: memberIds }
            }
        });

        if (validWorkspaceMembers.length !== memberIds.length) {
            throw new Error("INVALID_WORKSPACE_MEMBER");
        }

        // 5. Check for already existing members in the team
        const existingMembers = await prisma.teamMember.findMany({
            where: {
                teamId,
                memberId: { in: memberIds }
            }
        });

        if (existingMembers.length > 0) {
            throw new Error("MEMBERS_ALREADY_IN_TEAM");
        }

        // 6. Prisma Transaction to add all members
        const addedMembers = await prisma.$transaction(
            memberIds.map(userId => 
                prisma.teamMember.create({
                    data: {
                        teamId,
                        memberId: userId
                    }
                })
            )
        );

        // 7. Fire Notifications & Sockets
        try {
            await notificationService.sendBulkNotification({
                userIds: memberIds,
                type: "added_to_team",
                title: "Added to Team",
                message: `You have been added to Team ${team.name}.`,
                entityType: "Team",
                entityId: teamId,
                actionUrl: `/employee/dashboard` // Safe default for all users
            });

            // Fetch newly added members payload for socket
            const membersData = await prisma.user.findMany({
                where: { id: { in: memberIds } },
                select: { id: true, name: true, email: true, avatar: true }
            });

            const io = getIO();
            io.to(teamId).emit("TEAM_MEMBER_ADDED", {
                teamId,
                members: membersData
            });
        } catch (error) {
            console.error("Failed to emit socket or notification for team member addition:", error);
        }

        return {
            message: "Members added successfully",
            data: {
                addedCount: addedMembers.length
            }
        };
    }

    async removeMember(teamId, memberId, userContext) {
        // 1. Fetch Team & Department Context
        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: { department: true }
        });

        if (!team || team.is_deleted) {
            throw new Error("TEAM_NOT_FOUND");
        }

        const workspaceId = team.department.workspaceId;

        // 2. RBAC Validation for Requester
        const requesterMembership = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId: userContext.userId
                }
            }
        });

        if (!requesterMembership) {
            throw new Error("UNAUTHORIZED");
        }

        const isOwner = requesterMembership.sys_role === "owner";
        const isManager = requesterMembership.sys_role === "manager" && team.department.managerId === userContext.userId;

        if (!isOwner && !isManager) {
            throw new Error("UNAUTHORIZED_TO_REMOVE_MEMBERS");
        }

        // 3. Validate Target User
        const targetMembership = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId: memberId
                }
            },
            include: { user: true }
        });

        if (!targetMembership) {
            throw new Error("TARGET_NOT_FOUND");
        }

        if (targetMembership.sys_role === "owner" || targetMembership.sys_role === "manager") {
            throw new Error("CANNOT_REMOVE_LEADERS");
        }

        // 4. Verify Membership
        const existingMember = await prisma.teamMember.findUnique({
            where: {
                teamId_memberId: {
                    teamId,
                    memberId
                }
            }
        });

        if (!existingMember) {
            throw new Error("MEMBER_NOT_IN_TEAM");
        }

        // 5. Remove Member
        await prisma.teamMember.delete({
            where: {
                teamId_memberId: {
                    teamId,
                    memberId
                }
            }
        });

        // 6. Fire Notifications & Sockets
        try {
            await notificationService.sendNotification({
                userId: memberId,
                workspaceId,
                type: "removed_from_team",
                title: "Removed from Team",
                message: `You have been removed from Team ${team.name}.`,
                entityType: "Team",
                entityId: teamId,
                actionUrl: `/employee/dashboard`
            });

            const io = getIO();
            if (io) {
                io.to(teamId).emit("TEAM_MEMBER_REMOVED", {
                    teamId,
                    userId: memberId,
                    removedBy: userContext.userId
                });
            }
        } catch (error) {
            console.error("Failed to emit socket or notification for team member removal:", error);
        }

        return {
            message: "Team member removed successfully"
        };
    }
}

export const teamService = new TeamService();
