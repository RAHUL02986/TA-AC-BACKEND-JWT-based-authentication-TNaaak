var express = require('express');
var router = express.Router();
var User = require('../models/User');
var auth = require('../middleware/auth');
/* GET users listing. */

router.post('/register', auth.verifyToken, async (req, res, next) => {
  try {
    var user = await User.create(req.body);
    var token = await user.signToken();
    res.status(201).json({ user: userJSON });
  } catch (error) {
    next(error);
  }
});

router.post('/login', auth.verifyToken, async (req, res, next) => {
  try {
    var { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ msg: 'Email/Password not valid' });
    }

    var user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ msg: 'Invalid User' });
    }
    var result = await user.verifyPassword(password);
    if (!result) {
      res.status(400).json({ msg: 'Invalid password' });
    }

    //generate token
    var token = await user.signToken();
    res.json({ user: userJSON(token) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
