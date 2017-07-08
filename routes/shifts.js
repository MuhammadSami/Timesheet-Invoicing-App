var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var flash = require('connect-flash');
var nodemailer = require('nodemailer');
var shift_controller = require('../controllers/shift_logic');
var router = express.Router();

//get public holiday
router.get('/puho', function(req, res){
    Account.find({'username':'admin'}).exec(function(err, users) {   
        if (err) throw err;
        res.render('index', {title: 'Public holiday', users: users })
    }); 
});

// Get All Shifts
router.get('/all', function(req, res){
    res.render('allshifts', {title:"All Shifts", user: req.user });
});

// Add Shifts
router.get('/shifts', function (req, res) {
    res.render('shift', { title:"Add shift" ,user: req.user });
});

router.post('/addshift', shift_controller.add_shift, function(req, res){
    res.send({user: req.user});
});


// Remove Shifts
router.get('/remove', function(req, res){
    res.render('remove', {title: "Remove Shift", user : req.user });
});
router.post('/removeshift', shift_controller.remove_shift, function(req, res){
    res.send({user: req.user});
});



// Edit Shifts


module.exports = router;