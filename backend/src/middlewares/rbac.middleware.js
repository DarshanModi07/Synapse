import prisma from "../DB/db.config.js";

// Role hierarchy: owner > manager > team_lead > employee
const ROLE_WEIGHT = {
  owner: 4,
  manager: 3,
  team_lead: 2,
  employee: 1,
};

// Check if user is a workspace member
export const requireWorkspaceMember = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user?.userId;

    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace ID required" });
    }

    const membership = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    });

    if (!membership) {
      return res.status(403).json({ message: "You are not a member of this workspace" });
    }

    req.membership = membership;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "RBAC error" });
  }
};

// Check if role meets minimum required
const hasMinRole = (actual, required) => {
  return ROLE_WEIGHT[actual] >= ROLE_WEIGHT[required];
};

// Middleware factory: require minimum role
export const requireRole = (minRole) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      let workspaceId = req.params.workspaceId;

      // Try to resolve workspaceId from other params if not directly provided
      if (!workspaceId) {
        const { departmentId, teamId, projectId, projectDepartmentId, projectTeamId, taskId } = req.params;

        if (departmentId) {
          const dept = await prisma.department.findUnique({ where: { id: departmentId }, select: { workspaceId: true } });
          if (dept) workspaceId = dept.workspaceId;
        } else if (teamId) {
          const team = await prisma.team.findUnique({ where: { id: teamId }, include: { department: { select: { workspaceId: true } } } });
          if (team) workspaceId = team.department?.workspaceId;
        } else if (projectId) {
          const project = await prisma.project.findUnique({ where: { id: projectId }, select: { workspaceId: true } });
          if (project) workspaceId = project.workspaceId;
        } else if (projectDepartmentId) {
          const pd = await prisma.projectDepartment.findUnique({ where: { id: projectDepartmentId }, include: { department: { select: { workspaceId: true } } } });
          if (pd) workspaceId = pd.department?.workspaceId;
        } else if (projectTeamId) {
          const pt = await prisma.projectTeam.findUnique({
            where: { id: projectTeamId },
            include: { projectDepartment: { include: { department: { select: { workspaceId: true } } } } },
          });
          if (pt) workspaceId = pt.projectDepartment?.department?.workspaceId;
        } else if (taskId) {
          const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: { projectTeam: { include: { projectDepartment: { include: { department: { select: { workspaceId: true } } } } } } },
          });
          if (task) workspaceId = task.projectTeam?.projectDepartment?.department?.workspaceId;
        }
      }

      if (!workspaceId) {
        return res.status(400).json({ message: "Cannot resolve workspace for permission check" });
      }

      const membership = await prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId, userId } },
      });

      if (!membership) {
        return res.status(403).json({ message: "You are not a member of this workspace" });
      }

      if (!hasMinRole(membership.sys_role, minRole)) {
        return res.status(403).json({
          message: `Requires ${minRole} role or higher. You are ${membership.sys_role}.`,
        });
      }

      req.workspaceId = workspaceId;
      req.membership = membership;
      next();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "RBAC error" });
    }
  };
};

// Specific role middlewares
export const requireOwner = requireRole("owner");
export const requireManager = requireRole("manager");
export const requireTeamLead = requireRole("team_lead");
export const requireEmployee = requireRole("employee");

// Check if user is manager of a specific department
export const requireDepartmentManager = async (req, res, next) => {
  try {
    const { departmentId } = req.params;
    const userId = req.user?.userId;

    if (!departmentId) {
      return next();
    }

    const department = await prisma.department.findUnique({
      where: { id: departmentId },
      select: { workspaceId: true, managerId: true },
    });

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    const membership = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: department.workspaceId, userId } },
    });

    if (!membership) {
      return res.status(403).json({ message: "Not a workspace member" });
    }

    const isOwner = membership.sys_role === "owner";
    const isManagerOfDept = membership.sys_role === "manager" && department.managerId === userId;

    if (!isOwner && !isManagerOfDept) {
      return res.status(403).json({ message: "You are not the manager of this department" });
    }

    req.department = department;
    req.membership = membership;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "RBAC error" });
  }
};

// Check if user is team lead of a specific team
export const requireTeamLeader = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const userId = req.user?.userId;

    if (!teamId) {
      return next();
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { department: { select: { workspaceId: true } } },
    });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const membership = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: team.department.workspaceId, userId } },
    });

    if (!membership) {
      return res.status(403).json({ message: "Not a workspace member" });
    }

    const isOwner = membership.sys_role === "owner";
    const isManager = membership.sys_role === "manager";
    const isTeamLead = team.leaderId === userId;

    if (!isOwner && !isManager && !isTeamLead) {
      return res.status(403).json({ message: "You are not the lead of this team" });
    }

    req.team = team;
    req.membership = membership;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "RBAC error" });
  }
};

// Check if user is member of a team
export const requireTeamMember = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const userId = req.user?.userId;

    if (!teamId) {
      return next();
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        department: { select: { workspaceId: true } },
        teamMembers: { select: { memberId: true } },
      },
    });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const membership = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: team.department.workspaceId, userId } },
    });

    if (!membership) {
      return res.status(403).json({ message: "Not a workspace member" });
    }

    const isMember = team.teamMembers.some((tm) => tm.memberId === userId);
    const isLeader = team.leaderId === userId;
    const isOwnerOrManager = membership.sys_role === "owner" || membership.sys_role === "manager";

    if (!isMember && !isLeader && !isOwnerOrManager) {
      return res.status(403).json({ message: "You are not a member of this team" });
    }

    req.team = team;
    req.membership = membership;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "RBAC error" });
  }
};

// Check if user can access a project (owner, manager, or team member of assigned team)
export const requireProjectAccess = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user?.userId;

    if (!projectId) {
      return next();
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { workspaceId: true, is_deleted: true },
    });

    if (!project || project.is_deleted) {
      return res.status(404).json({ message: "Project not found" });
    }

    const membership = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: project.workspaceId, userId } },
    });

    if (!membership) {
      return res.status(403).json({ message: "Not a workspace member" });
    }

    if (membership.sys_role === "owner" || membership.sys_role === "manager") {
      req.workspaceId = project.workspaceId;
      req.membership = membership;
      return next();
    }

    // Check if employee/team_lead is part of any team assigned to this project
    const projectTeams = await prisma.projectTeam.findMany({
      where: {
        projectDepartment: { projectId },
      },
      select: { teamId: true },
    });

    const teamIds = projectTeams.map((pt) => pt.teamId);

    const teamMember = await prisma.teamMember.findFirst({
      where: {
        teamId: { in: teamIds },
        memberId: userId,
      },
    });

    if (!teamMember) {
      return res.status(403).json({ message: "You do not have access to this project" });
    }

    req.workspaceId = project.workspaceId;
    req.membership = membership;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "RBAC error" });
  }
};
