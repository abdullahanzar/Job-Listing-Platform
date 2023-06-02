const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const ejs = require('ejs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('./public'))
app.set('view engine', 'ejs');

const User = mongoose.model('User', {
    name: String,
    email: String,
    mobile: Number,
    password: String,
})

async function authenticate(email, password) {
    const user = await User.findOne({email});
    if(!user)
    return false
    const fetchedPassword = user.password;
    const auth = await bcrypt.compare(password, fetchedPassword);
    console.log(auth)
    if(auth===true)
    return true
    else 
    return false
}

app.get('/', async(req, res)=>{
    res.json({
        Welcome: "TO THE JOB LISTING SERVER",
        'Server-Health': "OK. Go to /health to check more details."
    })
})

app.get('/health', (req, res)=>{
    if(mongoose.connection.readyState==1)
    res.json({
        "Server-Health" : "Everything is Perfect"
    })
    else 
    res.json({
        "Server-Health" : "There is some problem connecting to the database"
    })
})


 
app.post('/signup', async (req, res)=>{
    const {name, email, mobile, password} = req.body;
    if(await User.findOne({email: email})) {
        res.json({error: "user already exists"})
    }
    else if(!email || !name || !mobile || !password) {
        res.json({error: "sent empty body"})
    }
    else {
    try {
        const encryptedPassword = await bcrypt.hash(password, 5)
        await User.create({
            name,
            email,
            mobile,
            password: encryptedPassword,
        })
        res.json("All Good");
    }
    catch (e) {
        res.json({error: e});
    }
    }
}
)

app.post('/login', async (req, res)=>{
    const {email, password} = req.body;
    if(!email || !password) {
        res.json({error: "sent empty body"})
    }
    else {
    const authentication = await authenticate(email, password);
    if(authentication) {
        try {
        const jwtToken = await jwt.sign({email, password}, process.env.JWT_SECRET_KEY, { expiresIn: 120})
        console.log(jwtToken)
        res.json({
            authentication: true,
            token: jwtToken
        })
        }
        catch(e) {
            res.json({
                error: e
            })
    }
    }
    else {
        res.json({
            error: "Authentication failed",
            authentication: false
        })
        }
    }
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
