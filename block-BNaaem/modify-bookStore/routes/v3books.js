var express = require('express');
var _ = require('lodash');
var User = require('../models/User');
var Book = require('../models/Book');

var router = express.Router();

/* GET list of all books. */
router.get('/', async (req, res, next) => {
  try {
    var books = await Book.find({});
    res.status(201).json({ books });
  } catch (error) {
    next(error);
  }
});

//create a new book
router.post('/', async (req, res, next) => {
  try {
    var book = await Book.create(req.body);
    res.status(201).json({ book });
  } catch (error) {
    next(error);
  }
});

//update a book
router.put('/:id', async (req, res, next) => {
  try {
    var id = req.params.id;
    var updatedBook = await Book.findByIdAndUpdate(id, req.body);
    res.status(201).json({ updatedBook });
  } catch (error) {
    next(error);
  }
});

//delete a book
router.delete('/:id', async (req, res, next) => {
  try {
    var id = req.params.id;
    var book = await Book.findByIdAndDelete(id);
    res.status(201).json({ book });
  } catch (error) {
    next(error);
  }
});

//get book by id
router.get('/:id', async (req, res, next) => {
  try {
    var id = req.params.id;
    var singleBook = await Book.findById(id);
    res.status(201).json({ singleBook });
  } catch (error) {
    next(error);
  }
});

//get list of all comments of current book

router.get('/:id/comments', async (req, res, next) => {
  try {
    var book = await Book.findById(req.body).populate('comments');
    res.status(201).json({ book });
  } catch (error) {
    next(error);
  }
});

//creating new comment

router.post('/:id/comment/new', async (req, res, next) => {
  try {
    var id = req.params.id;
    req.body.createdBy = req.user.id;
    var createdComment = await Comment.create(req.body);
    res.status(201).json({ createdComment });

    var updatedUser = await User.findByIdAndUpdate(req.user.id, {
      $push: { comments: createdComment.id },
    });
    res.status(201).json({ updatedUser });
  } catch (error) {
    next(error);
  }
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

//list books by category

router.get('/list/by/:category', function (req, res, next) {
  let category = req.params.category;

  Book.find({ category: category }, (err, books) => {
    if (err) return next(err);

    res.json({ books });
  });
});

//count books for each category

router.get('/count/by/category', (req, res, next) => {
  //getting array of all categories

  Book.find({}, (err, books) => {
    if (err) return next(err);

    let arrOfCate = books.reduce((acc, cv) => {
      acc.push(cv.categories);
      return acc;
    }, []);

    arrOfCate = _.uniq(_.flattenDeep(arrOfCate));
    let objOfcount = {};

    arrOfCate.forEach((category) => {
      Book.find({ categories: category }, (err, foundBooks) => {
        if (err) return next(err);

        objOfcount[category] = foundBooks.length;
      });
    });

    res.json(objOfcount);
  });
});

//list of books by auther

router.get('/list/author/:id', function (req, res, next) {
  let authorId = req.params.id;

  User.findById(authorId)
    .populate('books')
    .exec((err, user) => {
      if (err) return next(err);

      res.json({ books: user.books });
    });
});

//list of all tags

router.get('/tags/tagslist', (req, res, next) => {
  Book.find({}, (err, books) => {
    if (err) return next(err);

    let arrOftags = books.reduce((acc, cv) => {
      acc.push(cv.tags);
      return acc;
    }, []);

    arrOftags = _.uniq(_.flattenDeep(arrOftags));

    res.json({ arrOftags });
  });
});

//list of tags in ascending/descending order
router.get('/tags/tagslist/:type', (req, res, next) => {
  let type = req.params.type;

  Book.find({}, (err, books) => {
    if (err) return next(err);

    let arrOftags = books.reduce((acc, cv) => {
      acc.push(cv.tags);
      return acc;
    }, []);

    arrOftags = _.uniq(_.flattenDeep(arrOftags));

    if (type === 'asc') {
      arrOftags = arrOftags.sort(function (a, b) {
        var nameA = a.toUpperCase(); // ignore upper and lowercase
        var nameB = b.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      });

      return res.json({ arrOftags });
    }

    if (type === 'desc') {
      arrOftags = arrOftags.sort(function (a, b) {
        var nameA = a.toUpperCase(); // ignore upper and lowercase
        var nameB = b.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }

        // names must be equal
        return 0;
      });

      return res.json({ arrOftags });
    }
  });
});

//filter books by tags

router.get('/list/tags/:name', (req, res, next) => {
  let name = req.params.name;

  Book.find({ tags: name }, (err, books) => {
    if (err) return next(err);

    res.json({ books });
  });
});

//count of number of books of each  tags

router.get('/tags/tagslist/count', (req, res, next) => {
  Book.find({}, (err, books) => {
    if (err) return next(err);

    let arrOftags = books.reduce((acc, cv) => {
      acc.push(cv.tags);
      return acc;
    }, []);

    arrOftags = _.uniq(_.flattenDeep(arrOftags));

    let objOfcount = {};

    arrOftags.forEach((tag) => {
      Book.find({ tags: tag }, (err, booksByTags) => {
        if (err) return next(err);

        objOfcount[tag] = booksByTags.length;
      });
    });

    return res.json(objOfcount);
  });
});

module.exports = router;
