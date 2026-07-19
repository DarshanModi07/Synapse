import prisma from '../DB/db.config.js';

export const createDepartment = async (req, res) => {
    try {

        const { name, workspaceId } = req.body;
        const userId = req.user.userId;

        const departmentName = name?.trim();

        if (!workspaceId || !departmentName) {
            return res.status(400).json({
                message: "Workspace and department name are required"
            });
        }

        if (departmentName.length < 2 || departmentName.length > 50) {
            return res.status(400).json({
                message: "Department name must be between 2 and 50 characters"
            });
        }

        const workspaceMember =
            await prisma.workspaceMember.findUnique({
                where: {
                    workspaceId_userId: {
                        workspaceId,
                        userId
                    }
                }
            });

        if (!workspaceMember) {
            return res.status(403).json({
                message: "You are not a member of this workspace"
            });
        }

        if (workspaceMember.sys_role !== "owner") {
            return res.status(403).json({
                message: "Only workspace owners can create departments"
            });
        }

        const existingDepartment =
            await prisma.department.findFirst({
                where: {
                    workspaceId,
                    is_deleted: false,
                    name: {
                        equals: departmentName,
                        mode: "insensitive"
                    }
                }
            });

        if (existingDepartment) {
            return res.status(409).json({
                message: "Department already exists"
            });
        }

        const department =
            await prisma.$transaction(async (tx) => {

                return await tx.department.create({
                    data: {
                        name: departmentName,
                        workspace: {
                            connect: {
                                id: workspaceId
                            }
                        }
                    }
                });

            });

        return res.status(201).json({
            message: "Department created successfully",
            data: department
        });

    }
    catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error while creating department"
        });

    }
};

export const getAllDepartment = async (req, res) => {
    try {

        const { workspaceId } = req.params;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const userId = req.user.userId;

        if (!workspaceId) {
            return res.status(400).json({
                message: "Workspace ID is required"
            });
        }

        const workspaceMember =
            await prisma.workspaceMember.findUnique({
                where: {
                    workspaceId_userId: {
                        workspaceId,
                        userId
                    }
                }
            });

        if (!workspaceMember) {
            return res.status(403).json({
                message: "You are not a member of this workspace"
            });
        }

        const [totalDepartments, departments] =
            await Promise.all([

                prisma.department.count({
                    where: {
                        workspaceId,
                        is_deleted: false
                    }
                }),

                prisma.department.findMany({

                    where: {
                        workspaceId,
                        is_deleted: false
                    },

                    include: {

                        manager: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true
                            }
                        },

                        teams: {
                            where: {
                                is_deleted: false
                            },
                            include: {
                                teamMembers: {
                                    select: {
                                        id: true
                                    }
                                }
                            }
                        },

                        projects: {
                            select: {
                                id: true
                            }
                        }

                    },

                    orderBy: {
                        createdAt: "desc"
                    },

                    skip,

                    take: limit

                })

            ]);

        const formattedDepartments =
            departments.map((department) => {

                const memberCount =
                    department.teams.reduce(
                        (count, team) =>
                            count +
                            team.teamMembers.length,
                        0
                    );

                return {

                    id: department.id,

                    name: department.name,

                    createdAt: department.createdAt,

                    updatedAt: department.updatedAt,

                    manager: department.manager
                        ? {
                            id: department.manager.id,
                            name: department.manager.name,
                            email: department.manager.email,
                            avatar: department.manager.avatar
                        }
                        : null,

                    statistics: {

                        teams:
                            department.teams.length,

                        projects:
                            department.projects.length,

                        members:
                            memberCount

                    }

                };

            });

        return res.status(200).json({

            message:
                formattedDepartments.length
                    ? "Departments fetched successfully"
                    : "No departments found",

            pagination: {

                total: totalDepartments,

                page,

                limit,

                totalPages: Math.ceil(
                    totalDepartments / limit
                )

            },

            data: formattedDepartments

        });

    }
    catch (err) {

        console.error(err);

        return res.status(500).json({
            message:
                "Internal Server Error while fetching departments"
        });

    }
};

