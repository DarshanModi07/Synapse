import prisma from "../DB/db.config.js";

export const validateProjectAccess = async (projectId, userId) => {

    const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: {
            id: true,
            workspaceId: true,
            is_deleted: true,
            projectDepartments: {
                select: {
                    department: {
                        select: { managerId: true }
                    }
                }
            }
        }
    });

    if (!project || project.is_deleted) {
        return { allowed: false, status: 404, message: "Project not found" };
    }

    const membership = await prisma.workspaceMember.findUnique({
        where: {
            workspaceId_userId: {
                workspaceId: project.workspaceId,
                userId
            }
        }
    });

    if (!membership) {
        return { allowed: false, status: 403, message: "You are not a member of this workspace" };
    }

    if (membership.sys_role === "owner") {
        return { allowed: true, role: "owner", membership };
    }

    if (membership.sys_role === "manager") {
        const isManagerOfProjectDept = project.projectDepartments.some(
            pd => pd.department.managerId === userId
        );

        if (!isManagerOfProjectDept) {
            return { allowed: false, status: 403, message: "Your department is not part of this project" };
        }

        return { allowed: true, role: "manager", membership };
    }

    // team_lead and employee cannot access predictions
    return { allowed: false, status: 403, message: "You are not allowed to access project analytics" };
};