const Book = require('../models/book');
const fs = require('fs');

//Create and Save new book
exports.createSaveBook = async(req, res) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

    const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
});

    await book.save()
        .then(() => res.status(201).json({ message: 'Livre sauvegardé' }))
        .catch(error => res.status(400).json({ error }));
};

//Read
exports.getAllBook = async(req, res) => {
    const books = await Book.find({});
    res.json(books);
  };

exports.getOneBook = async(req, res) => {
    const book = await Book.findById(req.params.id);
  
    if (book) {
      res.json(book);
      return;
    }
  
    res.sendStatus(404);
  };

//Create Rating 
exports.createRatingBook = async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id });
        
        if (book.ratings.some(rating => rating.userId === req.userId) || (req.body.grade < 1 || req.body.grade > 5)) {
            return res.status(500).json({ error: 'Erreur lors de la notation' });
        } else {
            book.ratings.push({
                userId: req.userId,
                grade: req.body.rating
            });
            const totalRatings = book.ratings.length;
            const sumOfRatings = book.ratings.reduce((acc, rating) => acc + rating.grade, 0);
            book.averageRating = sumOfRatings / totalRatings;
            book.averageRating = parseFloat(book.averageRating.toFixed(1));
            await book.save();
            return res.status(200).json({ message: 'Notation créée avec succès', book });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erreur lors de la notation' });
    }
};     

//Update
exports.updateOneBook = async(req, res) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
} : { ...req.body };
  delete bookObject._userId;

  await Book.findOne({ _id: req.params.id })
  .then(book => {
      if (book.userId !== req.auth.userId) {
          return res.status(401).json({ message: 'Non autorisé' });
  } else {

   Book.updateOne({ _id: req.params.id }, { ...bookObject })
      .then (() => res.status(200).json ({ message: 'Livre modifié'}))
      .catch((updateError) => res.status(500).json({ error: updateError.message }));
  }
  });
};

//Delete
exports.deleteOneBook = async(req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id });

        if (book.userId !== req.auth.userId) {
            res.status(401).json({ message: 'Non autorisé' });
        } else {
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`);

            await book.delete();
            res.status(200).json({ message: 'Livre supprimé' });
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