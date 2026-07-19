import cookieParser from "cookie-parser";
import express from "express";
import router from "./src/routes/index.routes.js";
import cors from "cors";

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.FRONTEND_URL,
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.use(router);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Synapse API",
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Synapse API Running",
        environment: process.env.NODE_ENV,
    });
});

export default app;