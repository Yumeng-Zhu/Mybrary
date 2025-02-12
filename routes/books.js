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
    saveCover(book, req.body.cover)

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

// function removeBookCover(fileName){
//     fs.unlink(path.join(uploadPath, fileName), err => {
//         if (err) console.error(err)
//     })
// }
// this deletion is made due to the use of filepond
 
async function renderNewPage(res, book, hasError = false) {
    try {
            const authors = await Author.find({})
            const params = {
            authors: authors,
            book: book
            }
            // console.log('find', hasError)
            if (hasError) params.errorMessage = 'Error Creating Book'
            res.render('books/new', params)
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