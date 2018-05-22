var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

// GET viewInv page
router.get('/', ensureAuthenticated, function(req, res) {
    res.render('viewInv', { pagetitle: 'kegfinder', userid: req.user });
});

// Return search results.
router.get('/:user/:searchBy/:term/:sort', ensureAuthenticated, (req, res) => {
    let user = req.params.user;
    let searchBy = req.params.searchBy;
    let term = req.params.term;
    let sort = req.params.sort;

    if (searchBy === 'kegid') {
        if (term != 'getAll') {
            term = parseInt(term);
        }
    }

    console.log(sort);
    
    MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true}, (err, client) => {
        if (err) throw err;
        const db = client.db('kegfinder');
        
        if (term === 'getAll') {
            db.collection(`inv_${user}`).find().sort({ [sort]: 1, kegid: 1 }).toArray((err, result) => {
                if (err) {
                    console.log(err);
                    client.close();
                    res.send(err);
                } else {
                    client.close();
                    res.send(result);
                }
            });
        } else {
            // #term
            db.collection(`inv_${user}`).find({ [searchBy]: term }).sort({ [sort]: 1, kegid: 1 }).toArray((err, result) => {
                if (err) {
                    console.log(err);
                    client.close();
                    res.send(err);
                } else {
                    client.close();
                    res.send(result);
                }
            });
        }
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