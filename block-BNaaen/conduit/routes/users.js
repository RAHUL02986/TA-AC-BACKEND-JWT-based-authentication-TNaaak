var express = require('express');
var router = express.Router();
var User = require('../models/User');
/* GET users listing. */
router.post('/register', async (req, res, next) => {
  try {
    var user = await User.create(req.body);
    var token = await user.verifyToken();

    res.status(201).json({ user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  var { password, email } = req.body;
  if (!password || !email) {
    return res.status(400).json({ msg: 'Email/Password required' });
  }

  try {
    var user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: 'Email is not Valid' });
    }
    var result = await user.verifyPassword(password);
    if (!result) {
      res.status(400).json({ error: 'Incorrect Password' });
    }
    var token = await user.verifyToken();
    res.json({ user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

//Get Current User
router.get('/user/', async (req, res, next) => {
  // console.log(req);
  let id = req.user.userId;
  try {
    let user = await User.findById(id);
    res.status(200).json({ user: user.displayUser(id) });
  } catch (error) {
    next(error);
  }
});
//Update User
router.put('/user/', async (req, res, next) => {
  let id = req.user.userId;
  try {
    user = await User.findByIdAndUpdate(id, req.body.user);
    return res.status(201).json({ user: user.displayUser(id) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
