import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import prisma from "../DB/db.config.js";

let io;

export const initSocket = (httpServer) => {

    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token;

            if (!token) {
                return next(new Error("Unauthorized"));
            }

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            const user = await prisma.user.findUnique({
                where: { id: decoded.userId }
            });

            if (!user) {
                return next(new Error("Unauthorized"));
            }

            socket.user = {
                userId: user.id,
                name: user.name
            };

            next();

        } catch (err) {
            next(new Error("Unauthorized"));
        }
    });

    io.on("connection", (socket) => {

        console.log(`connected: ${socket.user.userId}`);

        // each user joins their own private room for notifications
        socket.join(socket.user.userId);

        // join a channel room
        // frontend emits this after opening a channel
        socket.on("join_channel", async ({ channelId }) => {
            try {
                const channel = await prisma.channel.findUnique({
                    where: { id: channelId },
                    include: {
                        team: {
                            include: { teamMembers: true }
                        }
                    }
                });

                if (!channel || channel.is_deleted) {
                    socket.emit("error", { message: "Channel not found" });
                    return;
                }

                const isMember = channel.team.teamMembers.some(
                    tm => tm.memberId === socket.user.userId
                );

                const isLeader = channel.team.leaderId === socket.user.userId;

                if (!isMember && !isLeader) {
                    socket.emit("error", { message: "Not a member of this team" });
                    return;
                }

                socket.join(channelId);
                socket.emit("joined_channel", { channelId });

            } catch (err) {
                socket.emit("error", { message: "Failed to join channel" });
            }
        });

        // leave a channel room
        socket.on("leave_channel", ({ channelId }) => {
            socket.leave(channelId);
        });

        // send a message
        socket.on("send_message", async ({ channelId, content, parentId }) => {
            try {
                if (!content?.trim()) {
                    socket.emit("error", { message: "Message cannot be empty" });
                    return;
                }

                const channel = await prisma.channel.findUnique({
                    where: { id: channelId },
                    include: {
                        team: {
                            include: { teamMembers: true }
                        }
                    }
                });

                if (!channel || channel.is_deleted) {
                    socket.emit("error", { message: "Channel not found" });
                    return;
                }

                const isMember = channel.team.teamMembers.some(
                    tm => tm.memberId === socket.user.userId
                );

                const isLeader = channel.team.leaderId === socket.user.userId;

                if (!isMember && !isLeader) {
                    socket.emit("error", { message: "Not a member of this team" });
                    return;
                }

                // announcement channels — only team lead can send
                if (channel.type === "announcement" && !isLeader) {
                    socket.emit("error", { message: "Only team lead can send in announcement channels" });
                    return;
                }

                // if reply, verify parent belongs to same channel
                if (parentId) {
                    const parent = await prisma.message.findUnique({
                        where: { id: parentId }
                    });

                    if (!parent || parent.channelId !== channelId) {
                        socket.emit("error", { message: "Invalid parent message" });
                        return;
                    }
                }

                const message = await prisma.message.create({
                    data: {
                        content: content.trim(),
                        channelId,
                        senderId: socket.user.userId,
                        parentId: parentId ?? null
                    },
                    include: {
                        sender: {
                            select: { id: true, name: true, avatar: true }
                        },
                        parent: {
                            select: { id: true, content: true, senderId: true }
                        }
                    }
                });

                io.to(channelId).emit("new_message", message);

            } catch (err) {
                socket.emit("error", { message: "Failed to send message" });
            }
        });

        // edit a message
        socket.on("edit_message", async ({ messageId, content }) => {
            try {
                if (!content?.trim()) {
                    socket.emit("error", { message: "Message cannot be empty" });
                    return;
                }

                const message = await prisma.message.findUnique({
                    where: { id: messageId }
                });

                if (!message || message.is_deleted) {
                    socket.emit("error", { message: "Message not found" });
                    return;
                }

                if (message.senderId !== socket.user.userId) {
                    socket.emit("error", { message: "You can only edit your own messages" });
                    return;
                }

                const updated = await prisma.message.update({
                    where: { id: messageId },
                    data: {
                        content: content.trim(),
                        is_edited: true,
                        editedAt: new Date()
                    },
                    include: {
                        sender: {
                            select: { id: true, name: true, avatar: true }
                        }
                    }
                });

                io.to(message.channelId).emit("message_edited", updated);

            } catch (err) {
                socket.emit("error", { message: "Failed to edit message" });
            }
        });

        // delete a message
        socket.on("delete_message", async ({ messageId }) => {
            try {
                const message = await prisma.message.findUnique({
                    where: { id: messageId },
                    include: {
                        channel: {
                            include: { team: true }
                        }
                    }
                });

                if (!message || message.is_deleted) {
                    socket.emit("error", { message: "Message not found" });
                    return;
                }

                const isOwner = message.senderId === socket.user.userId;
                const isLeader = message.channel.team.leaderId === socket.user.userId;

                // sender can delete own message, team lead can delete any message
                if (!isOwner && !isLeader) {
                    socket.emit("error", { message: "Not allowed" });
                    return;
                }

                await prisma.message.update({
                    where: { id: messageId },
                    data: {
                        is_deleted: true,
                        deletedBy: socket.user.userId
                    }
                });

                io.to(message.channelId).emit("message_deleted", { messageId, channelId: message.channelId });

            } catch (err) {
                socket.emit("error", { message: "Failed to delete message" });
            }
        });

        // add or remove a reaction (toggle)
        socket.on("toggle_reaction", async ({ messageId, emoji }) => {
            try {
                if (!emoji) {
                    socket.emit("error", { message: "Emoji required" });
                    return;
                }

                const message = await prisma.message.findUnique({
                    where: { id: messageId }
                });

                if (!message || message.is_deleted) {
                    socket.emit("error", { message: "Message not found" });
                    return;
                }

                const existing = await prisma.messageReaction.findUnique({
                    where: {
                        messageId_userId_emoji: {
                            messageId,
                            userId: socket.user.userId,
                            emoji
                        }
                    }
                });

                if (existing) {
                    await prisma.messageReaction.delete({
                        where: { id: existing.id }
                    });

                    io.to(message.channelId).emit("reaction_removed", {
                        messageId,
                        emoji,
                        userId: socket.user.userId
                    });

                } else {
                    await prisma.messageReaction.create({
                        data: {
                            messageId,
                            userId: socket.user.userId,
                            emoji
                        }
                    });

                    io.to(message.channelId).emit("reaction_added", {
                        messageId,
                        emoji,
                        userId: socket.user.userId,
                        userName: socket.user.name
                    });
                }

            } catch (err) {
                socket.emit("error", { message: "Failed to toggle reaction" });
            }
        });

        // typing indicator
        socket.on("typing_start", ({ channelId }) => {
            socket.to(channelId).emit("user_typing", {
                userId: socket.user.userId,
                name: socket.user.name,
                channelId
            });
        });

        socket.on("typing_stop", ({ channelId }) => {
            socket.to(channelId).emit("user_stopped_typing", {
                userId: socket.user.userId,
                channelId
            });
        });

        socket.on("disconnect", () => {
            console.log(`disconnected: ${socket.user.userId}`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) throw new Error("Socket not initialized");
    return io;
};