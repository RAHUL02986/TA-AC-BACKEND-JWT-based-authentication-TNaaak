var express = require('express');
var User = require('../models/User');
var Book = require('../models/Book');
var Comment = require('../models/Comment');

var router = express.Router();

/* GET list of all books. */
router.get('/', function (req, res, next) {
  Book.find({}, (err, books) => {
    if (err) return next(err);

    res.json({ books });
  });
});

//create a new book
router.post('/', (req, res, next) => {
  let data = req.body;
  Book.create(data, (err, createdBook) => {
    if (err) return next(err);
    res.json({ createdBook });
  });
});

//update a book

router.put('/:id', (req, res, next) => {
  let data = req.body;
  let bookId = req.params.id;

  Book.findByIdAndUpdate(bookId, data, (err, updatedBook) => {
    if (err) return next(err);
    res.json({ updatedBook });
  });
});

//delete a book

router.delete('/:id', (req, res, next) => {
  let bookId = req.params.id;

  Book.findByIdAndDelete(bookId, (err, deletedBook) => {
    if (err) return next(err);
    res.json({ deletedBook });
  });
});

//get book by id

router.get('/:id', (req, res, next) => {
  let bookId = req.params.id;

  Book.findById(bookId, (err, book) => {
    if (err) return next(err);
    res.json({ book });
  });
});

//get list of all comments of current book

router.get('/:id/comments', (req, res, next) => {
  let bookId = req.params.id;

  Book.findById(bookId)
    .populate('comments')
    .exec((err, book) => {
      if (err) return next(err);
      res.json({ book });
    });
});

//creating new comment

router.post('/:id/comment/new', (req, res, next) => {
  let bookId = req.params.id;
  let data = req.body;
  data.createdBy = req.user.id;
  Comment.create(data, (err, createdComment) => {
    if (err) return next(err);
    User.findByIdAndUpdate(
      req.user.id,
      {
        $push: { comments: createdComment.id },
      },
      (err, updatedUser) => {
        res.json({ createdComment, updatedUser });
      }
    );
  });
});

//edit a comment

router.get('/:id/comment/edit/:commId', (req, res, next) => {
  let bookId = req.params.id;
  let commentId = req.params.commId;

  Comment.findById(commentId, (err, comment) => {
    if (err) return next(err);
    res.json({ comment });
  });
});

router.post('/:id/comment/edit/:commId', (req, res, next) => {
  let bookId = req.params.id;
  let commentId = req.params.commId;
  let data = req.body;

  Comment.findByIdAndUpdate(commentId, data, (err, updatedComment) => {
    if (err) return next(err);
    res.json({ updatedComment });
  });
});

//delete a comment
router.get('/:id/comment/delete/:commId', (req, res, next) => {
  let bookId = req.params.id;
  let commentId = req.params.commId;

  Comment.findByIdAndDelete(commentId, (err, deletedComment) => {
    if (err) return next(err);
    User.findByIdAndUpdate(
      deletedComment.createdBy,
      {
        $pull: { comments: deletedComment.id },
      },
      (err, updatedUser) => {
        if (err) return next(err);
        res.json({ deletedComment, updatedUser });
      }
    );
  });
});

module.exports = router;