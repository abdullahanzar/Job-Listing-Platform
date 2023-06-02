const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const ejs = require('ejs')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('./public'))
app.set('view engine', 'ejs');

app.get('/', async(req, res)=>{
    res.json({
        Welcome: "TO THE JOB LISTING SERVER",
    })
})


app.listen(process.env.SERVER_PORT, async ()=>{
    try {
       await mongoose.connect(process.env.MONGO_DB);
       console.log("connected successfully")
    }
    catch(e) {
        console.log("could not connect", e)
    }
})
