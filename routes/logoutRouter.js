var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local');

router.get('/', function(req, res) {
    req.logout();

    res.redirect('/login/out');
});

module.exports = router;