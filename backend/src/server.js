require('dotenv').config()
const app = require('./app')
const PORT = process.env.PORT || 9090

app.listen(PORT,()=>{
    console.log("connested to PORT : ",PORT)
})