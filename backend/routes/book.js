const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer');


//Create & Save
router.post('/', auth, multer, bookCtrl.createSaveBook);

//Read
router.get('/', bookCtrl.getAllBook);
router.get('/:id', bookCtrl.getOneBook);

//Update
router.put('/:id', auth, multer, bookCtrl.updateOneBook);

//Delete
router.delete('/:id', auth, bookCtrl.deleteOneBook);

module.exports = router;