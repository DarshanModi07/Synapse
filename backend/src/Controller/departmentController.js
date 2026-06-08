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

        if (member.sys_role !== SysRole.owner) {
            return res.status(403).json({
                message: "Only workspace owners can create departments"
            });
        }

        const existingDepartment = await prisma.department.findFirst({
            where: {
                workspaceId,
                name: departmentName
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

export const getAllDepartment = async (req,res) => {
    try{
        const { workspaceId } = req.params

        if(!workspaceId){
            return res.status(400).json({
                message:"credential needed"
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
            return res.status(403).json({
                message:"You are not a member of this workspace"
            })
        }

        const getAllDept = await prisma.department.findMany({
            where:{
                workspaceId,
                is_deleted:false
            },
            orderBy:{
                createdAt:"desc"
            }
        })

        if(getAllDept.length == 0){
            return res.status(200).json({
                message:"No Department found",
                data:getAllDept
            })
        }

        return res.status(200).json({
            message:"All Department fetched",
            data:getAllDept
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server error during get all department"
        })
    }
}

export const updateDepartment = async (req,res) => {
    try{
        const { departmentId } = req.params
        let { name,managerId,is_deleted } = req.body
        const userId = req.user.userId

        if(!departmentId){
            return res.status(400).json({
                message:"Credentials needed"
            })
        }

        const checkDepartment = await prisma.department.findUnique({
            where:{
                id:departmentId
            }
        }) 

        if(!checkDepartment){
            return res.status(404).json({
                message:"No Department Found"
            })
        }

        if(managerId){
            const checkManager = await prisma.workspaceMember.findFirst({
                where:{
                    workspaceId: checkDepartment.workspaceId,
                    userId: managerId
                }
            })
    
            if(!checkManager){
                return res.status(400).json({
                    message:"User not Found"
                })
            }

            if(checkManager.sys_role == "employee"){
                return res.status(403).json({
                    message:"Employee can not become manager"
                })
            }
        }

        const findUser = await prisma.workspaceMember.findFirst({
            where:{
                workspaceId:checkDepartment.workspaceId,
                userId
            }
        })

        if(!findUser){
            return res.status(403).json({
                message:"You are not the Member of this Workspace"
            })
        }

        if(findUser.sys_role != "owner" && findUser.sys_role != "manager"){
            return res.status(403).json({
                message:"You can not modify the Department Data only Owner and Manager can"
            })
        }

        if(checkDepartment.name == name && checkDepartment.managerId == managerId && checkDepartment.is_deleted == is_deleted){
            return res.status(400).json({
                message:"No Changes Have made"
            })
        }

        const updateData = {};

        if(name){
            updateData.name = name.trim();
        }

        if(managerId){
            updateData.managerId = managerId;
        }

        if(typeof is_deleted === "boolean"){
            updateData.is_deleted = is_deleted;

            if(is_deleted){
                updateData.deletedAt = new Date();
            }
        }

        const updateDept = await prisma.department.update({
            where:{
                id:departmentId,
            },
            data:{
                name,
                managerId,
                is_deleted
            }
        })

        return res.status(200).json({
            message:"Department data modified",
            data:updateData
        })

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message:"Internal Server Error during updating department"
        })
    }
}

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
