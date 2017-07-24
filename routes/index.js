var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var flash = require('connect-flash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var shift_controller = require('../controllers/shift_logic');
var router = express.Router();


router.get('/',  function (req, res) {
 res.render('index', { title:'Agp Protective', user : req.user });
});



router.get('/register', function(req, res) {
    res.render('register', {title: 'Register User' });
});

router.post('/register', function(req, res, next) {

    Account.register(new Account({ username : req.body.username, firstname: req.body.firstname, lastname: req.body.lastname,
       abnnumber: req.body.abnnumber, email: req.body.email, securitylicense: req.body.securitylicense, phonenumber: req.body.phonenumber }), req.body.password, function(err, account) {
        if (err) {
          var error = 'Someone with the same credential already exists, try again!';
          if(err.code === 11000) {
            error = 'Some of the values you entered have been already taken, try another.';
            res.render('register', {title: 'Register User',  message: error });
          }
          res.render('register', {title: 'Register User', message : err.message });
        }
        if (!err) {
            passport.authenticate('local')(req, res, function () {
                req.session.save(function (err) {
                  if (err){
                    return next(err);
                  }
                  res.redirect('/');
              });
          });
        }
    });
});

router.get('/login', function(req, res) {
    res.render('login', {title:"Login" , user : req.user });
    
});

//router.post('/login', passport.authenticate('local', { successRedirect: '/',
//                                                       failureRedirect: '/login',
//                                                       failureFlash: true}));


router.post('/login', function(req, res, next) {
  passport.authenticate('local', {failureFlash: true},function(err, user, info) {
    if (err) { return next(err);}
    if (!user) {
      req.flash('error', info);
      res.render('login', {message: req.flash('error')});
    }
    req.logIn(user, function(err) {
      if (err){
        return next(err);
      }
      res.redirect('/');
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
});

router.get('/forgot', function(req, res) {
  res.render('forgot', {
    user: req.user
  });
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      Account.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com' ,
        port: 465,
        secure: true,
        auth: {
          user: 'pathfinderprotective@gmail.com',
          pass: "vmmsgfppemfxgbsj"
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'pathfinderprotective@gmail.com',
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  Account.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {
      user: req.user
    });
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      Account.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'pathfinderprotective@gmail.com',
          pass: "vmmsgfppemfxgbsj"
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'pathfinderprotective@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;