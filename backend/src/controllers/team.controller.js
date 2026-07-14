import prisma from "../DB/db.config.js"

export const createTeam = async (req,res) => {
    try{
        let {
            departmentId,
            name,
            leaderId
        } = req.body;

        name = name.trim();
        const userId = req.user.userId

        if(!departmentId || !name){
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
                message:"Department not found"
            })
        }

        const checkUser = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId:checkDept.workspaceId,
                    userId
                }
            }
        })

        if(!checkUser){
            return res.status(404).json({
                message : "User not found"
            })
        }

        if(checkUser.sys_role != "owner" && checkUser.sys_role != "manager"){
            return res.status(403).json({
                message:"You are not able to create Team"
            })
        }
      

        const findTeam = await prisma.team.findUnique({
            where:{
                departmentId_name:{
                    departmentId,
                    name
                }
            }
        })

        if(findTeam && !findTeam.is_deleted){
            return res.status(409).json({
                message:"This name already exist"
            })
        }

if (leaderId) {

    const leader =
        await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId: checkDept.workspaceId,
                    userId: leaderId
                }
            }
        });

    if (!leader) {
        return res.status(404).json({
            message: "Leader not found"
        });
    }

}

const makeTeam = await prisma.team.create({
    data: {
        name,
        departmentId,
        leaderId: leaderId || null
    }
});

        return res.status(201).json({
            message:"Team Created",
            data:makeTeam
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server error during create team"
        })
    }
}

export const getAllTeams = async (req,res) => {
    try{
        const { departmentId } = req.params

        if(!departmentId){
            return res.status(400).json({
                message:"credential needed"
            })
        }

        const userId = req.user.userId

        const checkDept = await prisma.department.findUnique({
            where:{
                id:departmentId
            }
        })

        if(!checkDept){
            return res.status(404).json({
                message:"Department Not Found"
            })
        }

        const checkUser = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId:checkDept.workspaceId,
                    userId
                }
            }
        })

        if(!checkUser){
            return res.status(403).json({
                message:"You are not a member of this workspace"
            })
        }

        const getAllDept = await prisma.team.findMany({
            where:{
                departmentId,
                is_deleted:false
            },
            orderBy:{
                createdAt:"desc"
            }
        })

        if(getAllDept.length == 0){
            return res.status(200).json({
                message:"No Teams found",
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
            message:"Internal Server error during get all teams"
        })
    }
}

export const updateTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        let { name, leaderId, is_deleted } = req.body;
        const currentUserId = req.user.userId;

        if (!teamId) {
            return res.status(400).json({
                message: "Team ID is required"
            });
        }

        const team = await prisma.team.findUnique({
            where: {
                id: teamId
            }
        });

        if (!team) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        const department = await prisma.department.findUnique({
            where: {
                id: team.departmentId
            }
        });

        if (!department) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        const currentUser = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId: department.workspaceId,
                    userId: currentUserId
                }
            }
        });

        if (!currentUser) {
            return res.status(403).json({
                message: "You are not a member of this workspace"
            });
        }

        if (currentUser.sys_role !== "owner" && currentUser.sys_role !== "manager") {
            return res.status(403).json({
                message: "Only owner and manager can update teams"
            });
        }

        if (name) {
            name = name.trim();

            const existingTeam = await prisma.team.findFirst({
                where: {
                    departmentId: team.departmentId,
                    name,
                    id: {
                        not: teamId
                    }
                }
            });

            if (existingTeam) {
                return res.status(409).json({
                    message: "Team name already exists"
                });
            }
        }

        const updateData = {};

        if (name) {
            updateData.name = name;
        }

        if (typeof is_deleted === "boolean") {
            updateData.is_deleted = is_deleted;

            updateData.deletedAt = is_deleted
                ? new Date()
                : null;
        }       

        console.log(department.workspaceId);
        console.log(leaderId);

