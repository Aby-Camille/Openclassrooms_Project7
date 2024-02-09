const express = require ('express');
const mongoose = require('mongoose');
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

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.post('/api/stuff', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
      message: 'Objet créé !'
    });
});

app.use((req, res, next) => {
    res.json({message: 'Votre requete'});
    next();
});

app.use((req, res, next) => {
    res.status(201);
    next();
})

module.exports = app;