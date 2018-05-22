var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

// GET viewInv page
router.get('/', ensureAuthenticated, function(req, res) {
    res.render('modInv', { pagetitle: 'kegfinder', userid: req.user });
  });

// intake information to update inventory via get
router.get('/:condition/:style/:batchid/:location/:notes/:user/:id', ensureAuthenticated, (req, res) => {
    let kegIDs = req.params.id.split(',');
    let updates = Object.assign({}, req.params);

    updates['movedate'] = new Date().toDateString(); // set movedate to now
    delete updates.user; // delete these fields so we can loop through whole object below
    delete updates.id; // keeping these would screw up the for() loop
    
    MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true}, (err, client) => {
        if (err) throw err;
        const db = client.db('kegfinder');

        kegIDs.forEach((id) => {
            for (var key in updates) {
                if (updates[key] != '--') {
                    // #id
                    db.collection(`inv_${req.params.user}`).updateOne({kegid: parseInt(id)}, 
                        {$set: { [key]: `${updates[key]}` }}, (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            }
        })
    });
    res.send('Received.');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/login/unauth');
	}
}

module.exports = router;