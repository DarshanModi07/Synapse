import dotenv from "dotenv";
import { createServer } from "http";

dotenv.config();

const { default: app } = await import("./app.js");
const { initSocket } = await import("./src/socket/socket.js");
const { connectRedis } = await import("./src/config/redis.js");
const { initSchedulers } = await import("./src/cron/notificationSchedulers.js");

const PORT = process.env.PORT || 8080;

const httpServer = createServer(app);

initSocket(httpServer);

await connectRedis();
initSchedulers();

httpServer.listen(PORT, () => {
    console.log("Connected to PORT:", PORT);
});