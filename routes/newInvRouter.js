var express = require('express');
var router = express.Router();

// render New Inventory page
router.get('/', ensureAuthenticated, function(req, res) {
  res.render('newInv', { pagetitle: 'kegfinder', message: '', userid: req.user });
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/login/unauth');
	}
}

module.exports = router;