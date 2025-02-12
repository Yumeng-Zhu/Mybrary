//routes = controller in MVX
const express = require('express')
const router = express.Router()
const Author = require('../models/authors')
const Book = require('../models/books')
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
    // console.log("Search Options:", searchOptions);
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
        res.redirect(`authors/${author.id}`) //this is where the bug, identidy the redirect and render
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

router.get('/:id', async (req,res) => {//variable: id， the ge('/new') MUST BE ABOVE THIS, or the id = 'new'
    try{
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author : author.id}).limit(6).exec()
        //In Mongoose, .exec() is used to explicitly execute a query and return a Promise instead of using a callback
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch{ //'catch (err){ 'can be used to debug
        // console.log(err)
        res.redirect('/')
    }
}) 

router.get('/:id/edit',async(req,res) => {
    try{
        const author = await Author.findById(req.params.id) //mangodb function findById
        res.render('authors/edit', { author: author})
        // console.log(author)
    } catch{
        res.redirect('/authors')
    }
})

router.put('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`) //this is where the bug, identidy the redirect and render
    } catch {
        if (author == null){
            res.redirect('/')
        } else{
            res.render('authors/edit',{
                author: author,
                errorMessage:'Error Updating Author...'
            })
        }
    }
})

router.delete('/:id', async(req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        // console.log('found successfully', req.params.id)
        await author.deleteOne()
        // console.log('removed successfully')
        res.redirect('/authors') //this is where the bug, identidy the redirect and render
    } catch {
        if (author == null){
            res.redirect('/')
        } else{
            res.redirect(`/authors/${author.id}`)
            // console.log('failed to delete')
        }
    }
})//do not use get when you deleting data! The google may go into all 'get', so use 'form'+method-overwrite

// router.delete('/:id', async (req, res) => {
//     try {
//         // Find the author
//         const author = await Author.findById(req.params.id);
//         if (!author) {
//             console.log('Author not found:', req.params.id);
//             return res.redirect('/authors'); // Redirect if author does not exist
//         }

//         // Delete the author
//         await author.deleteOne(); // Ensure middleware allows deletion
//         console.log('Author removed successfully:', req.params.id);

//         // Redirect to authors list after successful deletion
//         res.redirect('/authors');
//     } catch (error) {
//         console.error('Error deleting author:', error.message);

//         // Redirect back to the author page if deletion fails
//         res.redirect(`/authors/${req.params.id}`);
//     }
// });


module.exports = router