const leaderMembership =
    await prisma.workspaceMember.findUnique({
        where: {
            workspaceId_userId: {
                workspaceId: department.workspaceId,
                userId: leaderId
            }
        }
    });

        console.log(leaderMembership);

        await prisma.$transaction(async (tx) => {

            if (leaderId) {
                console.log(department.workspaceId);
                console.log(leaderId);

                const leaderMembership = await tx.workspaceMember.findUnique({
                        where: {
                            workspaceId_userId: {
                                workspaceId: department.workspaceId,
                                userId: leaderId
                            }
                        }
                }); 

                console.log(leaderMembership);

                if (!leaderMembership) {
                    throw new Error("LEADER_NOT_FOUND");
                }

                if (leaderMembership.sys_role === "owner") {
                    throw new Error("OWNER_CANNOT_BE_TEAM_LEAD");
                }

                await tx.workspaceMember.update({
                    where: {
                        workspaceId_userId: {
                            workspaceId: department.workspaceId,
                            userId: leaderId
                        }
                    },
                    data: {
                        sys_role: "team_lead"
                    }
                });

                const existingTeamMember = await tx.teamMember.findUnique({
                        where: {
                            teamId_memberId: {
                                teamId,
                                memberId: leaderId
                            }
                        }
                    });

                if (!existingTeamMember) {
                    await tx.teamMember.create({
                        data: {
                            teamId,
                            memberId: leaderId
                        }
                    });
                }

                updateData.leaderId = leaderId;
            }

            await tx.team.update({
                where: {
                    id: teamId
                },
                data: updateData
            });
        });

        const updatedTeam = await prisma.team.findUnique({
            where: {
                id: teamId
            }
        });

        return res.status(200).json({
            message: "Team updated successfully",
            data: updatedTeam
        });

    } catch (err) {

        // if (err.message === "LEADER_NOT_FOUND") {
        //     return res.status(404).json({
        //         message: "Selected team leader not found in workspace"
        //     });
        // }

        if (err.message === "OWNER_CANNOT_BE_TEAM_LEAD") {
            return res.status(400).json({
                message: "Owner cannot be assigned as team leader"
            });
        }

        console.error(err);

        return res.status(500).json({
            message: "Internal server error during team update"
        });
    }
};

export const deleteTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const currentUserId = req.user.userId;

        if (!teamId) {
            return res.status(400).json({
                message: "Team ID is required"
            });
        }

        const team = await prisma.team.findUnique({
            where: {
                id: teamId
            }
        });

        if (!team || team.is_deleted) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        const department = await prisma.department.findUnique({
            where: {
                id: team.departmentId
            }
        });

        if (!department) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        const currentUser = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId: department.workspaceId,
                    userId: currentUserId
                }
            }
        });

        if (!currentUser) {
            return res.status(403).json({
                message: "You are not a member of this workspace"
            });
        }

        if (currentUser.sys_role !== "owner") {
            return res.status(403).json({
                message: "Only owner can delete teams"
            });
        }

        const memberCount = await prisma.teamMember.count({
            where: {
                teamId
            }
        });

        if (memberCount > 0) {
            return res.status(409).json({
                message: "Cannot delete team because it contains team members"
            });
        }

        const deletedTeam = await prisma.team.update({
            where: {
                id: teamId
            },
            data: {
                is_deleted: true,
                deletedAt: new Date()
            }
        });

        return res.status(200).json({
            message: "Team deleted successfully",
            data: deletedTeam
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error during team deletion"
        });
    }
};

export const addTeamMember = async (req,res) => {
    try{
        const { teamId } = req.params
        const { memberId } = req.body

        if(!teamId || !memberId){
            return res.status(400).json({
                message:"credential needed"
            })
        }

        const currentUserId = req.user.userId;

        const team = await prisma.team.findUnique({
            where: {
                id: teamId
            }
        });

        if (!team || team.is_deleted) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        const department = await prisma.department.findUnique({
            where: {
                id: team.departmentId
            }
        });

        if (!department) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        const currentUser = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId: department.workspaceId,
                    userId: currentUserId
                }
            }
        });

        if (!currentUser) {
            return res.status(403).json({
                message: "You are not a member of this workspace"
            });
        }

        if (currentUser.sys_role === "employee") {
            return res.status(403).json({
                message: "Only Owner and Manager can add teamMembers"
            });
        }

        if(currentUserId === memberId){
            return res.status(400).json({
                message:"You cannot add yourself"
            })
        }

        const existingMember = await prisma.teamMember.findUnique({
            where: {
                teamId_memberId: {
                    teamId,
                    memberId
                }
            }
        });

        if (existingMember) {
            return res.status(409).json({
                message: "Member already exists in this team"
            });
        }

        const checkTargetUser = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId:department.workspaceId,
                    userId:memberId
                }
            }
        })
        

        if(!checkTargetUser){
            return res.status(404).json({
                message:"Target Member not found"
            })
        }

        if(checkTargetUser.sys_role === "manager" || checkTargetUser.sys_role === "owner" || checkTargetUser.sys_role === "team_lead"){
            return res.status(403).json({
                message:"Target User can not be TeamLead or Owner or Manager"
            })
        }

        const addTeamMember = await prisma.teamMember.create({
            data:{
                teamId,
                memberId
            }
        })

        return res.status(201).json({
            message:"Team member added successfully",
            teamMember:addTeamMember
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server error during Adding Team Member"
        })
    }
}

