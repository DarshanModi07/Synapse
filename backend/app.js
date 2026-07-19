import cookieParser from "cookie-parser"
import express from "express"
import router from "./src/routes/index.routes.js"
import cors from "cors"
const app = express()

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser())

app.use(router)
    
app.get('/',(req,res)=>{
    res.status(200).json({message:"Welcome to the API"})
})

export default app