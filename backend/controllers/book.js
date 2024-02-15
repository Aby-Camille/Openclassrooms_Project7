const Book = require('./models/book');

//Create and Save new book
exports.createSaveBook = async(req, res) => {
    const book = new Book(req.body);

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
  
    await Book.updateOne({ _id: req.params.id }, {...req.body, _id: req.params.id})
    .then (() => res.status(200).json ({ message: 'Livre modifié'}))
    .catch(error => res.status(400).json({ error }));
  };

//Delete
exports.deleteOneBook = async(req, res) => {
    
    await Book.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre supprimé' }))
        .catch(error => res.status(400).json({ error }));
  };