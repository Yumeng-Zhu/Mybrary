//routes = controller in MVX
const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const Book = require('../models/books')
const Author = require ('../models/authors')
const uploadPath = path.join('public', Book.coverImageBasePath)
// const { error } = require('console')
const imageMimeTypes = ['image/jpeg','image/png','image/gif']
const upload = multer({
    dest: uploadPath,//upload path
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

//all books' route
router.get('/', async (req,res) => {
    res.send('all books')
})

//new book
router.get('/new', async (req,res) => {
    renderNewPage(res, new Book())
})

// create book route
//upload.single('cover') represent upload a single file named 'cover', cover can be replaced by any file names
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      publishDate: new Date(req.body.publishDate),
      pageCount: req.body.pageCount,
      coverImageName: fileName,
      description: req.body.description
    })
  
    try {
      const newBook = await book.save()
      // res.redirect(`books/${newBook.id}`)
      res.redirect(`books`)
    } catch {
    //   if (book.coverImageName != null) {
    //     removeBookCover(book.coverImageName)
    //   }
      renderNewPage(res, book, true)
    }
  })
 
async function renderNewPage(res, book, hasError = false) {
    try {
            const authors = await Author.find({})
            const params = {
            authors: authors,
            book: book
            }
            if (hasError) params.errorMessage = 'Error Creating Book'
            res.render('books/new', params)
        } catch {
            res.redirect('/books')
        }
    }  

module.exports = router