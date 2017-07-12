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
        req.flash('success', 'Successfully deleted '+req.body.firstname);
    });
    res.redirect('/removeusers')
    });
};