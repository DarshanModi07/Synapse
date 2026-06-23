import dotenv from "dotenv"
import { createServer } from "http"
import app from "./app.js"
import { initSocket } from "./src/socket/socket.js"
import { connectRedis } from "./src/config/redis.js";


dotenv.config({
    path: "./backend/.env"
});

console.log(process.cwd());

const PORT = process.env.PORT || 8080
const httpServer = createServer(app)

initSocket(httpServer)
await connectRedis();

httpServer.listen(PORT, () => {
    console.log("connected to PORT : ", PORT)
})