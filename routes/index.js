var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Kegfinder', pagetitle: 'Kegfinder - A brewery tool to track keg inventory', userid: req.user });
});

module.exports = router;
