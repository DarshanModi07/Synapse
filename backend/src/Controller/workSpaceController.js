import prisma from "../DB/db.config.js" 
import { SysRole } from "@prisma/client";
import slugify from "slugify";
import crypto from "crypto"

export const createWorkSpace = async (req,res) => {
    try {
        let { name,logo,workRole } = req.body

        if(!name || typeof name !== "string"){
            return res.status(400).json({
                message:"Workspace Name is Required"
            })
        }

        name = name.trim()

        if(name.length < 3){
            return res.status(400).json({
                message:"Workspace Name must be at least 3 chars long"
            })
        }

        const slug = slugify(name,{
            lower:true,
            strict:true
        })

        const workspace = await prisma.$transaction(async (tx) => {
            const existingWorkspace = await tx.workspace.findUnique({
                where:{
                    slug
                }
            })  
            
            if(existingWorkspace){
                throw new Error("WORKSPACE_ALREADY_EXISTS")
            }

            const newWorkspace = await tx.workspace.create({
                data:{
                    name,
                    slug,
                    logo,
                    ownerId: req.user.userId
                }
            })

            await tx.workspaceMember.create({
                data:{
                    userId: req.user.userId,
                    workspaceId: newWorkspace.id,
                    sys_role: "owner",
                    work_role: workRole
                }
            })

            return newWorkspace
        })

        return res.status(201).json({
            message:"workspace created successfully",
            data:workspace
        })        
        
    }
    catch (err) {
        if (err.message === "WORKSPACE_ALREADY_EXISTS") {
            return res.status(409).json({
            message: "Workspace with this name already exists",
            });
        }
        console.error(err);
        return res.status(500).json({
        message: "Internal Server Error",
        });
    }
}

export const getUserWorkSpaces = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(400).json({
                message: "User ID not found"
            });
        }

        const workspaces = await prisma.workspaceMember.findMany({
            where: {
                userId
            },
            select: {
                sys_role: true,
                work_role: true,
                joinedAt: true,
                workspace: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        logo: true,
                        ownerId: true,
                        createdAt: true
                    }
                }
            }
        });

        if (workspaces.length === 0) {
            return res.status(200).json({
                message: "No workspaces found",
                data: []
            });
        }

        return res.status(200).json({
            message: "User workspaces fetched successfully",
            data: workspaces
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Server error while fetching workspaces"
        });
    }
};

export const getWorkspace = async (req, res) => {
    try {
        const { slug } = req.params;
        const userId = req.user?.userId;

        if (!slug) {
            return res.status(400).json({
                message: "Workspace slug is required"
            });
        }

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const workspace = await prisma.workspace.findUnique({
            where: {
                slug
            },
            select: {
                id: true,
                name: true,
                slug: true,
                logo: true,
                ownerId: true,
                createdAt: true,
                updatedAt: true,
                workspaceMembers: {
                    where: {
                        userId
                    },
                    select: {
                        id: true,
                        sys_role: true,
                        work_role: true
                    }
                }
            }
        });

        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found"
            });
        }

        if (workspace.workspaceMembers.length === 0) {
            return res.status(403).json({
                message: "You do not have access to this workspace"
            });
        }

        const memberInfo = workspace.workspaceMembers[0];

        return res.status(200).json({
            message: "Workspace fetched successfully",
            data: {
                id: workspace.id,
                name: workspace.name,
                slug: workspace.slug,
                logo: workspace.logo,
                ownerId: workspace.ownerId,
                createdAt: workspace.createdAt,
                updatedAt: workspace.updatedAt,
                memberRole: {
                    sysRole: memberInfo.sys_role,
                    workRole: memberInfo.work_role
                }
            }
        });

    } catch (err) {
        console.error("Get Workspace Error:", err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const inviteUser = async (req,res) => {
    try{
        const { email , workspaceId , sys_role , work_role } = req.body
        const invitedBy = req.user.userId
        const token = crypto.randomBytes(32).toString("hex");

        if(!email || !workspaceId || !sys_role){
            return res.status(400).json({
                message:"Please Provide all Credential"
            })
        }

        const findWorkspace = await prisma.workspace.findUnique({
            where:{
                id:workspaceId
            },
            include:{
                workspaceMembers:{
                    where:{
                        userId:invitedBy
                    }
                }
            }
        })

        if(!findWorkspace){
            return res.status(404).json({
                message:"Invalid Request , No Workspace Found"
            })
        }

        if(findWorkspace.workspaceMembers.length <= 0){
            return res.status(400).json({
                message:"You are No longer Member of this Workspace"
            })
        }



        const inviterMembership = findWorkspace.workspaceMembers[0]

        const allowedRoles = ["owner","manager"]

        if(!allowedRoles.includes(inviterMembership.sys_role)){
            return res.status(403).json({
                message:"You don't have permission to invite users"
            })
        }

        const user = await prisma.user.findUnique({
            where:{
                email
            },
            select:{
                id:true
            }
        })


        const alreadyMember = await prisma.workspaceMember.findFirst({
            where:{
                workspaceId,
                userId:user.id
            }
        })

        if(alreadyMember != null){
            return res.status(409).json({
                message:"The user is already a Member"
            })
        }

        const alreadyInvited = await prisma.workspaceInvite.findFirst({
            where:{
                workspaceId,
                email,
                status:"pending"
            }
        })

        if(alreadyInvited){
            return res.status(409).json({
                "message":"user is already invited"
            })
        }

        const createUserInvite = await prisma.workspaceInvite.create({
              data: {
                workspaceId,
                email,
                sys_role,
                work_role,
                token,
                invitedBy,
                expiresAt: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
                )
            }
        })

        return res.status(200).json({
            message:"Invite Sent",
            data:createUserInvite
        })

    } 
    catch(err){
        console.log(err)
        return res.status(500).json({
            message:"Server Error during User Invite"
        })
    }
}

export const acceptInvite = async (req,res) => {
    try{
        const { token } = req.params

        if(!token){
            ret
        }

    }
    catch(err){

    }
}
