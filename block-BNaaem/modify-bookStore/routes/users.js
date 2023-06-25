var express = require('express');
var router = express.Router();
var User = require('../models/User');
var auth = require('../middleware/auth');

/* GET users listing. */

router.get('/', auth.verifyToken, function (req, res, next) {
  res.json({ message: 'User Information' });
});
router.post('/register', async function (req, res, next) {
  try {
    var user = await User.create(req.body);
    var token = await user.signToken();

    res.status(201).json({ user: userJSON() });
  } catch (error) {
    next(error);
  }
});
router.get('/login', async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email/Password not valid' });
  }

  try {
    var user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: 'email invalid' });
    }
    var result = await user.verifyPassword(password);
    if (!result) {
      res.status(400).json({ error: 'Password Not Matched' });
    }
    //generate token
    var token = await user.signToken();
    res.json({ user: userJSON(token) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
