var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.status(200).json({ msg: 'Welcome' });
});
router.get('/protected', auth.verifyToken, (req, res) => {
  res.json({ access: 'Protected Resource' });
});

module.exports = router;
