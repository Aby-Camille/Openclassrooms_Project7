const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

//SignUp
router.post('/signup', userCtrl.userSignup);

//Login
router.post('/login', userCtrl.userLogin);

module.exports = router;