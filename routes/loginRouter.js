var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var bcrypt = require('bcryptjs');
const murl = process.env.mongodbUrl; // from .env file -- change one place for whole app


// login page
router.get('/', ensureNotAuthenticated, function(req, res) {
    res.render('login', { pagetitle: 'kegfinder', status: '', errors: '' });
});

// new login
router.get('/new', function(req, res) {
    res.render('login', { pagetitle: 'kegfinder', status: 'You are registered and can now log in.', errors: '' });
});

// unauthorized
router.get('/unauth', (req, res) => {
    res.render('login', { pagetitle: 'kegfinder', status: '', errors: 'You are not logged in.' });
});

// retry
router.get('/retry', (req, res) => {
    res.render('login', { pagetitle: 'kegfinder', status: '', errors: 'Incorrect username or password.' });
});

// logged out success
router.get('/out', ensureNotAuthenticated, (req, res) => {
    res.render('login', { pagetitle: 'kegfinder', status: 'You are logged out.', errors: '' });
});

// register page
router.get('/register', ensureNotAuthenticated, (req, res) => {
    res.render('register', { pagetitle: 'kegfinder', errors: '' });
});

router.post('/register', [
        check('username').isLength({ min: 1 }).withMessage('Username is required.'),
        check('email').isEmail().withMessage('Must use a valid email address.'),
        check('password').isLength({ min: 5 }).withMessage('Password must be 5 characters long.'),
        check('password2').exists()
            .custom((value, { req }) => value === req.body.password).withMessage('Passwords must match.')
    ],

    (req, res) => {
        const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
            return `${msg}`;
        };
        const result = validationResult(req).formatWith(errorFormatter);
        if (!result.isEmpty()) {
            res.render('register', { pagetitle: 'kegfinder', errors: result.array() });
        } else {
            // intake form info from POST
            let username = req.body.username;
            let email = req.body.email;
            let password = req.body.password;

            // new MongoDB access
            MongoClient.connect(murl, { useNewUrlParser: true}, function (err, client) {
                if (err) throw err;

                const db = client.db('kegfinder');

                db.collection('users').find({ username : `${username}` }).toArray(function (err, docs) {
                    if (err) throw err;
                    if (docs.length > 0) {
                        res.render('register', { pagetitle: 'kegfinder', errors: { msg: 'Username already in use.' } });
                    } else {
                        bcrypt.genSalt(10, function(err, salt) {
                            bcrypt.hash(password, salt, function(err, hash) {
                                if (err) {
                                    throw err;
                                } else {
                                    db.collection('users').insertOne({ username: `${username}`, 
                                        email: `${email}`, password: `${hash}` }, (err, result) => {
                                        if (err) {
                                            console.log(err);
                                            res.render('register', { pagetitle: 'kegfinder', errors: { msg: 'Database error.' } });
                                        } else {
                                            client.close();
                                            res.redirect('/login/new');
                                        }
                                    });
                                }
                            });
                        });
                    }
                });
            });
        }    
});

// Passport auth setup
passport.use(new LocalStrategy(function(username, password, done) {
    MongoClient.connect(murl, {useNewUrlParser: true}, (err, client) => {
        if (err) throw err;
        const db = client.db('kegfinder');

        db.collection('users').find({ username: `${username}`}).toArray((err, result) => {
            if (result.length === 0) {
                client.close();
                return done(null, false);
            }
            bcrypt.compare(password, result[0].password, function(err, res) {
                if (err) {
                    console.log(err);
                    client.close();
                    return done(null, false, {});
                } else {
                    client.close();
                    if (res) {
                        return done(null, result[0].username);
                    } else {
                        return done(null, false, {});
                    }
                }
            });
        });
    });
}));

passport.serializeUser(function(user, done) {
    return done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    MongoClient.connect(murl, {useNewUrlParser: true}, (err, client) => {
        if (err) throw err;
        const db = client.db('kegfinder');

        db.collection('users').find({username: `${user}`}).toArray((err, result) => {
            if (result.length === 0) {
                console.log('Auth error.');
                client.close();
                return done(null, false)
            }
            client.close();
            return done(null, user);
        });
    });
});

router.post('/', 
    passport.authenticate('local', { successRedirect: '/',
    failureRedirect: '/login/retry',
    failureFlash: true }),
    function(req, res) {
        res.redirect('/');
    }
);

function ensureNotAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        res.redirect('/');
    } else {
        return next();
    }
}

module.exports = router;