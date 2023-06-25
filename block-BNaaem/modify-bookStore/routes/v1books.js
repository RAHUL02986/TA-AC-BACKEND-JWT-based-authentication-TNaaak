var express = require('express');
var User = require('../models/User');
var Book = require('../models/Book');

var router = express.Router();
//get list of all books

router.get('/', async (req, res, next) => {
  try {
    var books = await Book.find({});
    res.status(201).json({ books });
  } catch (error) {
    next(error);
  }
});

// create a new book
router.post('/', async (req, res, next) => {
  try {
    var createBook = await Book.create(req.body);
    res.status(201).json({ createBook });
  } catch (error) {
    next(error);
  }
});
//delete book
router.get('/:id/delete', async (req, res, next) => {
  try {
    var id = req.params.id;
    var book = await Book.findByIdAndDelete(req.body, id);
    res.status(201).json({ book });
  } catch (error) {
    next(error);
  }
});

//edit a book
router.get('/:id/edit', async (req, res, next) => {
  try {
    var id = req.params.id;
    var book = await Book.findById(req.body, id);
    res.status(201).json({ book });
  } catch (error) {
    next(error);
  }
});

//updated book
router.post('/:id/update', async (req, res, next) => {
  var id = req.params.id;
  var updatedBook = await Book.findByIdAndUpdate(req.body, id);
  res.status(201).json({ updatedBook });
});

//get single book

router.get('/:id', async (req, res, next) => {
  try {
    var id = req.params.id;
    var singleBook = await Book.findById(id);
    res.status(201).json({ singleBook });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
