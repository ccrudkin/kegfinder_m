var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
var bcrypt = require('bcryptjs');
const murl = process.env.mongodbUrl;

// get account page
router.get('/', ensureAuthenticated, (req, res) => {
    MongoClient.connect(murl, {userNewUrlParser: true}, (err, client) => {
        if (err) {
            console.log(err);
            throw err;
        }
        const db = client.db('kegfinder');
        // get email address for user account details
        db.collection('users').findOne({ username: `${req.user}` }, (err, result) => {
            if (err) {
                console.log(err);
                throw err;
            } else {
                res.render('useraccount', { pagetitle: 'kegfinder', userid: req.user, useremail: result.email });
            }
        });
    });
});

router.post('/change', ensureAuthenticated, 
    [
        check('newPass').isLength({ min: 5 }).withMessage('New password must be at least 5 characters long.'),
        check('newPass2').exists()
            .custom((value, { req} ) => value === req.body.newPass).withMessage('New passwords must match.')
    ],
    (req, res) => {
        // check validation results, respond if errors exist
        const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
            return `${msg}`;
        };
        const result = validationResult(req).formatWith(errorFormatter);
        if (!result.isEmpty()) { // if there are errors, send them
            res.send([1, result.array()]); // if responseArray[0] === 1, it means errors
        } else {
            MongoClient.connect(murl, {useNewUrlParser: true}, (err, client) => {
                if (err) {
                    console.log(err);
                    res.send([1, err]);
                }
                const db = client.db('kegfinder');
                // connect to db and compare current password to stored hash; if true, proceed
                db.collection('users').find({ username: `${req.user}` }).toArray((err, result) => {
                    bcrypt.compare(req.body.oldPass, result[0].password, function(err, response) {
                        if (err) {
                            console.log(err);
                            client.close();
                            res.send([1, err]);
                        } else {
                            client.close();
                            if (response) {
                                // change password if old pass matches and new passwords validate
                                let changeStat = changePass(req.body.newPass); 
                                if (changeStat.length === 0) { // empty array means success
                                    // if responseArray[0] === 0, it means no errors/success
                                    res.send([0, 'Password changed successfully.']);
                                } else {
                                    res.send([1, ['There was an error.']]); // consider sending error array
                                }
                            } else {
                                res.send([1, ['Old password is incorrect.']]);
                            }
                        }
                    });
                });
            });
        }

    function changePass(newPass) {
        // returns array of errors if present, else returns empty array
        let errors = [];
        // connect again and replace password with new hash
        MongoClient.connect(murl, {useNewUrlParser: true}, (err, client) => {
            if (err) {
                console.log(err);
                errors.push(err);
            }
            const db = client.db('kegfinder');

            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newPass, salt, (err, hash) => {
                    if (err) {
                        console.log(err);
                        errors.push(err);
                    } else {
                        db.collection('users').updateOne({ username: `${req.user}` }, 
                            { $set: {password: `${hash}`} }, (err, result) => {
                                if (err) {
                                    console.log(err);
                                    errors.push(err);
                                } else {
                                    client.close();
                                    console.log('Changed password successfully.');
                                }
                        });
                    }
                });
            });
        });
        return errors;
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