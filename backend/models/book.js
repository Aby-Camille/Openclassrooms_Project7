const mongoose = require ('mongoose');

const Book = mongoose.Schema('Book', {
  userId: String,
  title: String,
  author: String,
  imageUrl: String,
  year: Number,
  genre: String,
  ratings: [
    {
      userId: String,
      grade: Number
    }
  ],
  averageRating: Number
});

module.exports = mongoose.model('Book', Book);