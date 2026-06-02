import cookieParser from "cookie-parser"
const express = require('express')
const app = express()

app.use(express.json());
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.send("SynapseOS")
})

module.exports = app