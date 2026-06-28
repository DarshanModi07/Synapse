import prisma from '../DB/db.config.js';

// ========= OWNER =========
export const createDepartment = async (req, res) => {
  try {
    const { name, workspaceId } = req.body;
    const userId = req.user.userId;

    const departmentName = name?.trim();
    if (!departmentName || !workspaceId) {
      return res.status(400).json({ message: "Department name and workspaceId required" });
    }

    const member = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    });
    if (!member) return res.status(403).json({ message: "Not a workspace member" });
    if (member.sys_role !== "owner") return res.status(403).json({ message: "Only owner can create departments" });

    const existing = await prisma.department.findFirst({
      where: { workspaceId, name: departmentName, is_deleted: false },
    });
    if (existing) return res.status(409).json({ message: "Department name already exists" });

    const department = await prisma.department.create({
      data: { name: departmentName, workspaceId },
    });

    return res.status(201).json({ message: "Department created", data: department });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ========= OWNER + MANAGER (of department) =========
export const updateDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    let { name, managerId, is_deleted } = req.body;
    const userId = req.user.userId;

    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });
    if (!department) return res.status(404).json({ message: "Department not found" });

    const member = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: department.workspaceId, userId } },
    });
    if (!member) return res.status(403).json({ message: "Not a workspace member" });

    const isOwner = member.sys_role === "owner";
    const isManager = member.sys_role === "manager" && department.managerId === userId;

    if (!isOwner && !isManager) {
      return res.status(403).json({ message: "Only owner or department manager can update" });
    }

    const updateData = {};
    if (name) updateData.name = name.trim();

    if (managerId && isOwner) {
      const managerMember = await prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId: department.workspaceId, userId: managerId } },
      });
      if (!managerMember) return res.status(404).json({ message: "Manager not found" });
      if (managerMember.sys_role === "employee") return res.status(403).json({ message: "Employee cannot be manager" });
      await prisma.workspaceMember.update({
        where: { workspaceId_userId: { workspaceId: department.workspaceId, userId: managerId } },
        data: { sys_role: "manager" },
      });
      updateData.managerId = managerId;
    }

    if (typeof is_deleted === "boolean") {
      if (!isOwner) return res.status(403).json({ message: "Only owner can delete/restore" });
      updateData.is_deleted = is_deleted;
      updateData.deletedAt = is_deleted ? new Date() : null;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No changes provided" });
    }

    const updated = await prisma.department.update({
      where: { id: departmentId },
      data: updateData,
    });

    return res.status(200).json({ message: "Department updated", data: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ========= OWNER =========
export const deleteDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const userId = req.user.userId;

    const department = await prisma.department.findUnique({ where: { id: departmentId } });
    if (!department) return res.status(404).json({ message: "Department not found" });

    const member = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: department.workspaceId, userId } },
    });
    if (!member) return res.status(403).json({ message: "Not a workspace member" });
    if (member.sys_role !== "owner") return res.status(403).json({ message: "Only owner can delete departments" });

    const teamCount = await prisma.team.count({ where: { departmentId } });
    if (teamCount > 0) return res.status(400).json({ message: "Remove teams first" });

    await prisma.department.delete({ where: { id: departmentId } });
    return res.status(200).json({ message: "Department deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ========= ALL MEMBERS =========
export const getAllDepartments = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.userId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const member = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    });
    if (!member) return res.status(403).json({ message: "Not a workspace member" });

    const total = await prisma.department.count({ where: { workspaceId, is_deleted: false } });

    const departments = await prisma.department.findMany({
      where: { workspaceId, is_deleted: false },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        manager: { select: { id: true, name: true, email: true, avatar: true } },
        _count: { select: { teams: true } },
      },
    });

    return res.status(200).json({
      message: departments.length > 0 ? "Departments fetched" : "No departments found",
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      data: departments,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ========= MANAGER DASHBOARD (OWNER + MANAGER) =========
export const managerDashboard = async (req, res) => {
  try {
    const { projectDepartmentId } = req.params;
    const userId = req.user.userId;

    const pd = await prisma.projectDepartment.findUnique({
      where: { id: projectDepartmentId },
      include: {
        department: { select: { id: true, name: true, workspaceId: true } },
        projectTeams: {
          include: {
            team: { select: { id: true, name: true } },
            tasks: {
              where: { is_deleted: false },
              select: { id: true, title: true, createdAt: true, status: true,
                subtasks: {
                  where: { is_deleted: false },
                  select: { id: true, workItems: { select: { status: true, is_deleted: true } } },
                },
              },
            },
          },
        },
      },
    });

    if (!pd) return res.status(404).json({ message: "Project department not found" });

    const member = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: pd.department.workspaceId, userId } },
    });
    if (!member) return res.status(403).json({ message: "Not a member" });

    const isOwner = member.sys_role === "owner";
    const isManager = member.sys_role === "manager" && pd.department.managerId === userId;

    if (!isOwner && !isManager) return res.status(403).json({ message: "Not authorized" });

    const teams = pd.projectTeams;
    const tasks = teams.flatMap((t) => t.tasks);
    const subTasks = tasks.flatMap((t) => t.subtasks);
    const workItems = subTasks.flatMap((s) => s.workItems).filter((w) => !w.is_deleted);

    const total = workItems.length;
    const done = workItems.filter((w) => w.status === "done").length;
    const inProgress = workItems.filter((w) => w.status === "in_progress").length;
    const inReview = workItems.filter((w) => w.status === "in_review").length;

    const overall = total === 0 ? 0 : Number(((done * 100) / total).toFixed(2));

    const teamProgress = teams.map((pt) => {
      const teamWis = pt.tasks.flatMap((t) => t.subtasks.flatMap((s) => s.workItems)).filter((w) => !w.is_deleted);
      const tDone = teamWis.filter((w) => w.status === "done").length;
      return {
        id: pt.team.id,
        name: pt.team.name,
        progress: teamWis.length === 0 ? 0 : Number(((tDone * 100) / teamWis.length).toFixed(2)),
      };
    });

    return res.status(200).json({
      message: "Manager dashboard",
      department: pd.department,
      overview: { teams: teams.length, tasks: tasks.length, subTasks: subTasks.length, workItems: total },
      progress: { overall, done, inProgress, inReview },
      teams: teamProgress,
      recentTasks: tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
