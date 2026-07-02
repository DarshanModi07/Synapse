import {buildDepartmentPrompt} from "./prompts/department.prompt.js";
import { buildTeamPrompt } from "./prompts/team.prompt.js";
import { buildSubTaskPrompt } from "./prompts/subtask.prompt.js";
import { buildWorkItemPrompt } from "./prompts/workitem.prompt.js";
import { buildReviewPrompt } from "./prompts/review.prompt.js";
import {generateSuggestion} from "./ai.service.js";
import { buildTaskPrompt } from "./prompts/task.prompt.js";
import prisma from "../DB/db.config.js";

export const suggestDepartments = async(req,res)=>{
    try{
        const { workspaceId } = req.body;
        const userId = req.user.userId

        if(!workspaceId){
            return res.status(400).json({
                message:"Credentials needed"
            });
        }

        const workspace = await prisma.workspace.findUnique({
            where: {
                id: workspaceId
            },
            select: {
                name: true,
                description: true
            }
        });

        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found"
            });
        }

        const checkUser = await prisma.workspaceMember.findUnique({
            where:{
                workspaceId_userId:{
                    workspaceId,
                    userId
                }
            }
        })

        if(!checkUser || checkUser.sys_role !== "owner"){
            return res.status(403).json({
                message:"You are not allowed to do this"
            });
        }

        const prompt = buildDepartmentPrompt(
                workspace.name,
                workspace.description
            );

        const response = await generateSuggestion(
                prompt
            );

        const cleaned = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsed = JSON.parse(cleaned);

        return res.status(200).json({
            message:"Suggestions generated",
            data:parsed
        });

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message: "AI Suggestion Failed"
        });
    }
}

export const suggestTeams = async (req, res) => {
    try {

        const { departmentId } = req.body;
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
                workspace: {
                    select: {
                        id: true,
                        name: true
                    }
                }
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
                message: "Only workspace owner can generate team suggestions"
            });
        }

        const existingTeams = await prisma.team.findMany({
            where: {
                departmentId,
                is_deleted: false
            },
            select: {
                name: true
            }
        });

        const prompt = buildTeamPrompt({

            workspaceName: department.workspace.name,

            departmentName: department.name,

            existingTeams:
                existingTeams.map(team => team.name)

        });

        const response = await generateSuggestion(prompt);

        const cleaned = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsed = JSON.parse(cleaned);

        if (
            !parsed ||
            !Array.isArray(parsed.teams)
        ) {
            return res.status(500).json({
                message: "Invalid AI response format"
            });
        }

        return res.status(200).json({
            message: "Suggestions generated",
            data: parsed
        });

    }
    catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "AI Suggestion Failed"
        });

    }
};

export const suggestTasks = async (req, res) => {
    try {
        const { projectTeamId } = req.body;

        if (!projectTeamId) {
            return res.status(400).json({
                message: "Credentials needed"
            });
        }

        const projectTeam = await prisma.projectTeam.findUnique({
            where: { id: projectTeamId },
            include: {
                team: {
                    include: {
                        department: true,
                        teamMembers: {
                            include: { member: true }
                        }
                    }
                },
                projectDepartment: {
                    include: { project: true }
                }
            }
        })

        if (!projectTeam) {
            return res.status(404).json({
                message: "ProjectTeam not found"
            });
        }

        const userId = req.user.userId
        const workspaceId = projectTeam.team.department.workspaceId

        const membership = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: { workspaceId, userId }
            }
        })

        if (!membership) {
            return res.status(404).json({
                message: "You are not a member of this workspace"
            });
        }

        if (membership.sys_role !== "manager" && membership.sys_role !== "owner") {
            return res.status(403).json({
                message: "You are not allowed to do this"
            });
        }

        const memberWorkspaceRoles = await prisma.workspaceMember.findMany({
            where: {
                workspaceId,
                userId: { in: projectTeam.team.teamMembers.map(tm => tm.member.id) }
            }
        })

        const teamMembers = projectTeam.team.teamMembers.map(tm => {
            const wm = memberWorkspaceRoles.find(w => w.userId === tm.member.id)
            return {
                name: tm.member.name,
                work_role: wm?.work_role ?? "member"
            }
        })

        const prompt = buildTaskPrompt({
            projectName: projectTeam.projectDepartment.project.name,
            projectDescription: projectTeam.projectDepartment.project.description,
            departmentName: projectTeam.team.department.name,
            teamName: projectTeam.team.name,
            teamMembers
        })

        const response = await generateSuggestion(prompt)

        const cleaned = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsed = JSON.parse(cleaned)

        return res.status(200).json({
            message: "Suggestions generated",
            data: parsed
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "AI Suggestion Failed"
        });
    }
}

