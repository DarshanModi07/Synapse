import express from "express";
import {createChannel,getChannels,updateChannel,deleteChannel} from "../controllers/channel.controller.js";
import {getMessages,getThreadReplies} from "../controllers/message.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// channel routes
router.post("/team/:teamId/channel", authMiddleware, createChannel);
router.get("/team/:teamId/channels", authMiddleware, getChannels);
router.patch("/channel/:channelId", authMiddleware, updateChannel);
router.delete("/channel/:channelId", authMiddleware, deleteChannel);

// message routes (REST — only for loading history)
// sending, editing, deleting, reactions → all via socket
router.get("/channel/:channelId/messages", authMiddleware, getMessages);
router.get("/message/:messageId/replies", authMiddleware, getThreadReplies);

export default router;