const User = require('./models/user');
const bcrypt = require('bcrypt');
const jwt = ('jsonwebtoken');
require('dotenv').config;

//Signup
exports.userSignup = (req, res) => {
    const password = req.body.password;
    bcrypt.hash(password, 10)
    .then (hash => {
    const user = new User({ 
        email: req.body.email, 
        password: hash 
    });
    user.save()
      .then (() => res.status(201).json({ message: 'Nouvel utilisateur enregistré'}))
      .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }));
};

//Login
exports.userLogin = async(req, res, next) => {
    
    const password = req.body.password;
    User.findOne({ email: req.body.email, password })
    .then (user => {
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur ou mot de passe incorrete' });
        }
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ error: 'Mot de passe incorrecte' });
                }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };