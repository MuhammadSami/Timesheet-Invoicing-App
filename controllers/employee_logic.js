var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var flash = require('connect-flash');
var shift_controller = require('../controllers/employee_logic');
var router = express.Router();

exports.all_users = function(req,res){

};

exports.remove_users = function(req, res){
    Account.findOneAndRemove({_id: req.body.user_id}, function(err, user){
        if (err)
            return (err);
        user.save(function (err) {
            if (err) {
                return (err);
            }; 
        
    });
    req.flash('success', 'Successfully deleted '+req.body.firstname);
    res.redirect('/removeusers')
    });
};

exports.remove_shift = function(req, res){
    var shift_id = req.body.shift_id;
    Account.findOne({_id: req.body.user_id}, function(err, user){
        if (err)
            return err;
        
        // Google pull?
        user.shifts.remove(shift_id);
    
        user.save(function (err) {
            if (err) {
                return err;
        };
    });
    req.flash('info', "Shift has been deleted");
    res.redirect('/remove');
    });
};