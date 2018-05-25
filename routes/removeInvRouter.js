var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const murl = process.env.mongodbUrl; // from .env file -- change one place for whole app
var LocalStrategy = require('passport-local');
const { check, validationResult } = require('express-validator/check');

router.get('/:id', ensureAuthenticated, (req, res) => {
    let kegIDs = req.params.id.split(',');

    console.log('Req.user: ' + req.user);

    MongoClient.connect(murl, {useNewUrlParser: true}, (err, client) => {
        if (err) throw err;
        const db = client.db('kegfinder');

        kegIDs.forEach((id) => {
            db.collection(`inv_${req.user}`).remove({ kegid: parseInt(id) }), 
                (err, result) => {
                    if (err) console.log(err);
                }
        });
        res.send('Success.');
    });
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/login/unauth');
	}
}

module.exports = router;