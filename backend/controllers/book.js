

//Save book
exports.post('/api/books', async(req, res) => {
    const book = new Book(req.body);

    await book.save()
        .then(() => res.status(201).json({ message: 'Livre sauvegardé' }))
        .catch(error => res.status(400).json({ error }));
  });

//Delete
exports.deleteOneBook('/api/books/:id', async(req, res) => {
    
    await Book.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre supprimé' }))
        .catch(error => res.status(400).json({ error }));
  });