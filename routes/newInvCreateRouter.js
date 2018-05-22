var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;


// respond with confirmation
router.get('/:user/:num/:type/:naming', ensureAuthenticated, (req, res) => {
    let user = req.params.user;
    let num = parseInt(req.params.num);
    let type = req.params.type;

    let initdate = new Date().toDateString();

    MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true}, (err, client) => {
        if (err) {
            res.send(err);
        };
        const db = client.db('kegfinder');

        db.collection(`inv_${user}`).find().toArray((err, result) => {
            if (result.length === 0) {
                for (let i = 1; i <= num; i++) {
                    // #i
                    db.collection(`inv_${user}`).insertOne({ kegid: i, initialized: `${initdate}`,
                    condition: 'initialized', type: `${type}`, batchid: 'not set', style: 'not set', 
                    location: 'not set', movedate: `initialized: ${initdate}`, notes: 'not set'}, (err, result) => {
                    if (err) {
                        console.log('Error: ' + err);
                    } else {
                        console.log('New inventory entry successfully created: ' + i);
                    }
                    });
                }
            } else {
                db.collection(`inv_${user}`).find().sort({kegid: -1}).toArray((err, result) => {
                    if (err) throw err;
                    // #result[0].kegid
                    let lastkeg = result[0].kegid;
                    console.log('Last keg: ' + lastkeg);
                    for (let i = lastkeg + 1; i <= num + lastkeg; i++) {
                        // #i
                        db.collection(`inv_${user}`).insertOne({ kegid: i, initialized: `${initdate}`,
                        condition: 'initialized', type: `${type}`, batchid: 'not set', style: 'not set', 
                        location: 'not set', movedate: `initialized: ${initdate}`, notes: 'not set'}, (err, results => {
                        if (err) {
                            console.log('Error: ' + err);
                        } else {
                            console.log('New inventory entry successfully created: ' + i);
                        }
                        }));
                    }
                });
            }
        });

        
    });
    res.send('Success.');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/login/unauth');
	}
}

module.exports = router;