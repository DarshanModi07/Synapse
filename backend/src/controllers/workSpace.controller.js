import prisma from "../DB/db.config.js" 
import { SysRole } from "@prisma/client";
import slugify from "slugify";
import crypto from "crypto"
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export const createWorkSpace = async (req,res) => {
    try {
        let { name, workRole, description } = req.body;

        if(!name || typeof name !== "string" || !description || typeof description !== "string"){
            return res.status(400).json({
                message:"Workspace Name and Description are Required"
            });
        }

        name = name.trim();

        if(name.length < 3){
            return res.status(400).json({
                message:"Workspace Name must be at least 3 chars long"
            });
        }

        let logo = null;

        if(req.file){

            const uploadedLogo =
                await uploadToCloudinary(
                    req.file.buffer,
                    "workspace-logos"
                );

            logo = uploadedLogo.secure_url;
        }

        const slug = slugify(name,{
            lower:true,
            strict:true
        });

        const workspace = await prisma.$transaction(
            async(tx)=>{

                const existingWorkspace =
                    await tx.workspace.findUnique({
                        where:{
                            slug
                        }
                    });

                if(existingWorkspace){
                    throw new Error(
                        "WORKSPACE_ALREADY_EXISTS"
                    );
                }

                const newWorkspace =
                    await tx.workspace.create({
                        data:{
                            name,
                            slug,
                            logo,
                            ownerId:req.user.userId,
                            description
                        }
                    });

                await tx.workspaceMember.create({
                    data:{
                        userId:req.user.userId,
                        workspaceId:newWorkspace.id,
                        sys_role:"owner",
                        work_role:workRole
                    }
                });

                return newWorkspace;
            }
        );

        return res.status(201).json({
            message:"Workspace created successfully",
            data:workspace
        });

    }
    catch(err){

        if(
            err.message ===
            "WORKSPACE_ALREADY_EXISTS"
        ){
            return res.status(409).json({
                message:
                    "Workspace with this name already exists"
            });
        }

        console.error(err);

        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
};

export const getUserWorkSpaces = async (req, res) => {
    try {
        const userId = req.user.userId;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (!userId) {
            return res.status(400).json({
                message: "User ID not found"
            });
        }

        const totalWorkspaces = await prisma.workspaceMember.count({
            where: {
                userId
            }
        });

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
            },
            orderBy: {
                joinedAt: "desc"
            },
            skip,
            take: limit
        });

        return res.status(200).json({
            message:
                workspaces.length > 0
                    ? "User workspaces fetched successfully"
                    : "No workspaces found",
            pagination: {
                total: totalWorkspaces,
                page,
                limit,
                totalPages: Math.ceil(totalWorkspaces / limit)
            },
            count: workspaces.length,
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



        const inviterMembership = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId,
                    userId:invitedBy
                }
            },
            select:{
                sys_role:true
            }
        })

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

export const acceptInvite = async (req, res) => {
    try {
        
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({
                message: "Invite token is required"
            });
        }

        const currentUser = await prisma.user.findUnique({
            where: {
                id: req.user.userId
            },
            select: {
                id: true,
                email: true
            }
        });

        const invite = await prisma.workspaceInvite.findUnique({
            where: {
                token
            }
        });

        if (!invite) {
            return res.status(404).json({
                message: "Invite not found"
            });
        }

        if (invite.email !== currentUser.email) {
            return res.status(403).json({
                message: "This invite does not belong to you"
            });
        }

        if (invite.status !== "pending") {
            return res.status(400).json({
                message: "Invite is no longer pending"
            });
        }

        if (invite.expiresAt < new Date()) {
            await prisma.workspaceInvite.update({
                where: {
                    token
                },
                data: {
                    status: "expired"
                }
            });

            return res.status(410).json({
                message: "Invite has expired"
            });
        }

        const existingMember = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId: invite.workspaceId,
                userId: currentUser.id
            }
        });

        if (existingMember) {
            return res.status(409).json({
                message: "You are already a member of this workspace"
            });
        }

        await prisma.$transaction(async (tx) => {
            await tx.workspaceMember.create({
                data: {
                    sys_role: invite.sys_role,
                    work_role: invite.work_role,
                    userId: currentUser.id,
                    workspaceId: invite.workspaceId
                }
            });

            await tx.workspaceInvite.update({
                where: {
                    token
                },
                data: {
                    status: "accepted"
                }
            });
        });

        return res.status(200).json({
            message: "Invite accepted successfully"
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Server Error during Invite Accept"
        });
    }

};

