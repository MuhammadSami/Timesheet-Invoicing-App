// Twilio Credentials 
var accountSid = 'AC33ac4149bf43008077abd09ba0179ca8'; 
var authToken = 'c97a6f8b6d3563f5d892417e7d152284'; 
var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var client = require('twilio')(accountSid, authToken);
var user_controller = require('../controllers/employee_logic');
var router = express.Router();


/* GET users listing. */
router.get('/showallusers', function(req, res){
    Account.find({}).exec(function(err, users) {   
        if (err) throw err;
        res.render('allusers', {title: 'All Users', users: users })
    }); 
});

router.get('/showinvoices', function(req, res){
    Account.find({}).exec(function(err, users) {   
        if (err) throw err;
        res.render('allinvoices', {title: 'All Invoice', users: users })
    }); 
});

router.get('/sendText', function(req, res){
    Account.find({}).exec(function(err, users) {   
        if (err) throw err;
        res.render('remindusers', {title: 'Remind Users', users: users })
    }); 
});

router.post('/sendText', function(req, res){
    Account.find({}).exec(function(err, user) {   
        if (err) throw err;
        var userMap = {};
        user.forEach(function(user) {
            userMap[user._id] = user;
            console.log(user);
            client.messages.create({
                to: user.phonenumber,
                from:'+61407408710',
                body: req.body.message
            }, function(error, message) {
                if (!error) {
                    console.log('Success! The SID for this SMS message is:');
                    console.log(message.sid);
                    console.log('Message sent on:');
                    console.log(message.dateCreated);
                } else {
                    console.log(error);
                }
            });
        });
        res.render('remindusers', {title: 'Remind Users', users: user })
    }); 
});

router.get('/selectiveshifts', function(req, res){
    Account.find({}).exec(function(err, users) {   
        if (err) throw err;
        res.render('hoursandsite', {title: 'Hours and Site', users: users })
    }); 
});

router.get('/removeusers', function(req, res){
    Account.find({}).exec(function(err, users) {   
        if (err) throw err;
        res.render('removeusers', {title: 'Remove Users', users: users })
    }); 
});
router.post('/removeusers', user_controller.remove_users, function(req, res){
    res.send({user: req.user});
});
module.exports = router;