export const updateDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params;
        let { name, managerId, is_deleted } = req.body;
        const userId = req.user.userId;

        if (!departmentId) {
            return res.status(400).json({
                message: "Department Id is required"
            });
        }

        const department = await prisma.department.findUnique({
            where: {
                id: departmentId
            }
        });

        if (!department) {
            return res.status(404).json({
                message: "Department not found"
            });
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
            return res.status(403).json({
                message: "You are not a member of this workspace"
            });
        }

        if (workspaceMember.sys_role !== "owner") {
            return res.status(403).json({
                message: "Only workspace owner can update department"
            });
        }

        const updateData = {};

        if (name) {
            const trimmedName = name.trim();

            if (trimmedName.length < 2) {
                return res.status(400).json({
                    message: "Department name is too short"
                });
            }

            updateData.name = trimmedName;
        }

        if (managerId) {

            const managerMember =
                await prisma.workspaceMember.findUnique({
                    where: {
                        workspaceId_userId: {
                            workspaceId: department.workspaceId,
                            userId: managerId
                        }
                    }
                });

            if (!managerMember) {
                return res.status(404).json({
                    message: "Manager not found in workspace"
                });
            }

            if (managerMember.sys_role === "employee") {
                return res.status(403).json({
                    message: "Employee cannot be assigned as manager"
                });
            }

            await prisma.workspaceMember.update({
                where: {
                    workspaceId_userId: {
                        workspaceId: department.workspaceId,
                        userId: managerId
                    }
                },
                data: {
                    sys_role: "manager"
                }
            });

            updateData.managerId = managerId;
        }

        if (typeof is_deleted === "boolean") {
            updateData.is_deleted = is_deleted;
            updateData.deletedAt = is_deleted ? new Date() : null;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "No changes provided"
            });
        }

        const updatedDepartment =
            await prisma.department.update({
                where: {
                    id: departmentId
                },
                data: updateData
            });

        return res.status(200).json({
            message: "Department updated successfully",
            data: updatedDepartment
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error during updating department"
        });
    }
};

export const deleteDepartment = async (req,res) => {
    try{
        const { departmentId } = req.params

        if(!departmentId){
            return res.status(400).json({
                message:"Credential Needed"
            })
        }

        const checkDept = await prisma.department.findUnique({
            where:{
                id:departmentId
            }
        })

        if(!checkDept){
            return res.status(404).json({
                message:"Department Does Not Exist"
            })
        }

        const workspaceId = checkDept.workspaceId

        const teamCount = await prisma.team.count({
            where:{
                departmentId
            }
        })

        if(teamCount > 0){
            return res.status(400).json({
                message:"This department contains teams. Remove or move teams first."
            })
        }

        const userId = req.user.userId
        
        const checkUser = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId,
                    userId
                }
            }
        })

        if(!checkUser){
            return res.status(400).json({
                message:"You are not belongs to this Workspace"
            })
        }

        if(checkUser.sys_role != "owner"){
            return res.status(403).json({
                message:"You have no authority to do this action"
            })
        }

        const deleteDept =  await prisma.department.delete({
            where:{
                id:departmentId
            }
        })

        return res.status(200).json({
            message:"Department Deleted",
            data:deleteDept
        })
    }   
    catch(err){
        return res.status(500).json({
            message:"Internal server Error during Delete Department"
        })
    }
}

export const getDepartmentById = async (req, res) => {
    try {

        const { departmentId } = req.params;
        const userId = req.user.userId;

        if (!departmentId) {
            return res.status(400).json({
                message: "Department ID is required"
            });
        }

        const department = await prisma.department.findUnique({
            where: {
                id: departmentId
            },
            include: {
                manager: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profilePic: true
                    }
                },
                workspace: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                }
            }
        });

        if (!department || department.is_deleted) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        const workspaceMember =
            await prisma.workspaceMember.findUnique({
                where: {
                    workspaceId_userId: {
                        workspaceId: department.workspaceId,
                        userId
                    }
                }
            });

        if (!workspaceMember) {
            return res.status(403).json({
                message: "You are not a member of this workspace"
            });
        }

        if (
            ![
                "owner",
                "manager",
                "team_lead"
            ].includes(workspaceMember.sys_role)
        ) {
            return res.status(403).json({
                message: "You do not have permission to access this department"
            });
        }

        const [
            teamCount,
            projectCount,
            memberCount
        ] = await Promise.all([

            prisma.team.count({
                where: {
                    departmentId,
                    is_deleted: false
                }
            }),

            prisma.projectDepartment.count({
                where: {
                    departmentId
                }
            }),

            prisma.teamMember.count({
                where: {
                    team: {
                        departmentId,
                        is_deleted: false
                    }
                }
            })

        ]);

        return res.status(200).json({
            message: "Department fetched successfully",

            data: {

                id: department.id,

                name: department.name,

                createdAt: department.createdAt,

                updatedAt: department.updatedAt,

                workspace: department.workspace,

                manager: department.manager,

                statistics: {
                    teams: teamCount,
                    projects: projectCount,
                    members: memberCount
                }

            }
        });

    }
    catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error while fetching department"
        });

    }
};

