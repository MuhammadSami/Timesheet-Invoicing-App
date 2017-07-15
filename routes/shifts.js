var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var flash = require('connect-flash');
var nodemailer = require('nodemailer');
var shift_controller = require('../controllers/shift_logic');
var router = express.Router();



// GET /shifts/page
// /shifts/page?size=10&page=2
router.get('/page',shift_controller.page_shifts);


// POST /shifts/
// BODY {shifts: [{ ... , ... , ... }]}
router.post('/add', shift_controller.add_shift, function(req, res){
    res.send({user: req.user});
});

// POST /remove
// BODY { shift_id: String }
router.post('/remove', shift_controller.remove_shift, function(req, res){
    res.send({user: req.user});
});

// GET /date
// BODY { first_date: String , second_date: String , paginate: Number , page: 10 }
router.get('/date',shift_controller.shifts_within_range_user);


module.exports = router;