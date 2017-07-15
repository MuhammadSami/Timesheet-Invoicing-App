var express = require('express');
var Account = require('../models/account');
var Invoice = require('../models/invoice.js');



exports.add_invoice = function(username,email,shifts){
    var invoice = new Invoice({ username: username, email: email, shifts_id: []});
    
    for(var x = 0; x < shifts.length; x++){
         invoice.shifts_id.push(shifts[x]._id);  
    }
    
    invoice.save(function(err){
        if(err){
            console.log(err);
        }
        
        
    });
    
}