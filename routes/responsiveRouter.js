var express = require('express');
var router = express.Router();

// GET viewInv page
router.get('/', function(req, res) {
  res.render('responsive', { pagetitle: 'kegfinder' });
});

module.exports = router;