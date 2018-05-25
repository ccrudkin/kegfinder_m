var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const murl = process.env.mongodbUrl; // from .env file -- change one place for whole app
var LocalStrategy = require('passport-local');
const { check, validationResult } = require('express-validator/check');


// respond with confirmation
router.get('/:num/:type/:naming', [
        check('num').isNumeric().withMessage('Please enter a number.')
    ], 
    ensureAuthenticated, (req, res) => {
    const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
        return `${msg}`;
    };
    const result = validationResult(req).formatWith(errorFormatter);
    if (!result.isEmpty()) {
        res.send(result.array());
    } else {
        let user = req.user;
        let num = parseInt(req.params.num);

        let type = req.params.type;

        let initdate = new Date().toDateString();

        MongoClient.connect(murl, {useNewUrlParser: true}, (err, client) => {
            if (err) {
                res.send(err);
            };
            const db = client.db('kegfinder');

            db.collection(`inv_${user}`).find().toArray((err, result) => {
                if (result.length === 0) {
                    for (let i = 1; i <= num; i++) {
                        // #i
                        db.collection(`inv_${user}`).insertOne({ kegid: i, initialized: `${initdate}`,
                        condition: 'INITIALIZED', type: `${type}`, batchid: 'NOT SET', style: 'NOT SET', 
                        location: 'NOT SET', movedate: `INITIALIZED: ${initdate}`, notes: 'NOT SET'}, (err, result) => {
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
                            condition: 'INITIALIZED', type: `${type}`, batchid: 'NOT SET', style: 'NOT SET', 
                            location: 'NOT SET', movedate: `INITIALIZED: ${initdate}`, notes: 'NOT SET'}, (err, results => {
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
    }
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/login/unauth');
	}
}

module.exports = router;