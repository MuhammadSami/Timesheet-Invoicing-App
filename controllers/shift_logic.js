var express = require('express');
var Account = require('../models/account');
var email = require('../utilities/email/email');
var Queries = require('./queries_logic.js');
var Invoice = require('../models/invoice.js');
var flash = require('connect-flash');

exports.add_shift = function(req, res){
    
    Account.findOne({'username': req.user.username}, function(err, user){
        if (err){
            console.log(err); 
            return err;
        }
        
        console.log(req.body);
        
        // Retreive Shifts
        var new_shifts= [];
        
        
        
        // Validates
        
        // load Shifts
        if(req.body.start_date instanceof Array) {
           // conosle.log("multiple shifts!");
            for(var x = 0; x < req.body.start_date.length; x++){
                console.log("add the next shift");
                var shift = {
                    username: user.username,
                    start_date: req.body.start_date[x], end_date: req.body.end_date[x] ,start_time: req.body.start_time[x], end_time: req.body.end_time[x], 
                    location: req.body.location[x], hours: req.body.hours[x], hourly_rate: req.body.hourly_rate[x],
                    amount: req.body.amount[x],status: "PENDING"
                };
                
                user.shifts.push(shift);
                new_shifts.push(shift);

            }
        } else {

            var shift = {
                username: user.username,
                start_date: req.body.start_date, end_date: req.body.end_date, start_time: req.body.start_time, end_time: req.body.end_time, 
                location: req.body.location, hours: req.body.hours, hourly_rate: req.body.hourly_rate,
                amount: req.body.amount,total: req.body.total,status: "PENDING"
            };
            
            user.shifts.push(shift);
            new_shifts.push(shift);
            
           
        }
        
        user.save(function (err) {
            if (err){
                return err;
            } 
            // Storing all shifts
            Queries.add_shifts(new_shifts);
            
            // Create Invoice 
            //Invoice.add_invoice(user.username,user.email,new_shifts);
            
            
  
            // Send Email
            email.sendHTMLEmail(user,'Invoice from Aus Group Protective Invoice',new_shifts,"email/invoice");
            req.flash('info', 'An e-mail has been sent to ' + req.user.email + ' with the invoice.');
            res.redirect("/pages/add");
        });

    });    
};


/*  */
exports.all_shifts = function(req,res){
        Account.find({'username': req.user.username }, function(err, user) {
            if (err)
                return err;  
            res.render(user.shifts);
        });
};


/*
 Using skips is bad for performance.
*/
exports.page_shifts = function(req,res){
    var page_size = req.query.size;
    var page_number = req.query.page;
    
     Account.find({'username': req.user.username }, function(err, user) {
            if (err)
                return err;  
            var page = 1; //user.shifts.slice(page_number * page_size, (page_number + 1) * page_size);
            return res.send({ "shifts" : page});
        });
    
};


exports.remove_shift = function(req, res){
    var shift_id = req.body.shift_id;
    Account.findOne({'username': req.user.username}, function(err, user){
        if (err)
            return err;
        
        user.shifts.pull(shift_id);
        
        user.save(function (err) {
            if (err) {
                return err;
        }; 
    });
    res.redirect('/remove');
    });
};



// Shifts within a date range for user. (Inclusive)
exports.shifts_within_range_user = function(req,res){
    var first_date = new Date(req.body.first_date);
    var second_date = new Date(req.body.second_date);
    if(second_date < first_date){
        return res.render("Your second date cannot be before your first date."); 
    }
    
    Account.findOne({'username': req.user.username},function(err,user){
        if(err){
            return err;
        }
        var shifts = user.shifts;
        var inRange = [];
        for(var x = 0; x < shifts.length; x++){
            var shift_date = new Date(shifts[x].end_date);
            if((shift_date.getTime() >= first_date.getTime()) && (shift_date.getTime() <= second_date.getTime())){
                inRange.push(shifts[x]);
            }
        }
        
        inRange.sort(function(a,b){
            return a.getTime() - b.getTime();
        });
    
        
        res.send(inRange);
    });
    
};