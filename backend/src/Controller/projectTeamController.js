import prisma from "../DB/db.config.js"

export const assignTeam = async (req, res) => {
    try {
        const { projectDepartmentId } = req.params;
        const { teamId } = req.body;

        const userId = req.user.userId;

        if (!projectDepartmentId || !teamId) {
            return res.status(400).json({
                message: "Credentials needed"
            });
        }

        const projectDepartment =
            await prisma.projectDepartment.findUnique({
                where: {
                    id: projectDepartmentId
                },
                include: {
                    project: true,
                    department: true
                }
            });

        if (!projectDepartment) {
            return res.status(404).json({
                message: "Project Department not found"
            });
        }

        const checkUser =
            await prisma.workspaceMember.findUnique({
                where: {
                    workspaceId_userId: {
                        workspaceId:
                            projectDepartment.project.workspaceId,
                        userId
                    }
                }
            });

        if (!checkUser) {
            return res.status(403).json({
                message:
                    "You are not a member of this workspace"
            });
        }

        const checkTeam = await prisma.team.findUnique({
            where: {
                id: teamId
            }
        });

        if (!checkTeam || checkTeam.is_deleted) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        if (
            checkTeam.departmentId !==
            projectDepartment.departmentId
        ) {
            return res.status(400).json({
                message:
                    "Team does not belong to this department"
            });
        }

        const existingAssignment =
            await prisma.projectTeam.findFirst({
                where: {
                    projectDepartmentId,
                    teamId
                }
            });

        if (existingAssignment) {
            return res.status(409).json({
                message:
                    "Team already assigned to project department"
            });
        }

        const createProjectTeam =
            await prisma.projectTeam.create({
                data: {
                    projectDepartmentId,
                    teamId,
                    assignedById: userId
                }
            });

        return res.status(201).json({
            message: "Team assigned successfully",
            data: createProjectTeam
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message:
                "Internal server error during assigning team"
        });
    }
};

export const getTeams = async (req, res) => {
    try {
        const { projectDepartmentId } = req.params;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const projectDepartment =
            await prisma.projectDepartment.findUnique({
                where: {
                    id: projectDepartmentId
                },
                include: {
                    project: true
                }
            });

        if (!projectDepartment) {
            return res.status(404).json({
                message: "Project Department not found"
            });
        }

        const checkUser =
            await prisma.workspaceMember.findUnique({
                where: {
                    workspaceId_userId: {
                        workspaceId:
                            projectDepartment.project.workspaceId,
                        userId: req.user.userId
                    }
                }
            });

        if (!checkUser) {
            return res.status(403).json({
                message:
                    "You are not a member of this workspace"
            });
        }

        const totalTeams =
            await prisma.projectTeam.count({
                where: {
                    projectDepartmentId
                }
            });

        const teams =
            await prisma.projectTeam.findMany({
                where: {
                    projectDepartmentId
                },
                include: {
                    team: {
                        include: {
                            department: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                            leader: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    avatar: true
                                }
                            }
                        }
                    }
                },
                skip,
                take: limit
            });

        return res.status(200).json({
            message: "Teams fetched successfully",
            pagination: {
                total: totalTeams,
                page,
                limit,
                totalPages:
                    Math.ceil(totalTeams / limit)
            },
            count: teams.length,
            data: teams
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message:
                "Internal server error while getting teams"
        });
    }
};

export const removeTeam = async (req, res) => {
    try {
        const {
            projectDepartmentId,
            teamId
        } = req.params;

        if (!projectDepartmentId || !teamId) {
            return res.status(400).json({
                message: "Credentials needed"
            });
        }

        const assignment =
            await prisma.projectTeam.findFirst({
                where: {
                    projectDepartmentId,
                    teamId
                },
                include: {
                    projectDepartment: {
                        include: {
                            project: true
                        }
                    }
                }
            });

        if (!assignment) {
            return res.status(404).json({
                message:
                    "Team is not assigned to this project department"
            });
        }

        const checkUser =
            await prisma.workspaceMember.findUnique({
                where: {
                    workspaceId_userId: {
                        workspaceId:
                            assignment.projectDepartment.project.workspaceId,
                        userId: req.user.userId
                    }
                }
            });

        if (!checkUser) {
            return res.status(403).json({
                message:
                    "You are not a member of this workspace"
            });
        }

        if (
            checkUser.sys_role !== "owner" &&
            checkUser.sys_role !== "manager"
        ) {
            return res.status(403).json({
                message:
                    "Only owner and manager can perform this action"
            });
        }

        const deleted =
            await prisma.projectTeam.delete({
                where: {
                    projectDepartmentId_teamId: {
                        projectDepartmentId,
                        teamId
                    }
                }
            });

        return res.status(200).json({
            message:
                "Team removed successfully",
            data: deleted
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message:
                "Internal server error while removing team"
        });
    }
};

