import dotenv from "dotenv"
import app from "./app.js"

const PORT = process.env.PORT || 8080

dotenv.config({
    path: "./backend/.env"
});

console.log(process.cwd());

app.listen(PORT,()=>{
    console.log("connected to PORT : ",PORT)
})