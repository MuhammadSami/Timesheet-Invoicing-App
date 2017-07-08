var express = require('express');
var passport = require('passport');
var flash = require('connect-flash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var Account = require('../models/account');
var shift_controller = require('../controllers/shift_logic');
var router = express.Router();

// Create an Add Shift 
exports.add_shift = function(req, res){
    console.log(req.body)
     Account.findOne({ 'username': req.user.username }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err){
                return done(err);
            };

            if(req.body.start_date instanceof Array) {
                for(var x = 0; x < req.body.start_date.length; x++){
                    user.shifts.push({
                        start_date: req.body.start_date[x], start_time: req.body.start_time[x], end_time: req.body.end_time[x], 
                        location: req.body.location[x], hours: req.body.hours[x], hourly_rate: req.body.hourly_rate[x],
                        amount: req.body.amount[x],total: req.body.total[x]
                    });
                }
            } else{
                user.shifts.push({
                    start_date: req.body.start_date, start_time: req.body.start_time, end_time: req.body.end_time, 
                    location: req.body.location, hours: req.body.hours, hourly_rate: req.body.hourly_rate,
                    amount: req.body.amount,total: req.body.total
                });
            }            

            user.save(function (err) {
                if (err){
                    return handleError(err);
                } 
                console.log('Success!');
            });
            req.flash('success','Your Shifts have been added to your account.');
            res.redirect('/shifts');
     });
};


exports.all_shifts = function(req,res){
        Account.find({'username': req.user.username }, function(err, user) {
        // if there are any errors, return the error before anything else
        if (err)
            return done(err);    
        res.render(user.shifts);
        console.log(user.username);

    });
};

exports.remove_shift = function(req, res){
    Account.findOne({'username': req.user.username}, function(err, user){
        if (err)
            return done(err);
        console.log(user);
        user.shifts.pull(req.body.shift_id);
        user.save(function (err) {
            if (err) {
                return handleError(err);
            }; 
    });
    res.redirect('/remove')
    });
};

exports.add_holiday = function(req, res){
    Account.find({}, function(err, user) {
        if (err){
            return err;
        }
        var userMap = {};
        user.forEach(function(user) {
            userMap[user._id] = user;
            console.log(user);
            if(req.body.date instanceof Array) {
                for(var x = 0; x < req.body.date.length; x++){
                    user.public_holiday.push({
                        date: req.body.date[x], 
                        description: req.body.holidaydescription[x]
                    });
                }
            }else {
                user.public_holiday.push({
                    date: req.body.date, 
                    description: req.body.holidaydescription
                });
            }
        user.save(function (err) {
            if (err){
                return (err);
            } 
            console.log('Success!');
        });
    });
    req.flash('success','Public Holidays have been updated.');
    res.redirect('/');
     
});
};
// Export Functions.