export const rejectInvite = async (req, res) => {
    try {
        
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({
                message: "Invite token is required"
            });
        }

        const currentUser = await prisma.user.findUnique({
            where: {
                id: req.user.userId
            },
            select: {
                id: true,
                email: true
            }
        });

        const invite = await prisma.workspaceInvite.findUnique({
            where: {
                token
            }
        });

        if (!invite) {
            return res.status(404).json({
                message: "Invite not found"
            });
        }

        if (invite.email !== currentUser.email) {
            return res.status(403).json({
                message: "This invite does not belong to you"
            });
        }

        if (invite.status !== "pending") {
            return res.status(400).json({
                message: "Invite is no longer pending"
            });
        }

        if (invite.expiresAt < new Date()) {
            await prisma.workspaceInvite.update({
                where: {
                    token
                },
                data: {
                    status: "expired"
                }
            });

            return res.status(410).json({
                message: "Invite has expired"
            });
        }

        const existingMember = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId: invite.workspaceId,
                userId: currentUser.id
            }
        });

        if (existingMember) {
            return res.status(409).json({
                message: "You are already a member of this workspace"
            });
        }

        await prisma.$transaction(async (tx) => {
            await tx.workspaceMember.create({
                data: {
                    sys_role: invite.sys_role,
                    work_role: invite.work_role,
                    userId: currentUser.id,
                    workspaceId: invite.workspaceId
                }
            });

            await tx.workspaceInvite.update({
                where: {
                    token
                },
                data: {
                    status: "rejected"
                }
            });
        });

        return res.status(200).json({
            message: "Invite rejected successfully"
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Server Error during Invite Reject"
        });
    }

};

export const getWorkspaceMembers = async (req,res) => {
    try{
        
        const userId = req.user.userId;
        const workspaceId = req.params.workspaceId;

        let role = await prisma.workspaceMember.findFirst({
            where:{
                workspaceId,
                userId
            }
        });

        if(!role){
            return res.status(403).json({
                message:"You are not a member of this workspace"
            });
        }

        role = role.sys_role;

        if(role == "owner"){
            const FetchAll = await prisma.workspaceMember.findMany({
                where:{
                    workspaceId,
                    userId:{
                        not:userId
                    },
                    OR:[
                        { sys_role:"employee" },
                        { sys_role:"manager" },
                        { sys_role:"team_lead" }
                    ]
                },
                include:{
                    user:{
                        select:{
                            id:true,
                            name:true,
                            email:true,
                            avatar:true
                        }
                    }
                }
            });

            if(FetchAll.length == 0){
                return res.status(200).json({
                    message:"There is No Members in your Workspace",
                    data:FetchAll
                });
            }

            return res.status(200).json({
                message:"All Members",
                data:FetchAll
            });

        }
        else if(role == "manager"){
            const FetchAll = await prisma.workspaceMember.findMany({
                where:{
                    workspaceId,
                    userId:{
                        not:userId
                    },
                    OR:[
                        { sys_role:"employee" },
                        { sys_role:"team_lead" }
                    ]
                },
                include:{
                    user:{
                        select:{
                            id:true,
                            name:true,
                            email:true,
                            avatar:true
                        }
                    }
                }
            });

            if(FetchAll.length == 0){
                return res.status(200).json({
                    message:"There is No Members in your Department",
                    data:FetchAll
                });
            }

            return res.status(200).json({
                message:"All Members",
                data:FetchAll
            });

        }
        else if(role == "team_lead"){
            const FetchAll = await prisma.workspaceMember.findMany({
                where:{
                    workspaceId,
                    userId:{
                        not:userId
                    },
                    sys_role:"employee"
                },
                include:{
                    user:{
                        select:{
                            id:true,
                            name:true,
                            email:true,
                            avatar:true
                        }
                    }
                }
            });

            if(FetchAll.length == 0){
                return res.status(200).json({
                    message:"There is No Members in your Team",
                    data:FetchAll
                });
            }

            return res.status(200).json({
                message:"All Members",
                data:FetchAll
            });

        }
        else if(role == "employee"){
            return res.status(403).json({
                message:"You are not allowed to this action as an employee"
            });
        }
        else{
            return res.status(400).json({
                message:"Invalid Role"
            });
        }

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error while Getting all Workspace Members"
        });
    }
};