export const getTeamMembers = async (req, res) => {
    try {
        const { teamId } = req.params;
        const currentUserId = req.user.userId;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (!teamId) {
            return res.status(400).json({
                message: "Team ID is required"
            });
        }

        const team = await prisma.team.findUnique({
            where: {
                id: teamId
            }
        });

        if (!team || team.is_deleted) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        const department = await prisma.department.findUnique({
            where: {
                id: team.departmentId
            }
        });

        if (!department) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        const currentUser = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId: department.workspaceId,
                    userId: currentUserId
                }
            }
        });

        if (!currentUser) {
            return res.status(403).json({
                message: "You are not a member of this workspace"
            });
        }

        if (currentUser.sys_role === "employee") {
            const checkTeamEmployee = await prisma.teamMember.findUnique({
                where: {
                    teamId_memberId: {
                        teamId,
                        memberId: currentUserId
                    }
                }
            });

            if (!checkTeamEmployee) {
                return res.status(403).json({
                    message: "You are not allowed to see other team members' details"
                });
            }
        }

        const totalMembers = await prisma.teamMember.count({
            where: {
                teamId
            }
        });

        const members = await prisma.teamMember.findMany({
            where: {
                teamId
            },
            include: {
                member: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
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
                members.length > 0
                    ? "Team members fetched successfully"
                    : "This team does not have any members",
            pagination: {
                total: totalMembers,
                page,
                limit,
                totalPages: Math.ceil(totalMembers / limit)
            },
            count: members.length,
            data: members
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error while getting team members"
        });
    }
};

export const removeTeamMember = async (req,res) => {
    try{
        const { teamId } = req.params
        const { memberId } = req.body

        if(!teamId || !memberId){
            return res.status(400).json({
                message:"credential needed"
            })
        }

        const currentUserId = req.user.userId;

        const team = await prisma.team.findUnique({
            where: {
                id: teamId
            }
        });

        if (!team || team.is_deleted) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        const department = await prisma.department.findUnique({
            where: {
                id: team.departmentId
            }
        });

        if (!department) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        const currentUser = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId: department.workspaceId,
                    userId: currentUserId
                }
            }
        });

        if (!currentUser) {
            return res.status(403).json({
                message: "You are not a member of this workspace"
            });
        }

        if (currentUser.sys_role !== "owner" && currentUser.sys_role !== "manager") {
            return res.status(403).json({
                message: "Only Owner and Manager can remove teamMembers"
            });
        }

        const checkTargetUser = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId:department.workspaceId,
                    userId:memberId
                }
            }
        })
        

        if(!checkTargetUser){
            return res.status(404).json({
                message:"Target Member not found"
            })
        }

        const existingMember = await prisma.teamMember.findUnique({
            where: {
                teamId_memberId: {
                    teamId,
                    memberId
                }
            }
        });

        if (!existingMember) {
            return res.status(404).json({
                message: "Member not  exists in this team"
            });
        }


        if(checkTargetUser.sys_role === "manager" || checkTargetUser.sys_role === "owner"){
            return res.status(403).json({
                message:"Target User can not be TeamLead or Owner or Manager"
            })
        }

        const removeTeamMember = await prisma.teamMember.delete({
            where:{
                teamId_memberId:{
                    teamId,
                    memberId
                }
            }
        })

        return res.status(201).json({
            message:"Team member removed successfully",
            teamMember:removeTeamMember
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server error during removing Team Member"
        })
    }
}

