import prisma from "../DB/db.config.js";

export const createChannel = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { name, type } = req.body;
        const userId = req.user.userId;

        if (!name || !type) {
            return res.status(400).json({ message: "Credentials needed" });
        }

        if (!["text", "announcement"].includes(type)) {
            return res.status(400).json({ message: "Invalid channel type" });
        }

        const team = await prisma.team.findUnique({
            where: { id: teamId }
        });

        if (!team || team.is_deleted) {
            return res.status(404).json({ message: "Team not found" });
        }

        if (team.leaderId !== userId) {
            return res.status(403).json({ message: "Only team lead can create channels" });
        }

        const channel = await prisma.channel.create({
            data: { name, type, teamId }
        });

        return res.status(201).json({
            message: "Channel created",
            data: channel
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getChannels = async (req, res) => {
    try {
        const { teamId } = req.params;
        const userId = req.user.userId;

        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: { teamMembers: true }
        });

        if (!team || team.is_deleted) {
            return res.status(404).json({ message: "Team not found" });
        }

        const isMember = team.teamMembers.some(tm => tm.memberId === userId);
        const isLeader = team.leaderId === userId;

        if (!isMember && !isLeader) {
            return res.status(403).json({ message: "Not a member of this team" });
        }

        const channels = await prisma.channel.findMany({
            where: { teamId, is_deleted: false },
            orderBy: { createdAt: "asc" }
        });

        return res.status(200).json({
            message: "Channels fetched",
            data: channels
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateChannel = async (req, res) => {
    try {
        const { channelId } = req.params;
        const { name } = req.body;
        const userId = req.user.userId;

        if (!name) {
            return res.status(400).json({ message: "Credentials needed" });
        }

        const channel = await prisma.channel.findUnique({
            where: { id: channelId },
            include: { team: true }
        });

        if (!channel || channel.is_deleted) {
            return res.status(404).json({ message: "Channel not found" });
        }

        if (channel.team.leaderId !== userId) {
            return res.status(403).json({ message: "Only team lead can update channels" });
        }

        const updated = await prisma.channel.update({
            where: { id: channelId },
            data: { name }
        });

        return res.status(200).json({
            message: "Channel updated",
            data: updated
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteChannel = async (req, res) => {
    try {
        const { channelId } = req.params;
        const userId = req.user.userId;

        const channel = await prisma.channel.findUnique({
            where: { id: channelId },
            include: { team: true }
        });

        if (!channel || channel.is_deleted) {
            return res.status(404).json({ message: "Channel not found" });
        }

        if (channel.team.leaderId !== userId) {
            return res.status(403).json({ message: "Only team lead can delete channels" });
        }

        await prisma.channel.update({
            where: { id: channelId },
            data: { is_deleted: true, deletedAt: new Date() }
        });

        return res.status(200).json({ message: "Channel deleted" });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};