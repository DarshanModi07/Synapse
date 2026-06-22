import dotenv from "dotenv"
import { createServer } from "http"
import app from "./app.js"
import { initSocket } from "./src/socket/socket.js"

dotenv.config({
    path: "./backend/.env"
});

console.log(process.cwd());

const PORT = process.env.PORT || 8080
const httpServer = createServer(app)

initSocket(httpServer)

httpServer.listen(PORT, () => {
    console.log("connected to PORT : ", PORT)
})