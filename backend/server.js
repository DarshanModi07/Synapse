import dotenv from "dotenv"
import { createServer } from "http"
import app from "./app.js"
import { initSocket } from "./src/socket/socket.js"
import { connectRedis } from "./src/config/redis.js";
import { initSchedulers } from "./src/cron/notificationSchedulers.js";


dotenv.config({
    path: "./backend/.env"
});

console.log(process.cwd());

const PORT = process.env.PORT || 8080
const httpServer = createServer(app)

initSocket(httpServer)
await connectRedis();
initSchedulers();

httpServer.listen(PORT, () => {
    console.log("connected to PORT : ", PORT)
})