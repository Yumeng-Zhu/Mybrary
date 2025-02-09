//routers related to users
const express = require("express")
const router = express.Router()

router.use(logger)

//router has all function that app has, e.g. router.get/push
router.get("/",(req,res) => {
    console.log(req.query.name)//if want to fetch sth from url, e.g. localhost:3000/users?name-K. then write console.log(req.query.name)
    res.send('user list')
}) 

router.get("/new", (req, res) => {
    res.render('users/new',{ firstName: "Name for registeration"})
}) 

router.post('/',(req,res) => {
    const isValid = true
    if (isValid){
        users.push({firstName: req.body.firstName})
        res.redirect(`/users/${users.length - 1}`)
    } else {
        console.log("Error")
        res.render("users/new", {firstName: req.body.firstName})
    }
    // console.log(req.body.firstName)
    // res.send('create user')
})//this function works after the POST takes place, e.g. after register

router
    .route("/:id")
    .get((req,res) =>{
        console.log(req.user)
        res.send(`Get user with ID ${req.params.id}`)
    })
    .put((req,res) =>{
        res.send(`Update user with ID ${req.params.id}`)
    })
    .delete((req,res) =>{
        res.send(`Delete user with ID ${req.params.id}`)
    })
    
// router.get('/:id', (req,res) =>{
//     res.send(`Get user with ID ${req.params.id}`)
// }) //get any route that stars with users' id, ":" represent dynamic paramater
// //***note, the code match from top to down, so the dynamic variables should be put at the buttom */

// router.put('/:id', (req,res) =>{
//     res.send(`Update user with ID ${req.params.id}`)
// }) 

// router.delete('/:id', (req,res) =>{
//     res.send(`Delete user with ID ${req.params.id}`)
// }) 

//export routers
const users = [{name: "J"}, {name: "K"}]

router.param("id", (req, res, next, id) => {
    req.user = users[id] //random give user id to users
    next() //move on to the next, after sending id back
})//whenever there is a route related to id, run this. param is a middleware (btw request/..)

function logger(req, res, next){
    console.log(req.originalUrl)
    next()
}//print the log

module.exports = router