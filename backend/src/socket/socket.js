import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import prisma from "../DB/db.config.js";
import { encrypt, decrypt } from "../config/encryption.js";

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: [
                "http://localhost:5173",
                "https://synapse-enterprise.vercel.app",
            ],
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token;

            if (!token) {
                return next(new Error("Unauthorized"));
            }

            const decoded = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET
            );

            const user = await prisma.user.findUnique({
                where: {
                    id: decoded.userId,
                },
            });

            if (!user) {
                return next(new Error("Unauthorized"));
            }

            socket.user = {
                userId: user.id,
                name: user.name,
            };

            next();
        } catch (error) {
            next(new Error("Unauthorized"));
        }
    });

    io.on("connection", (socket) => {
        console.log("CONNECTED:", socket.id);

        socket.join(socket.user.userId);

        console.log(
            "JOINED ROOM:",
            socket.user.userId
        );
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket not initialized");
    }

    return io;
};