//routes = controller in MVX
const express = require('express')
const router = express.Router()
const Author = require('../models/authors')
// const { error } = require('console')

//all authors' route
router.get('/', async (req,res) => { //get use 'query', post use 'body'
    let searchOptions = {}
    if (req.query.name != null && req.query.name != ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try{
        const authors = await Author.find(searchOptions)
        res.render('authors/index', {
            authors: authors,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
    console.log("Search Options:", searchOptions);
})

//new author
router.get('/new', (req,res) => {
    res.render('authors/new', { author: new Author()})
})

// create author route
router.post('/', async (req,res) => {
    const author = new Author({
        name: req.body.name //tell the sever which stuff we want to receive from routers
    })
    try {
        const newAuthor = await author.save()
        res.redirect('authors') //this is where the bug, identidy the redirect and render
    } catch {
        res.render('authors/new',{
            author: author,
            errorMessage:'Error Creating Author...'
        }) // the try-catch is called asyn/await in Mongoose. It function equals to if-else but easier to read
    }
    // author.save().
    // then((newAuthor)=>{
    //     res.render('authors')
    // }).
    // catch((err)=>{
    //     res.render('authors/new',{
    //         author: author,
    //         errorMessage:'Error Creating Author...'
    //     })
    // })
})
    // res.send(req.body.name) //same with _form_fields's name

module.exports = router