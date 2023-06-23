var express = require('express');
var router = express.Router();
var User = require('../models/User');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json({ msg: 'Welcome to the Api' });
});

router.post('/register', async (req, res, next) => {
  try {
    var user = await User.create(req.body);
    res.status(201), json({ user });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  var { email, password } = req.body;
  if (!password || !email) {
    res.status(400).json({ msg: 'Email/Password not valid!' });
    try {
      var user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ msg: 'Invalid Email' });
      }
      var result = await user.verifyPassword(password);
      if (!result) {
        res.status(400).json({ message: 'Invalid Password' });
      }
    } catch (error) {
      next(error);
    }
  }
});
module.exports = router;
