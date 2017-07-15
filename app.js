// dependencies
var express = require('express');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var async = require('async');
var jadeCompiler = require('jade-compiler');
var jade = require('jade');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var flash = require('express-flash');
// Twilio Credentials 
var accountSid = 'AC0c596227fab1b16327d5f32f0be17477'; 
var authToken = 'ddf92087fcb254eaad49b938770d4a69'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 
var LocalStrategy = require('passport-local').Strategy;


// Route Resource
var routes = require('./routes/index');
var users = require('./routes/users');
var pages = require('./routes/pages');
var holidays = require('./routes/holidays');
var shifts = require('./routes/shifts');


var app = express();


// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Public
app.use(favicon(__dirname + '/public/images/favicon.ico'));

// Logging Morgan
var accessLogStream = fs.createWriteStream(path.join(__dirname + "/utilities/logs/", 'access.log'), {flags: 'a'})
app.use(logger('dev',{stream: accessLogStream}));

// JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'agp',
    resave: false,
    saveUninitialized: false
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
// send errors to page if any.
app.use(function(req, res, next){
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
});


// Routes
app.use('/', routes);
app.use('/pages/',pages);
app.use('/',users);
app.use('/shifts',shifts);
app.use('/holidays',holidays);




// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser(),function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(Account.deserializeUser(),function(id, done) {
    Account.findById(id, function(err, user) {
        done(err, user);
    });
});
// mongoose
mongoose.connect('mongodb://localhost/mydb');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;