export const getWorkspaceTeams = async (req, res) => {
    try {

        const { workspaceId } = req.params;
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

        const teams = await prisma.team.findMany({

        where: {
            is_deleted: false,
            department: {
                workspaceId
            }
        },

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
                avatar: true
            }
        },

        _count: {
            select: {
                teamMembers: true,
                teamProjects: true
            }
        },

        teamProjects: {
    include: {
        projectDepartment: {
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                        status: true
                    }
                }
            }
        }
    }
}

    },

    orderBy: {
        createdAt: "asc"
    }

});

        return res.status(200).json({

            message: "Workspace teams fetched successfully",

            data: teams.map(team => ({

    id: team.id,

    name: team.name,

    department: team.department,

    leader: team.leader,

    members: team._count.teamMembers,

    projects: team.teamProjects.length,

    createdAt: team.createdAt

}))

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            message: "Internal Server Error while fetching workspace teams"

        });

    }
};

export const teamDashboard = async (req, res) => {
    try {

        const { teamId } = req.params;
        const userId = req.user.userId;

        if (!teamId) {
            return res.status(400).json({
                message: "Team ID is required"
            });
        }

        const team = await prisma.team.findUnique({
            where: {
                id: teamId
            },
            include: {

                department: {
                    include: {
                        workspace: {
                            select: {
                                id: true,
                                name: true,
                                slug: true
                            }
                        }
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
        });

        if (!team || team.is_deleted) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        const workspaceMember =
            await prisma.workspaceMember.findUnique({
                where: {
                    workspaceId_userId: {
                        workspaceId: team.department.workspaceId,
                        userId
                    }
                }
            });

        if (!workspaceMember) {
            return res.status(403).json({
                message: "You are not a member of this workspace"
            });
        }

        const members = await prisma.teamMember.findMany({
            where: {
                teamId
            },
            include: {
                member: {
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

        const projectTeams = await prisma.projectTeam.findMany({

            where: {
                teamId
            },

            include: {

                projectDepartment: {

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

                },

                tasks: {

                    where: {
                        is_deleted: false
                    },

                    select: {
                        id: true,
                        title: true,
                        status: true,
                        priority: true,
                        progress: true,
                        dueDate: true
                    }

                }

            }

        });

        const tasks = projectTeams.flatMap(
            item => item.tasks
        );

        const projects = projectTeams.map(item => ({
            id: item.projectDepartment.project.id,
            name: item.projectDepartment.project.name,
            status: item.projectDepartment.project.status,
            startDate: item.projectDepartment.project.startDate,
            dueDate: item.projectDepartment.project.dueDate
        }));

        const completedTasks =
            tasks.filter(
                task => task.status === "done"
            ).length;

        const pendingTasks =
            tasks.filter(
                task => task.status === "pending"
            ).length;

        const inProgressTasks =
            tasks.filter(
                task => task.status === "in_progress"
            ).length;

        const completionRate =
            tasks.length === 0
                ? 0
                : Math.round(
                    (completedTasks / tasks.length) * 100
                );

        return res.status(200).json({

            message: "Team dashboard fetched successfully",

            data: {

                team: {

                    id: team.id,

                    name: team.name,

                    createdAt: team.createdAt,

                    leader: team.leader,

                    department: {

                        id: team.department.id,

                        name: team.department.name

                    },

                    workspace: team.department.workspace

                },

                statistics: {

                    members: members.length,

                    projects: projects.length,

                    tasks: tasks.length,

                    completedTasks,

                    pendingTasks,

                    inProgressTasks,

                    completionRate

                },

                members: members.map(member => ({

                    id: member.member.id,

                    name: member.member.name,

                    email: member.member.email,

                    avatar: member.member.avatar,

                    joinedAt: member.joinedAt,

                    role:
                        team.leaderId === member.member.id
                            ? "team_lead"
                            : "member"

                })),

                projects,

                tasks

            }

        });

    }
    catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error while fetching team dashboard"
        });

    }
};

export const getAvailableLeaders = async (req, res) => {
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
                workspaceId: true
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

        const leaders =
            await prisma.workspaceMember.findMany({

                where: {
                    workspaceId: department.workspaceId,
                    sys_role: {
                        in: [
                            "owner",
                            "manager",
                            "team_lead"
                        ]
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

        return res.status(200).json({

            message: "Available leaders fetched successfully",

            data: leaders.map(member => ({

                id: member.user.id,

                name: member.user.name,

                email: member.user.email,

                avatar: member.user.avatar,

                currentRole: member.sys_role

            }))

        });

    }
    catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error while fetching leaders"
        });

    }
};