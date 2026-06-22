import prisma from '../DB/db.config.js';

export const createDepartment = async (req, res) => {
    try {
        const { name, workspaceId } = req.body;
        const userId = req.user.userId;

        const departmentName = name?.trim();

        if (!departmentName || !workspaceId) {
            return res.status(400).json({
                message: "Credentials missing"
            });
        }

        const member = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId
                }
            }
        });

        if (!member) {
            return res.status(403).json({
                message: "You do not belong to this workspace"
            });
        }

        if (member.sys_role !== "owner") {
            return res.status(403).json({
                message: "Only workspace owners can create departments"
            });
        }

        const existingDepartment = await prisma.department.findFirst({
            where: {
                workspaceId,
                name: departmentName,
                is_deleted:false
            }
        });

        if (existingDepartment) {
            return res.status(409).json({
                message: "Department name already exists"
            });
        }

        const department = await prisma.department.create({
            data: {
                name: departmentName,
                workspace: {
                    connect: {
                        id: workspaceId
                    }
                }
            }
        });

        return res.status(201).json({
            message: "Department created successfully",
            data: department
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal server error while creating department"
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

        const checkUser = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId
                }
            }
        });

        if (!checkUser) {
            return res.status(403).json({
                message: "You are not a member of this workspace"
            });
        }

        const totalDepartments = await prisma.department.count({
            where: {
                workspaceId,
                is_deleted: false
            }
        });

        const departments = await prisma.department.findMany({
            where: {
                workspaceId,
                is_deleted: false
            },
            orderBy: {
                createdAt: "desc"
            },
            skip,
            take: limit
        });

        return res.status(200).json({
            message:
                departments.length > 0
                    ? "Departments fetched successfully"
                    : "No departments found",
            pagination: {
                total: totalDepartments,
                page,
                limit,
                totalPages: Math.ceil(totalDepartments / limit)
            },
            data: departments
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error while fetching departments"
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
        console.log(err);
        return res.status(500).json({
            message:"Internal server Error during Delete Department"
        })
    }
}

