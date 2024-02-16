const Book = require('./models/book');
const fs = require('fs');

//Create and Save new book
exports.createSaveBook = async(req, res) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

    const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filname}`
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
    
    await Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé' });
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Livre supprimé' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};