export const suggestSubTasks = async(req,res)=>{
    try{
        const { taskId } = req.body;

        if(!taskId){
            return res.status(400).json({
                message:"Credentials needed"
            });
        }

        const task = await prisma.task.findUnique({
            where:{
                id:taskId
            },
            include:{
                projectTeam:{
                    include:{
                        team:{
                            include:{
                                department:true,
                                teamMembers:{
                                    include:{
                                        member:true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if(!task){
            return res.status(404).json({
                message:"Task not found"
            });
        }

        const userId = req.user.userId
        const teamLeaderId = task.projectTeam.team.leaderId

        if(teamLeaderId !== userId){
            return res.status(403).json({
                message:"You are not allowed to do this"
            });
        }

        const workspaceId = task.projectTeam.team.department?.workspaceId

        const memberWorkspaceRoles = await prisma.workspaceMember.findMany({
            where:{
                workspaceId,
                userId:{ in: task.projectTeam.team.teamMembers.map(tm => tm.member.id) }
            }
        })

        const teamMembers = task.projectTeam.team.teamMembers.map(tm => {
            const wm = memberWorkspaceRoles.find(w => w.userId === tm.member.id)
            return {
                id: tm.member.id,
                name: tm.member.name,
                work_role: wm?.work_role ?? "member"
            }
        })

        if(teamMembers.length === 0){
            return res.status(400).json({
                message:"This team has no members yet"
            });
        }

        const prompt = buildSubTaskPrompt({
                taskTitle:task.title,
                taskDescription:task.description,
                teamMembers
        });

        const response = await generateSuggestion(
                prompt
            );

        const cleaned = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsed = JSON.parse(cleaned);

        return res.status(200).json({
            message:"Suggestions generated",
            data:parsed
        });

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message: "AI Suggestion Failed"
        });
    }
}

export const suggestWorkItems = async(req,res)=>{
    try{
        const { subTaskId } = req.body;

        if(!subTaskId){
            return res.status(400).json({
                message:"Credentials needed"
            });
        }

        const subtask = await prisma.subTask.findUnique({
            where:{
                id:subTaskId
            },
            include:{
                task:{
                    include:{
                        projectTeam:{
                            include:{
                                team:true
                            }
                        }
                    }
                }
            }
        })

        if(!subtask){
            return res.status(404).json({
                message:"SubTask not found"
            });
        }

        const userId = req.user.userId
        const isAssignee = subtask.assignedToId === userId
        const isTeamLead = subtask.task.projectTeam.team.leaderId === userId

        if(!isAssignee && !isTeamLead){
            return res.status(403).json({
                message:"You are not allowed to do this"
            });
        }

        const prompt = buildWorkItemPrompt({
                subtaskTitle:subtask.title,
                subtaskDescription:subtask.description
        });

        const response = await generateSuggestion(
                prompt
            );

        const cleaned = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsed = JSON.parse(cleaned);

        return res.status(200).json({
            message:"Suggestions generated",
            data:parsed
        });

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message: "AI Suggestion Failed"
        });
    }
}

export const suggestReview = async(req,res)=>{
    try{
        const { subTaskId } = req.body;

        if(!subTaskId){
            return res.status(400).json({
                message:"Credentials needed"
            });
        }

        const subtask = await prisma.subTask.findUnique({
            where:{
                id:subTaskId
            },
            include:{
                task:{
                    include:{
                        projectTeam:{
                            include:{
                                team:true
                            }
                        }
                    }
                },
                workItems:true
            }
        })

        if(!subtask){
            return res.status(404).json({
                message:"SubTask not found"
            });
        }

        const userId = req.user.userId
        const teamLeaderId = subtask.task.projectTeam.team.leaderId

        if(teamLeaderId !== userId){
            return res.status(403).json({
                message:"You are not allowed to do this"
            });
        }

        if(subtask.workItems.length === 0){
            return res.status(400).json({
                message:"No work items submitted yet"
            });
        }

        const prompt = buildReviewPrompt({
                subtaskTitle:subtask.title,
                subtaskDescription:subtask.description,
                workItems:subtask.workItems
        });

        const response = await generateSuggestion(
                prompt
            );

        const cleaned = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsed = JSON.parse(cleaned);

        return res.status(200).json({
            message:"Suggestions generated",
            data:parsed
        });

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message: "AI Suggestion Failed"
        });
    }
}