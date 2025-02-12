const mongoose = require('mongoose')
const Book = require('./books');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

//To preven deleting author who is linked to a book 
authorSchema.pre('deleteOne', function(next) {
    Book.find({author : this.id }, (err, books) => {
      if (err) {
        next (err) //if there is an error (cannot connect the database), then pass the error on
      } else if (books.length > 0){
        next(new Error('This author has books still'))
      } else {
        next()// ok to delete the data
      }
    })
  })


// ChatGPT version
// Middleware to prevent deleting an author if they have books
// authorSchema.pre('deleteOne', { document: true, query: false }, async function(next) { //either author.deleteOne() or Author.deleteOne({_id})
//   try {
//       const books = await Book.find({ author: this._id });
//       if (books.length > 0) {
//           return next(new Error('This author still has books.'));
//       }
//       next(); // Allow deletion if no books are found
//   } catch (error) {
//       next(error);
//   }
// });

module.exports = mongoose.model('Author',authorSchema)