export const removeMember = async (req,res) => {
    try{
        const { workspaceId,userId } = req.params

        const currentUserId = req.user.userId

        if(!workspaceId || !userId){
            return res.status(400).json({
                message:"Input Required"
            })
        }

        const currentUser = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId,
                    userId: currentUserId
                }
            }
        })

        if(!currentUser){
            return res.status(400).json({
                message:"You Are Not the Member of this Workspace"
            })
        }

        if(currentUser.sys_role == "team_leader" || currentUser.sys_role == "employee"){
            return res.status(400).json({
                message:"You Are Not Able to make this Changes"
            })
        }      
        
        if(currentUserId == userId){
            return res.status(400).json({
                message:"User can not delete it self"
            })
        }

        const targetUser = await prisma.workspaceMember.findFirst({
            where:{
                userId,
                workspaceId
            }
        })

        if(!targetUser){
            return res.status(400).json({
                message:"target user is not exist"
            })
        }

        if(targetUser.sys_role === "owner"){
            return res.status(403).json({
                message:"Owner cannot be removed"
            })
        }

        if(currentUser.sys_role == "manager" && (targetUser.sys_role=="owner" || targetUser.sys_role=="manager")){
            return res.status(403).json({
                message:"Manager, You are not allowed to make this changes"
            })
        }

        const deleteMember = await prisma.workspaceMember.delete({
            where:{
                workspaceId_userId:{
                    workspaceId,
                    userId
                }
            }

        }) 

        return res.status(200).json({
            message:"Deleted the Member",
            data:deleteMember
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
};

export const changeRole = async (req,res) => {
    try{
        const { workspaceId, userId } = req.params
        const sys_role = req.body.sys_role
        const targetUserId = userId
        const currentUserId = req.user.userId

        const allowedRoles = [
            "manager",
            "team_leader",
            "employee"
        ];

        if(currentUserId === targetUserId){
            return res.status(403).json({
                message:"You cannot change your own role"
            })
        }

        if(!allowedRoles.includes(sys_role)){
            return res.status(400).json({
                message:"Invalid role"
            })
        }

        if(!workspaceId || !targetUserId){
            return res.status(400).json({
                message:"Credentials needed"
            })
        }

        const currentUser = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId,
                    userId:currentUserId
                }
            }
        })

        if(!currentUser){
            return res.status(403).json({
                message:"You are not the Member of Workspace"
            })
        }

        if(currentUser.sys_role == "team_leader" || currentUser.sys_role == "employee"){
            return res.status(400).json({
                message:"you does not have authority to change the role"
            })
        }

        const targetUser = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId,
                    userId:targetUserId
                }
            }
        })

        if(!targetUser){
            return res.status(400).json({
                message:"Target User not found"
            })
        }

        if(currentUser.sys_role === "manager" && (sys_role === "manager" || sys_role === "owner")){
            return res.status(403).json({
                message:"Manager cannot assign this role"
            })
        }

        if(currentUser.sys_role == "manager" && (targetUser.sys_role == "manager" || targetUser.sys_role == "owner")){
            return res.status(403).json({
                message:"Manager, You do not have authority to do this"
            })
        }

        const updateRole = await prisma.workspaceMember.update({
            where:{
                workspaceId_userId:{
                    workspaceId,
                    userId:targetUserId
                }
            },
                data:{
                    sys_role
                }
        })

        return res.status(200).json({
            message:"Role changed successfully",
            data:updateRole
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error during change role"
        })
    }
};

