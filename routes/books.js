//routes = controller in MVX
const express = require('express')
const router = express.Router()
// const multer = require('multer')
// const path = require('path')
// const fs = require('fs')//fs = file systems
const Book = require('../models/books')
const Author = require ('../models/authors')
// const uploadPath = path.join('public', Book.coverImageBasePath)
// const { error } = require('console')
const imageMimeTypes = ['image/jpeg','image/png','image/gif'] //the types of file accepted
// const upload = multer({
//     dest: uploadPath,//upload path from book model
//     fileFilter: (req, file, callback) => {
//         callback(null, imageMimeTypes.includes(file.mimetype))
//     }
// })

async function renderNewPage(res, book, hasError = false) {
    renderFormPage(res, book, 'new', hasError)
}
async function renderEditPage(res, book, hasError = false) {
    renderFormPage(res, book, 'edit', hasError)
}

async function renderFormPage(res, book, form, hasError = false) {
    try {
            const authors = await Author.find({})
            const params = {
            authors: authors,
            book: book
            }
            // if (hasError) params.errorMessage = `Error ${form} Book`
            if (hasError) {
                if (form === 'edit') {
                  params.errorMessage = 'Error Updating Book'
                } else {
                  params.errorMessage = 'Error Creating Book'
                }
              }
            res.render(`books/${form}`, params)
            // console.log(params)
        } catch {
            res.redirect('books')
        }
    }

function saveCover(book, coverEncoded){
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded) //parse json as cover
    if (cover != null && imageMimeTypes.includes(cover.type)) {// the type is bevause in the filepond documentation, the item has the 'title' property
        book.coverImage = new Buffer.from(cover.data,'base64')
        book.coverImageType = cover.type
    } 
}
//all books' route
router.get('/', async (req,res) => {
    let query = Book.find() //cost is for constatn variable(no change)
    // let searchOptions = {}
    if (req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title,'i'))
        // searchOptions.title = new RegExp(req.query.title, 'i')
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try{
        const books = await query.exec()
        // console.log('books defined as', books)
        res.render('books/index',{
            books: books,
            searchOptions: req.query,
        })
    } catch{
        // console.log('catch')
        res.redirect('/')
    }

})

//new book
router.get('/new', async (req,res) => {
    renderNewPage(res, new Book())
    // console.log('new book get function works \n')
})

// create book route
//upload.single('cover') represent upload a single file named 'cover', cover can be replaced by any file names
// router.post('/', upload.single('cover'), async (req, res) => {
router.post('/', async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
      title: req.body.title ,
      author: req.body.author,
      publishDate: new Date(req.body.publishDate),
      pageCount: req.body.pageCount,
    //   coverImageName: fileName,
      description: req.body.description
    })
    try{
        saveCover(book, req.body.cover)
    } catch (err){
        renderNewPage(res, book, true)
        console.log('please upload image')
    }
    // console.log('Book object before saving:', book)
    // console.log('Title:', req.body.title);

    try {
      const newBook = await book.save()
      // res.redirect(`books/${newBook.id}`)
    //   console.log('manage to save');
      res.redirect(`books`)
    } catch {
    //   if (book.coverImageName != null) {
    //     // removeBookCover(book.coverImageName)
    //   }
    //   console.log('new book get function works \n',book.coverImageName)
    renderNewPage(res, book, true)
    }
  })

  //show book route
 router.get('/:id', async(req,res) =>{
    try{
        const book = await Book.findById(req.params.id)
                               .populate('author') //return author with id (title). In other words, replaces the author field (which is just an ID) with the full author document.
                               .exec()
        res.render('books/show', {book: book}) 
        //Redirecting might not be the right approach—users expect to see the book details rendered, not redirected.
        // Even if corrected to book.title, using title in the URL might not work unless you store unique book titles.
        // your variable is book, not books.
    } catch{
        res.redirect('/')
    }
 })

//edit book route
router.get('/:id/edit',async(req,res) => {
    try{
        const book = await Book.findById(req.params.id) //mangodb function findById
        renderEditPage(res, book)
        // console.log(author)
    } catch{
        res.redirect('/')
    }
})

// update book route
router.put('/:id', async (req, res) => {
    let book
    try{
        book = await Book.findById(req.params.id)
        book.title = req.body.title ,
        book.author =req.body.author,
        book.publishDate = new Date(req.body.publishDate),
        book.pageCount = req.body.pageCount,
        book.description = req.body.description
        if(req.body.cover != null && req.body.cover !== '') {
            saveCover(book, req.body.cover) //the cover exist
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    } catch {
        if (book != null) {
            renderEditPage(res,book,true)
        } else{
            redirect('/')
        }
    }
})

//delte book rout
router.delete('/:id', async(req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        // console.log('found successfully', req.params.id)
        await book.deleteOne()
        // console.log('removed successfully')
        res.redirect('/books')
    } catch {
        if (book == null){
            res.redirect('/')
        } else{
            res.redirect(`/books/${book.id}`)
            // console.log('failed to delete')
        }
    }
})/


// function removeBookCover(fileName){
//     fs.unlink(path.join(uploadPath, fileName), err => {
//         if (err) console.error(err)
//     })
// }
// this deletion is made due to the use of filepond

// as the edit and new function works similarly, we cobine these two into a new function
// async function renderNewPage(res, book, hasError = false) {
//     try {
//             const authors = await Author.find({})
//             const params = {
//             authors: authors,
//             book: book
//             }
//             // console.log('find', hasError)
//             if (hasError) params.errorMessage = 'Error Creating Book'
//             res.render('books/new', params)
//         } catch {
//             res.redirect('books')
//         }
//     }
// async function renderNewPage(res, book, hasError = false) {
//     try {
//             const authors = await Author.find({})
//             const params = {
//             authors: authors,
//             book: book
//             }
//             // console.log('find', hasError)
//             if (hasError) params.errorMessage = 'Error Editing Book'
//             res.render('books/edit', params)
//         } catch {
//             res.redirect('books')
//         }
//     }  
async function renderNewPage(res, book, hasError = false) {
    renderFormPage(res, book, 'new', hasError)
}
async function renderEditPage(res, book, hasError = false) {
    renderFormPage(res, book, 'edit', hasError)
}

async function renderFormPage(res, book, form, hasError = false) {
    try {
            const authors = await Author.find({})
            const params = {
            authors: authors,
            book: book
            }
            // if (hasError) params.errorMessage = `Error ${form} Book`
            if (hasError) {
                if (form === 'edit') {
                  params.errorMessage = 'Error Updating Book'
                } else {
                  params.errorMessage = 'Error Creating Book'
                }
              }
            res.render(`books/${form}`, params)
            // console.log(params)
        } catch {
            res.redirect('books')
        }
    }


function saveCover(book, coverEncoded){
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded) //parse json as cover
    if (cover != null && imageMimeTypes.includes(cover.type)) {// the type is bevause in the filepond documentation, the item has the 'title' property
        book.coverImage = new Buffer.from(cover.data,'base64')
        book.coverImageType = cover.type
    } 
}

module.exports = router