var express = require('express');
var passport = require('passport');
var flash = require('connect-flash');
var async = require('async');
var crypto = require('crypto');
var Account = require('../models/account');
var email = require('./email');
var router = express.Router();
// Load into database
var loadShifts = function(user_shifts,new_shifts){
    for(var x = 0; x < new_shifts.length; x++){
        user_shifts.push(new_shifts);
    }
}

// Load the Shifts into an Array.
var create_shifts = function(content, user){
    var shifts = [];
    if(content.start_date instanceof Array) {
        for(var x = 0; x < content.start_date.length; x++){
            user.shifts.push({
                start_date: content.start_date[x], end_date: content.end_date[x], start_time: content.start_time[x], end_time: content.end_time[x], 
                location: content.location[x], hours: content.hours[x], hourly_rate: content.hourly_rate[x],
                amount: content.amount[x],total: content.total[x], totalhours: content.total_hours, totalpay: content.totalpay,status: "PENDING"
            });
        }
    } else {
        user.shifts.push({
            start_date: content.start_date, end_date: content.end_date ,start_time: content.start_time, end_time: content.end_time, 
            location: content.location, hours: content.hours, hourly_rate: content.hourly_rate,
            amount: content.amount,total: content.total, totalhours: content.total_hours, totalpay: content.totalpay,status: "PENDING"
        });
    }
    
    return [shifts, user];
            
};


// Create an Add Shift 
exports.add_shift = function(req, res){
    
    // Array or single shift.
     Account.findOne({ 'username': req.user.username }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err){
                return err;
            };

            // Load Shifts from body into an array.
            var new_shifts = create_shifts(req.body, req.user);         
            
            // Load into database
            loadShifts(user.shifts,new_shifts)
            console.log(new_shifts);
            
            user.save(function (err) {
                if (err){
                    return err;
                } 
                
                console.log('Success!');
            });
             
            console.log("1 sending email");
            email.sendHTMLEmail(req.user.email,'Invoice from Aus Group Protective Invoice',new_shifts,"invoice");
           
           
           
          
            
            res.redirect('/shifts');
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