var express = require('express');
var router = express.Router();
var User = require('../models/User');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async (req, res, next) => {
  try {
    var user = await User.create(req.body);
    var token = await user.signToken();
    res.status(201).json({ user: userJSON });
  } catch (error) {
    next(error);
  }
});
router.post('/login', async (req, res, next) => {
  var { email, password } = req.body;
  if (!password || !email) {
    return res.status(400).json({ msg: 'Email/Password is invalid' });
  }
  try {
    var user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'email is invalid' });
    }
    var result = await user.verifyPassword(password);
    if (!result) {
      return res.status(400).json({ msg: 'invalid password' });
    }

    //generate token
    var token = await user.signToken();
    res.json({ user: userJSON(token) });
  } catch (error) {
    next(error);
  }
});
module.exports = router;