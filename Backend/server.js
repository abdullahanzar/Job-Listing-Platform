const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const ejs = require('ejs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('./public'))
app.set('view engine', 'ejs');
app.use(cors())

const User = mongoose.model('User', {
    name: String,
    email: String,
    mobile: Number,
    password: String,
})

const Job = mongoose.model('Job', {
    companyName: String,
    logoURL: String,
    jobPosition: String,
    monthlySalary: Number,
    jobType: String,
    remoteOffice: Boolean, 
    location: String,
    jobDescrip: String,
    aboutCompany: String,
    skillsRequired: Array,
})

async function authenticate(email, password) {
    const user = await User.findOne({email});
    if(!user)
    return false
    const fetchedPassword = user.password;
    const auth = await bcrypt.compare(password, fetchedPassword);
    if(auth===true)
    return user.name;
    else 
    return false
}

const isAuthenticated = async(req, res, next) => {
    const token = req.headers.token;
    try {
        const verify = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch(e) {
        res.json({error: "Sign In First", err: e})
        return
    }
    next();
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


 
app.post('/register', async (req, res)=>{
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
        res.json({Success: "All Good",
                user: name});
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
        const jwtToken = await jwt.sign({email, password}, process.env.JWT_SECRET_KEY, { expiresIn: 300})
        res.json({
            authentication: true,
            login: "successful",
            token: jwtToken,
            user: authentication
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
            login: "unsuccessful",
            authentication: false
        })
        }
    }
})

app.post('/job', isAuthenticated, async (req, res)=>{
    const {companyName, logoURL, jobPosition, monthlySalary,
        jobType, remoteOffice, location, jobDescrip, aboutCompany, skillsRequired} = req.body;
    if(!companyName || !logoURL || !jobPosition || !monthlySalary || 
        !jobType || !remoteOffice || !location || !jobDescrip || !aboutCompany || !skillsRequired)
    res.json({error: "Body is incomplete."})
    else {
        try {
            await Job.create({companyName, logoURL, jobPosition, monthlySalary,
                jobType, remoteOffice, location, jobDescrip, aboutCompany, skillsRequired})
            res.json({Success: "All Good"})
        }
        catch(e) {
            res.json({error: e})
        }
    }
})

app.get('/job', async(req, res)=>{
    try {
        const found = await Job.find();
        res.json(found)
    }
    catch(e) {
        res.json({error: e})
    }
})

app.get('/job-filter', async(req, res)=>{
    let {filter, description} = req.query;
    if(filter) {
        filter = filter.split(",")
        try {
            const found = await Job.find({"skillsRequired" : { $in : filter}}) 
            res.json(found)}
        catch(e) {res.json({"Filter Unsuccessful": e})}
    }
    else if(description) {
        try {
            const found = await Job.find({"companyName": description})
            res.json({description: found[0].jobDescrip})
        }
        catch(e) {res.json({"Description Unsuccessful" : e})}
    }
    else {
        res.json({error: "Either filter is undefined or is not an array."})
    }
})

app.patch('/job', isAuthenticated, async(req, res)=>{
    const ToBePatched = req.body;
    const filter = {companyName: ToBePatched.companyName,
                    jobPosition: ToBePatched.jobPosition,
    }
    try {
        await Job.findOneAndUpdate(filter, ToBePatched)
    }
    catch(e) {
        res.json({error: e});
        return;
    }
    res.json({Update: "Successful"})
})

app.use('/', (req, res)=>{
    res.status(404);
    res.send({
        error: "URL NOT FOUND"
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
