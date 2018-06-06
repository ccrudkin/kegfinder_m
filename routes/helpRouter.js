var express = require('express');
var router = express.Router();

// get help page
router.get('/', (req, res) => {
    res.render('help', { pagetitle: 'kegfinder', userid: req.user });
});

module.exports = router;