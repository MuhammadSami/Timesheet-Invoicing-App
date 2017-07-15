var express = require('express');
var router = express.Router();

/*
 This simply loads the pages. Nothing else.
*/



// Shift 

router.get('/remove', function(req, res){
    res.render('remove', {title: "Remove Shift", user : req.user });
});

router.get('/add', function (req, res) {
    res.render('shift', { title:"Add shift" ,user: req.user });
});


router.get('/all', function(req, res){
    res.render('allshifts', {title:"All Shifts", user: req.user });
});


module.exports = router;
