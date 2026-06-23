import prisma from "../DB/db.config.js";
import { decrypt } from "../config/encryption.js";

const decryptMessage = (message) => ({
    ...message,
    content: decrypt(message.content),
    replies: message.replies?.map(r => ({
        ...r,
        content: decrypt(r.content)
    })) ?? []
});

export const getMessages = async (req, res) => {
    try {
        const { channelId } = req.params;
        const userId = req.user.userId;
        const { cursor, limit = 30 } = req.query;

        const channel = await prisma.channel.findUnique({
            where: { id: channelId },
            include: {
                team: {
                    include: { teamMembers: true }
                }
            }
        });

        if (!channel || channel.is_deleted) {
            return res.status(404).json({ message: "Channel not found" });
        }

        const isMember = channel.team.teamMembers.some(tm => tm.memberId === userId);
        const isLeader = channel.team.leaderId === userId;

        if (!isMember && !isLeader) {
            return res.status(403).json({ message: "Not a member of this team" });
        }

        const messages = await prisma.message.findMany({
            where: {
                channelId,
                is_deleted: false,
                parentId: null,
                ...(cursor && {
                    createdAt: { lt: new Date(cursor) }
                })
            },
            include: {
                sender: {
                    select: { id: true, name: true, avatar: true }
                },
                messageReactions: {
                    include: {
                        user: { select: { id: true, name: true } }
                    }
                },
                replies: {
                    where: { is_deleted: false },
                    include: {
                        sender: {
                            select: { id: true, name: true, avatar: true }
                        },
                        messageReactions: {
                            include: {
                                user: { select: { id: true, name: true } }
                            }
                        }
                    },
                    orderBy: { createdAt: "asc" }
                },
                _count: { select: { replies: true } }
            },
            orderBy: { createdAt: "desc" },
            take: parseInt(limit)
        });

        const nextCursor = messages.length === parseInt(limit)
            ? messages[messages.length - 1].createdAt.toISOString()
            : null;

        // decrypt all messages and their replies before returning
        const decrypted = messages.map(decryptMessage).reverse();

        return res.status(200).json({
            message: "Messages fetched",
            data: decrypted,
            nextCursor
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getThreadReplies = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.userId;

        const parent = await prisma.message.findUnique({
            where: { id: messageId },
            include: {
                channel: {
                    include: {
                        team: {
                            include: { teamMembers: true }
                        }
                    }
                }
            }
        });

        if (!parent || parent.is_deleted) {
            return res.status(404).json({ message: "Message not found" });
        }

        const isMember = parent.channel.team.teamMembers.some(tm => tm.memberId === userId);
        const isLeader = parent.channel.team.leaderId === userId;

        if (!isMember && !isLeader) {
            return res.status(403).json({ message: "Not a member of this team" });
        }

        const replies = await prisma.message.findMany({
            where: {
                parentId: messageId,
                is_deleted: false
            },
            include: {
                sender: {
                    select: { id: true, name: true, avatar: true }
                },
                messageReactions: {
                    include: {
                        user: { select: { id: true, name: true } }
                    }
                }
            },
            orderBy: { createdAt: "asc" }
        });

        // decrypt each reply before returning
        const decrypted = replies.map(r => ({
            ...r,
            content: decrypt(r.content)
        }));

        return res.status(200).json({
            message: "Replies fetched",
            data: decrypted
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};