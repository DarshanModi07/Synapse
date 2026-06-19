import cookieParser from "cookie-parser"
import express from "express"
import router from "./src/routes/index.routes.js"
const app = express()

app.use(express.json());
app.use(cookieParser())
app.use(router)
    
app.get('/',(req,res)=>{
    res.status(200).json({message:"Welcome to the API"})
})

export default app