export const ownerDashboard = async (req,res) => {
    try{

        const { workspaceId } = req.params;
        const userId = req.user.userId;

        if(!workspaceId){
            return res.status(400).json({
                message:"Workspace Id required"
            });
        }

        const checkUser =
            await prisma.workspaceMember.findUnique({
                where:{
                    workspaceId_userId:{
                        workspaceId,
                        userId
                    }
                }
            });

        if(!checkUser){
            return res.status(403).json({
                message:"You are not member of workspace"
            });
        }

        if(checkUser.sys_role !== "owner"){
            return res.status(403).json({
                message:"Only owner can access dashboard"
            });
        }

        const totalDepartments =
            await prisma.department.count({
                where:{
                    workspaceId,
                    is_deleted:false
                }
            });

        const totalTeams =
            await prisma.team.count({
                where:{
                    department:{
                        workspaceId
                    },
                    is_deleted:false
                }
            });

        const totalProjects =
            await prisma.project.count({
                where:{
                    workspaceId,
                    is_deleted:false
                }
            });

        const tasks =
            await prisma.task.findMany({
                where:{
                    is_deleted:false,
                    projectTeam:{
                        projectDepartment:{
                            department:{
                                workspaceId
                            }
                        }
                    }
                },
                select:{
                    id:true
                }
            });

        const taskIds = tasks.map(
            task => task.id
        );

        const subTasks =
            await prisma.subTask.findMany({
                where:{
                    taskId:{
                        in:taskIds
                    },
                    is_deleted:false
                },
                select:{
                    id:true
                }
            });

        const subTaskIds =
            subTasks.map(
                subtask => subtask.id
            );

        const totalWorkItems =
            await prisma.workItem.count({
                where:{
                    subTaskId:{
                        in:subTaskIds
                    },
                    is_deleted:false
                }
            });

        const done =
            await prisma.workItem.count({
                where:{
                    subTaskId:{
                        in:subTaskIds
                    },
                    status:"done",
                    is_deleted:false
                }
            });

        const inProgress =
            await prisma.workItem.count({
                where:{
                    subTaskId:{
                        in:subTaskIds
                    },
                    status:"in_progress",
                    is_deleted:false
                }
            });

        const inReview =
            await prisma.workItem.count({
                where:{
                    subTaskId:{
                        in:subTaskIds
                    },
                    status:"in_review",
                    is_deleted:false
                }
            });

        const progress =
            totalWorkItems === 0
                ? 0
                : Number(
                    (
                        done * 100 /
                        totalWorkItems
                    ).toFixed(2)
                );

        const recentProjects =
            await prisma.project.findMany({
                where:{
                    workspaceId,
                    is_deleted:false
                },
                orderBy:{
                    createdAt:"desc"
                },
                take:5,
                select:{
                    id:true,
                    name:true,
                    status:true,
                    dueDate:true
                }
            });

        return res.status(200).json({
            message:"Owner dashboard fetched",

            overview:{
                departments:totalDepartments,
                teams:totalTeams,
                projects:totalProjects,
                tasks:tasks.length,
                subtasks:subTasks.length,
                workItems:totalWorkItems
            },

            progress:{
                done,
                inProgress,
                inReview,
                overallProgress:progress
            },

            recentProjects
        });

    }
    catch(err){
        console.log(err);

        return res.status(500).json({
            message:"Internal Server Error while fetching dashboard"
        });
    }
}