export const getAvailableManagers = async (req, res) => {
    try {

        const { departmentId } = req.params;
        const userId = req.user.userId;

        if (!departmentId) {
            return res.status(400).json({
                message: "Department ID is required"
            });
        }

        const department = await prisma.department.findUnique({
            where: {
                id: departmentId
            },
            select: {
                id: true,
                workspaceId: true,
                managerId: true
            }
        });

        if (!department) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        const workspaceMember =
            await prisma.workspaceMember.findUnique({
                where: {
                    workspaceId_userId: {
                        workspaceId: department.workspaceId,
                        userId
                    }
                }
            });

        if (!workspaceMember) {
            return res.status(403).json({
                message: "You are not a member of this workspace"
            });
        }

        if (workspaceMember.sys_role !== "owner") {
            return res.status(403).json({
                message: "Only workspace owner can assign managers"
            });
        }

        const members =
            await prisma.workspaceMember.findMany({
                where: {
                    workspaceId: department.workspaceId,
                    sys_role: {
                        not: "employee"
                    }
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            avatar: true
                        }
                    }
                },
                orderBy: {
                    joinedAt: "asc"
                }
            });

        const availableManagers =
            members.map((member) => ({
                id: member.user.id,
                name: member.user.name,
                email: member.user.email,
                profilePic: member.user.profilePic,
                currentRole: member.sys_role,
                selected:
                    department.managerId === member.user.id
            }));

        return res.status(200).json({
            message: "Available managers fetched successfully",
            data: availableManagers
        });

    }
    catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error while fetching managers"
        });

    }
};

export const departmentDashboard = async (req, res) => {
    try {

        const { departmentId } = req.params;
        const userId = req.user.userId;

        if (!departmentId) {
            return res.status(400).json({
                message: "Department ID is required"
            });
        }

        const department = await prisma.department.findUnique({
            where: {
                id: departmentId
            },
            include: {
                manager: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                workspace: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                }
            }
        });

        if (!department || department.is_deleted) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        const workspaceMember =
            await prisma.workspaceMember.findUnique({
                where: {
                    workspaceId_userId: {
                        workspaceId: department.workspaceId,
                        userId
                    }
                }
            });

        if (!workspaceMember) {
            return res.status(403).json({
                message: "You are not a member of this workspace"
            });
        }

        const [
            teams,
            projectDepartments,
            teamMembers
        ] = await Promise.all([

            prisma.team.findMany({
                where: {
                    departmentId,
                    is_deleted: false
                },
                include: {
                    leader: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true
                        }
                    },
                    _count: {
                        select: {
                            teamMembers: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "asc"
                }
            }),

            prisma.projectDepartment.findMany({
                where: {
                    departmentId
                },
                include: {
                    project: {
                        select: {
                            id: true,
                            name: true,
                            status: true,
                            startDate: true,
                            dueDate: true
                        }
                    }
                }
            }),

            prisma.teamMember.findMany({
                where: {
                    team: {
                        departmentId,
                        is_deleted: false
                    }
                },
                include: {
                    member: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            avatar: true
                        }
                    },
                    team: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: {
                    joinedAt: "asc"
                }
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
                    team: {
                        id: member.team.id,
                        name: member.team.name
                    }
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

    }
    catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error while fetching department dashboard"
        });

    }
};