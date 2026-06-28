import prisma from "../DB/db.config.js";
import slugify from "slugify";
import crypto from "crypto";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

// ========= OWNER ONLY =========

export const createWorkSpace = async (req, res) => {
  try {
    let { name, workRole, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: "Workspace name and description are required" });
    }

    name = name.trim();
    if (name.length < 3) {
      return res.status(400).json({ message: "Workspace name must be at least 3 characters" });
    }

    let logo = null;
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, "workspace-logos");
      logo = uploaded.secure_url;
    }

    const slug = slugify(name, { lower: true, strict: true });

    const workspace = await prisma.$transaction(async (tx) => {
      const existing = await tx.workspace.findUnique({ where: { slug } });
      if (existing) throw new Error("WORKSPACE_ALREADY_EXISTS");

      const newWs = await tx.workspace.create({
        data: {
          name,
          slug,
          logo,
          ownerId: req.user.userId,
          description,
        },
      });

      await tx.workspaceMember.create({
        data: {
          userId: req.user.userId,
          workspaceId: newWs.id,
          sys_role: "owner",
          work_role: workRole || "Owner",
        },
      });

      return newWs;
    });

    return res.status(201).json({ message: "Workspace created", data: workspace });
  } catch (err) {
    if (err.message === "WORKSPACE_ALREADY_EXISTS") {
      return res.status(409).json({ message: "Workspace with this name already exists" });
    }
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    let { name, description } = req.body;
    const userId = req.user.userId;

    const workspace = await prisma.workspace.findUnique({ where: { id: workspaceId } });
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });
    if (workspace.ownerId !== userId) {
      return res.status(403).json({ message: "Only the owner can update the workspace" });
    }

    const updateData = {};
    if (name) {
      name = name.trim();
      if (name.length < 3) return res.status(400).json({ message: "Name too short" });
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true, strict: true });
    }
    if (description) updateData.description = description.trim();

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, "workspace-logos");
      updateData.logo = uploaded.secure_url;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const updated = await prisma.workspace.update({
      where: { id: workspaceId },
      data: updateData,
    });

    return res.status(200).json({ message: "Workspace updated", data: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.userId;

    const workspace = await prisma.workspace.findUnique({ where: { id: workspaceId } });
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });
    if (workspace.ownerId !== userId) {
      return res.status(403).json({ message: "Only the owner can delete the workspace" });
    }

    await prisma.workspace.delete({ where: { id: workspaceId } });
    return res.status(200).json({ message: "Workspace deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const inviteUser = async (req, res) => {
  try {
    const { email, workspaceId, sys_role, work_role } = req.body;
    const invitedBy = req.user.userId;
    const token = crypto.randomBytes(32).toString("hex");

    if (!email || !workspaceId || !sys_role) {
      return res.status(400).json({ message: "Email, workspaceId, and sys_role are required" });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { workspaceMembers: { where: { userId: invitedBy } } },
    });

    if (!workspace) return res.status(404).json({ message: "Workspace not found" });
    if (workspace.workspaceMembers.length === 0) {
      return res.status(403).json({ message: "You are not a member of this workspace" });
    }

    const inviter = workspace.workspaceMembers[0];
    if (inviter.sys_role !== "owner") {
      return res.status(403).json({ message: "Only the owner can invite users" });
    }

    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (user) {
      const existing = await prisma.workspaceMember.findFirst({
        where: { workspaceId, userId: user.id },
      });
      if (existing) return res.status(409).json({ message: "User is already a member" });
    }

    const alreadyInvited = await prisma.workspaceInvite.findFirst({
      where: { workspaceId, email, status: "pending" },
    });
    if (alreadyInvited) return res.status(409).json({ message: "User already invited" });

    const invite = await prisma.workspaceInvite.create({
      data: {
        workspaceId,
        email,
        sys_role,
        work_role: work_role || "Member",
        token,
        invitedBy,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return res.status(200).json({ message: "Invite sent", data: invite });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const acceptInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true },
    });

    const invite = await prisma.workspaceInvite.findUnique({ where: { token } });
    if (!invite) return res.status(404).json({ message: "Invite not found" });
    if (invite.email !== currentUser.email) {
      return res.status(403).json({ message: "This invite does not belong to you" });
    }
    if (invite.status !== "pending") return res.status(400).json({ message: "Invite is no longer pending" });
    if (invite.expiresAt < new Date()) {
      await prisma.workspaceInvite.update({ where: { token }, data: { status: "expired" } });
      return res.status(410).json({ message: "Invite has expired" });
    }

    const existingMember = await prisma.workspaceMember.findFirst({
      where: { workspaceId: invite.workspaceId, userId: currentUser.id },
    });
    if (existingMember) return res.status(409).json({ message: "Already a member" });

    await prisma.$transaction(async (tx) => {
      await tx.workspaceMember.create({
        data: {
          sys_role: invite.sys_role,
          work_role: invite.work_role,
          userId: currentUser.id,
          workspaceId: invite.workspaceId,
        },
      });
      await tx.workspaceInvite.update({ where: { token }, data: { status: "accepted" } });
    });

    return res.status(200).json({ message: "Invite accepted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const rejectInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true },
    });

    const invite = await prisma.workspaceInvite.findUnique({ where: { token } });
    if (!invite) return res.status(404).json({ message: "Invite not found" });
    if (invite.email !== currentUser.email) {
      return res.status(403).json({ message: "This invite does not belong to you" });
    }
    if (invite.status !== "pending") return res.status(400).json({ message: "Invite is no longer pending" });
    if (invite.expiresAt < new Date()) {
      await prisma.workspaceInvite.update({ where: { token }, data: { status: "expired" } });
      return res.status(410).json({ message: "Invite has expired" });
    }

    await prisma.workspaceInvite.update({ where: { token }, data: { status: "rejected" } });
    return res.status(200).json({ message: "Invite rejected" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { workspaceId, userId } = req.params;
    const currentUserId = req.user.userId;

    const currentUser = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: currentUserId } },
    });
    if (!currentUser) return res.status(403).json({ message: "Not a member" });
    if (currentUser.sys_role !== "owner") return res.status(403).json({ message: "Only owner can remove members" });
    if (currentUserId === userId) return res.status(400).json({ message: "Cannot remove yourself" });

    const target = await prisma.workspaceMember.findFirst({ where: { userId, workspaceId } });
    if (!target) return res.status(404).json({ message: "Target user not found" });
    if (target.sys_role === "owner") return res.status(403).json({ message: "Cannot remove the owner" });

    await prisma.workspaceMember.delete({
      where: { workspaceId_userId: { workspaceId, userId } },
    });

    return res.status(200).json({ message: "Member removed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const changeRole = async (req, res) => {
  try {
    const { workspaceId, userId } = req.params;
    const { sys_role } = req.body;
    const currentUserId = req.user.userId;

    const allowedRoles = ["manager", "team_lead", "employee"];
    if (!allowedRoles.includes(sys_role)) return res.status(400).json({ message: "Invalid role" });
    if (currentUserId === userId) return res.status(403).json({ message: "Cannot change your own role" });

    const currentUser = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: currentUserId } },
    });
    if (!currentUser) return res.status(403).json({ message: "Not a member" });
    if (currentUser.sys_role !== "owner") return res.status(403).json({ message: "Only owner can change roles" });

    const target = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    });
    if (!target) return res.status(404).json({ message: "Target user not found" });
    if (target.sys_role === "owner") return res.status(403).json({ message: "Cannot change owner's role" });

    const updated = await prisma.workspaceMember.update({
      where: { workspaceId_userId: { workspaceId, userId } },
      data: { sys_role },
    });

    return res.status(200).json({ message: "Role changed", data: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ========= ALL MEMBERS =========

export const getUserWorkSpaces = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await prisma.workspaceMember.count({ where: { userId } });

    const workspaces = await prisma.workspaceMember.findMany({
      where: { userId },
      select: {
        sys_role: true,
        work_role: true,
        joinedAt: true,
        workspace: {
          select: { id: true, name: true, slug: true, logo: true, ownerId: true, createdAt: true },
        },
      },
      orderBy: { joinedAt: "desc" },
      skip,
      take: limit,
    });

    return res.status(200).json({
      message: workspaces.length > 0 ? "Workspaces fetched" : "No workspaces found",
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      data: workspaces,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getWorkspace = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user.userId;

    const workspace = await prisma.workspace.findUnique({
      where: { slug },
      select: {
        id: true, name: true, slug: true, logo: true, ownerId: true, description: true,
        createdAt: true, updatedAt: true,
        workspaceMembers: { where: { userId }, select: { id: true, sys_role: true, work_role: true } },
      },
    });

    if (!workspace) return res.status(404).json({ message: "Workspace not found" });
    if (workspace.workspaceMembers.length === 0) {
      return res.status(403).json({ message: "You do not have access to this workspace" });
    }

    const member = workspace.workspaceMembers[0];
    return res.status(200).json({
      message: "Workspace fetched",
      data: {
        ...workspace,
        memberRole: { sysRole: member.sys_role, workRole: member.work_role },
        workspaceMembers: undefined,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getWorkspaceMembers = async (req, res) => {
  try {
    const userId = req.user.userId;
    const workspaceId = req.params.workspaceId;

    const me = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    });
    if (!me) return res.status(403).json({ message: "Not a member" });

    const where = { workspaceId };
    if (me.sys_role === "owner") {
      where.userId = { not: userId };
    } else if (me.sys_role === "manager") {
      where.userId = { not: userId };
      where.sys_role = { in: ["employee", "team_lead"] };
    } else if (me.sys_role === "team_lead") {
      where.userId = { not: userId };
      where.sys_role = "employee";
    } else {
      return res.status(403).json({ message: "Not authorized" });
    }

    const members = await prisma.workspaceMember.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });

    return res.status(200).json({ message: "Members fetched", data: members });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ========= OWNER DASHBOARD =========

export const ownerDashboard = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.userId;

    const checkUser = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    });
    if (!checkUser) return res.status(403).json({ message: "Not a member" });
    if (checkUser.sys_role !== "owner") return res.status(403).json({ message: "Only owner can access" });

    const totalDepartments = await prisma.department.count({ where: { workspaceId, is_deleted: false } });
    const totalTeams = await prisma.team.count({ where: { department: { workspaceId }, is_deleted: false } });
    const totalProjects = await prisma.project.count({ where: { workspaceId, is_deleted: false } });

    const tasks = await prisma.task.findMany({
      where: {
        is_deleted: false,
        projectTeam: { projectDepartment: { department: { workspaceId } } },
      },
      select: { id: true },
    });
    const taskIds = tasks.map((t) => t.id);

    const subTasks = await prisma.subTask.findMany({
      where: { taskId: { in: taskIds }, is_deleted: false },
      select: { id: true },
    });
    const subTaskIds = subTasks.map((st) => st.id);

    const totalWorkItems = await prisma.workItem.count({
      where: { subTaskId: { in: subTaskIds }, is_deleted: false },
    });
    const done = await prisma.workItem.count({
      where: { subTaskId: { in: subTaskIds }, status: "done", is_deleted: false },
    });
    const inProgress = await prisma.workItem.count({
      where: { subTaskId: { in: subTaskIds }, status: "in_progress", is_deleted: false },
    });
    const inReview = await prisma.workItem.count({
      where: { subTaskId: { in: subTaskIds }, status: "in_review", is_deleted: false },
    });

    const progress = totalWorkItems === 0 ? 0 : Number(((done * 100) / totalWorkItems).toFixed(2));

    const recentProjects = await prisma.project.findMany({
      where: { workspaceId, is_deleted: false },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, status: true, dueDate: true },
    });

    return res.status(200).json({
      message: "Owner dashboard",
      overview: { departments: totalDepartments, teams: totalTeams, projects: totalProjects, tasks: tasks.length, subtasks: subTasks.length, workItems: totalWorkItems },
      progress: { done, inProgress, inReview, overallProgress: progress },
      recentProjects,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
