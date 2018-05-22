var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var newInvRouter = require('./routes/newInvRouter');
var newInvCreate = require('./routes/newInvCreateRouter');
var viewInvRouter = require('./routes/viewInvRouter');
var modInvRouter = require('./routes/modInvRouter');
var responsive = require('./routes/responsiveRouter');
var loginRouter = require('./routes/loginRouter');
var logoutRouter = require('./routes/logoutRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'cats',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Vars -- order matters! Up too high, and locals.user is not set
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/newinventory', newInvRouter);
app.use('/newinventory=create', newInvCreate); // deprecated?
app.use('/viewInventory', viewInvRouter);
app.use('/modInventory', modInvRouter);
app.use('/responsive', responsive);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
