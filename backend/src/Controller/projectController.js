import { start } from "repl"
import prisma from "../DB/db.config.js"

export const createProject = async (req, res) => {
    try {
        let { workspaceId, name, description, startDate, dueDate } = req.body;

        name = name?.trim();
        description = description?.trim();

        if (!workspaceId || !name || !startDate || !dueDate) {
            return res.status(400).json({
                message: "workspaceId, name, startDate and dueDate are required"
            });
        }

        const currentUserId = req.user.userId;

        const checkWorkspace = await prisma.workspace.findUnique({
            where: {
                id: workspaceId
            }
        });

        if (!checkWorkspace) {
            return res.status(404).json({
                message: "Workspace not found"
            });
        }

        const checkWorkSpaceMember = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId: currentUserId
                }
            }
        });

        if (!checkWorkSpaceMember) {
            return res.status(403).json({
                message: "You are not a member of this workspace"
            });
        }

        if (
            checkWorkSpaceMember.sys_role !== "owner" &&
            checkWorkSpaceMember.sys_role !== "manager"
        ) {
            return res.status(403).json({
                message: "You are not allowed to create projects"
            });
        }

        const checkNameAvail = await prisma.project.findUnique({
            where: {
                workspaceId_name: {
                    workspaceId,
                    name
                }
            }
        });

        if (checkNameAvail) {
            return res.status(409).json({
                message: "Project name already exists"
            });
        }

        const start = new Date(startDate);
        const due = new Date(dueDate);

        if (isNaN(start.getTime()) || isNaN(due.getTime())) {
            return res.status(400).json({
                message: "Invalid date format"
            });
        }

        if (start > due) {
            return res.status(400).json({
                message: "Start date cannot be after due date"
            });
        }

        const project = await prisma.project.create({
            data: {
                name,
                description: description || null,
                workspaceId,
                createdById: currentUserId,
                startDate: start,
                dueDate: due
            }
        });

        return res.status(201).json({
            message: "Project created successfully",
            data: project
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal Server Error while creating project"
        });
    }
};

export const getProject = async (req,res) => {
    try{
        const { projectId } = req.params

        if(!projectId){
            return res.status(400).json({
                message:"Credentials needed"
            })
        }

        const singleProject = await prisma.project.findFirst({
            where:{
                id:projectId,
                is_deleted:false
            },
            include:{
                createdBy:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        avatar:true
                    }
                }
            }
        })

        if(!singleProject){
            return res.status(404).json({
                message:"Project Not Found"
            })
        }

        const checkUser = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId:singleProject.workspaceId,
                    userId:req.user.userId
                }
            }
        })

        if(!checkUser){
            return res.status(403).json({
                message:"You are Not the Member of the Workspace"
            })
        }

        return res.status(200).json({
            message:"Project Fetched successfully",
            data:singleProject
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error while Getting a Project"
        })
    }
}

export const getAllProjects = async (req, res) => {
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

        // Verify workspace membership
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

        const totalProjects = await prisma.project.count({
            where: {
                workspaceId,
                is_deleted: false
            }
        });

        const allProjects = await prisma.project.findMany({
            where: {
                workspaceId,
                is_deleted: false
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            skip,
            take: limit
        });

        return res.status(200).json({
            message:
                allProjects.length > 0
                    ? "Projects fetched successfully"
                    : "No projects found",
            pagination: {
                total: totalProjects,
                page,
                limit,
                totalPages: Math.ceil(totalProjects / limit)
            },
            data: allProjects
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error while fetching projects"
        });
    }
};