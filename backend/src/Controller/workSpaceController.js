import prisma from "../DB/db.config.js" 
import { SysRole } from "@prisma/client";
import slugify from "slugify";

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

