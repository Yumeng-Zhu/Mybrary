const express = require('express')
const app = express()
app.use(express.static("public")) //use the static content in the 'public' folder
app.use(express.urlencoded({ extended:true}))// this line enable expree to access url and reteive data
app.use(express.json())//json info

app.set("view engine","ejs")

app.use(logger)//includ all the functions you want here

app.get('/',logger, (req,res) =>{ //yumeng found only one res.function may work each time
    console.log('here') //send in the console log to prove this code has been run
    // res.send('Hi') //send to the user(through browser), just for check, generally more specific
    // res.sendStatus(500)
    // res.status(500).send('Hi')
    // res.status(500).json({message:"Error"}) //this function can send json to your clients(such as API)
    // res.json({message:"Error"})
    // res.render('index',{text:"Wrold"})//passdown to index.ejs(view)
    res.render('index',{text:"Wrold"})//passdown to index.ejs(view)
    // res.download("server.js")//download a file
}) //path (route path), function (req,res,next), a request, a response. next is used in middleware, such as logger, param

//users routes
const userRouter = require('./routes/users')//once there is a new router file in the routes folder, then you can add two new lines reagrding "const" and "app.use"

app.use('/users',userRouter)

function logger(req, res, next){
    console.log(req.originalUrl)
    next()
}//print the log

app.listen(3000)
