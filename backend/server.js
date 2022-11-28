const express = require('express')
const dotenv = require('dotenv');
const cors = require('cors')
require('./database')
dotenv.config({path:"./.env"})
const postRoute = require('./rotues/post')

const app = express();
app.use(express.json())
// const cosrOptions = "http://localhost:5000/"
const corsOptions = {
    origin: process.env.CLIENT,
    credentials: true
}
app.use(express.json())

app.use(cors(corsOptions))

app.use('/api/post', postRoute)

app.get('/',(req,res)=>{
    res.end("in main me sb shi ho gya")
})

app.listen(process.env.PORT,()=>{
    console.log(`node server started on PORT Number ${process.env.PORT}`);
})