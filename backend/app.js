const express = require ('express');
const mongoose = require('mongoose');
const Book = require('./models/book');
const User = require('./models/user');
const app = express();
require('dotenv').config();

const dataBaseUrl = process.env.DATABASE_URL;

mongoose.connect(dataBaseUrl,
  { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app
.use(express.json())
.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
})
// Books
.get('/api/books', async(req, res) => {
  const books = await Book.find({});
  res.json(books);
})

// Book
.get('/api/books/:id', async(req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    res.json(book);
    return;
  }

  res.sendStatus(404);
})
.put('/api/books/:id', async(req, res) => {
  
})

// Auth
.post('/api/auth/login', async(req, res) => {
  // hachage du mot de passe
  const password = req.body.password;
  const user = await User.findOne({ email: req.body.email, password });

  if (user) {
    res.json({ usrId: user._id, token: '' });
    return;
  }

  res.sendStatus(404);
})
.post('/api/auth/signup', async(req, res) => {
  // hacher le mot de passe
  const password = req.body.password;
  const user = new User({ email: req.body.email, password });

  try {
    await user.save();
    res.sendStatus(200);
  } catch(error) {
    console.error(error);
    res.statusMessage(error);
    res.sendStatus(500);
  }
})

module.exports = app;