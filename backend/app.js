const express = require ('express');

const app = express();

app.use((req, res, next) => {
    res.json({message: 'Votre requete'});
    next();
});

app.use((req, res, next) => {
    res.status(201);
    next();
})

module.exports = app;