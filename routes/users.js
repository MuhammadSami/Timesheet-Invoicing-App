var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
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
