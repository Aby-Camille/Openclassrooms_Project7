const Book = require('../models/book');
const fs = require('fs');

//Create and Save new book
exports.createSaveBook = async(req, res, next) => {
    try {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book ({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename.replace(/\.jpeg|\.jpg|\.png/g, "_")}thumbnail.webp`
    });

    await book.save()

    res.status(201).json({ message: 'Livre sauvegardé' });
    } catch (error) { 
        res.status(400).json({ error });
    };
};

//Create Rating 
exports.createRatingBook = async (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then( book => {    
        const isAlreadyRated = book.ratings.find((book) => book.userId === req.auth.userId);
          if ( !isAlreadyRated) {
            book.ratings.push({
                userId: req.auth.userId,
                grade: req.body.rating
            })
            let newAverageRating = book.ratings.reduce((accumulator, currentValue) => accumulator + currentValue.grade, 0)/book.ratings.length;
            book.averageRating = newAverageRating;

            return book.save()
            } else {
                res.status(401).json({message: 'Livre déjà noté'});
            }
        })
    .then(book => res.status(201).json(book))
    .catch(error => res.status(500).json({ error }));
  };

//Read
exports.getAllBook = async(req, res, next) => {
    const books = await Book.find({});
    return res.json(books);
  };

exports.getOneBook = async(req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then(book =>
        res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

//Update
exports.updateOneBook = async(req, res, next) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename.replace(/\.jpeg|\.jpg|\.png/g, "_")}thumbnail.webp`,
} : { ...req.body };

  delete bookObject._userId;

  Book.findOne({_id: req.params.id})
  .then((book) => {
      if (book.userId != req.auth.userId) {
          res.status(401).json({ message : 'Not authorized'});
      } else {
          if(bookObject.imageUrl){
              const filenameThumb = book.imageUrl.split('/images/')[1];
              const filenameLarge = filenameThumb.split('_thumbnail')[0];
              fs.unlink(`images/${filenameLarge}.jpg`, () => { });
              fs.unlink(`images/${filenameLarge}.png`, () => { });
              fs.unlink(`images/${filenameThumb}`, () => { });
          }

   Book.updateOne({ _id: req.params.id }, { ...bookObject })
      .then (() => res.status(200).json ({ message: 'Livre modifié'}))
      .catch((updateError) => res.status(500).json({ error: updateError.message }));
  }
  });
};

//Delete
exports.deleteOneBook = async(req, res, next) => {
    try {
        const book = await Book.findOne({ _id: req.params.id });

        if (book.userId !== req.auth.userId) {
            res.status(401).json({ message: 'Non autorisé' });
        } else {
            const filenameThumb = book.imageUrl.split('/images/')[1];
            const filenameLarge = filenameThumb.split('_thumbnail')[0];
            fs.unlink(`images/${filenameLarge}.jpg`, () => { });
            fs.unlink(`images/${filenameLarge}.png`, () => { });
            fs.unlink(`images/${filenameThumb}`, () => {

            book.deleteOne({_id: req.params.id});
            res.status(200).json({ message: 'Livre supprimé' })});
        }
    } catch(error) {
        res.status(500).json({ error });
    }
};

// Best rating
exports.bestRating = async(req, res) => {
    try {
        const books = await Book.find({}).sort({ averageRating: 'desc' }).limit(3);
        res.json(books);
    } catch(error) {
        console.error(error.message);
        res.status(500).json({ error });
    }
};