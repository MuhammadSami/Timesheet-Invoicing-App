var express = require('express');
var passport = require('passport');
var flash = require('connect-flash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var jade = require('jade');
var jadeCompiler = require('jade-compiler');
var fs = require('fs');
var Account = require('../models/account');
var email = require('./email');
var router = express.Router();



/*
    Add Shifts
    - get an array of shifts. { shifts: [ {} , {} , {} ]}
    - add each element in the array to the user shifts.
    - save to database.
    - send user email using a template.
    
*/
exports.add_shift = function(req, res){
    Account.findOne({'username': req.user.username}, function(err, user){
        if (err){
            console.log(err); 
            return err;
        }
        
        console.log(req.body);
        
       
       
       
        if(req.start_date instanceof Array) {
            for(var x = 0; x < req.body.start_date.length; x++){
                user.shifts.push({
                    start_date: req.body.start_date[x], end_date: req.body.end_date[x] ,start_time: req.body.start_time[x], end_time: req.body.end_time[x], 
                    location: req.body.location[x], hours: req.body.hours[x], hourly_rate: req.body.hourly_rate[x],
                    amount: req.body.amount[x],total: req.body.total[x],status: "PENDING", totalpay: req.body.totalpay, totalhours: req.body.total_hours
                });

            }
        } else {
            user.shifts.push({
                start_date: req.body.start_date, end_date: req.body.end_date, start_time: req.body.start_time, end_time: req.body.end_time, 
                location: req.body.location, hours: req.body.hours, hourly_rate: req.body.hourly_rate,
                amount: req.body.amount,total: req.body.total,status: "PENDING", totalpay: req.body.totalpay, totalhours: req.body.total_hours
            });
        }
        
        user.save(function (err) {
            if (err){
                return err;
            } 

        req.flash('success',' Your shifts have been successfully added to your account!');
        res.redirect("/shifts");
        });
        
        var array = user.shifts;
        var last_element = array[array.length-1]; 
        var stringify = JSON.stringify(last_element);
        var obj = JSON.parse(stringify);
        console.log(obj.start_date, obj._id);
        console.log(obj);
        var new_shifts = [obj,user];
        
        
        // Email Integration
        email.sendHTMLEmail(req.user.email,'Invoice from Aus Group Protective Invoice',new_shifts,"invoice");
        req.flash('success','An Invoice has been sent to your account');
    });    
};


// View all shifts
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



// Find shifts within two date range.

exports.shifts_within_range = function(req,res){
    var first_date = req.body.first_date;
    var second_date = req.body.second_date;
    if(second_date < first_date){
        // Should be validated on the client side as well.
        // Respond with an error.
    }
    
    //Account.find({ shifts:[]}).where
    
    
};