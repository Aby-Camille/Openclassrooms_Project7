const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer');
const sharp = require('../middleware/sharp');

//Create & Save
router.post('/', auth, multer, sharp, bookCtrl.createBook);
router.post('/:id/rating', auth, bookCtrl.createRatingBook);

// Best rating
router.get('/bestrating', bookCtrl.bestRating);

//Read
router.get('/:id', bookCtrl.getOneBook);
router.get('/', bookCtrl.getAllBook);  

//Update
router.put('/:id', auth, multer, sharp, bookCtrl.updateOneBook);

//Delete
router.delete('/:id', auth, bookCtrl.deleteOneBook);

module.exports = router;