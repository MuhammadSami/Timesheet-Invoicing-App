var express = require('express');
var router = express.Router();
var queries_controller = require('../controllers/queries_logic');


router.get('',function(req,res){
    res.send("... working ...");
});


// queriess/locations/hours/total?location=123FakeSt&start_date=1-1-1&end_date=2-2-2
router.get('/locations/hours',queries_controller.TotalHoursForEachLocationWithDatePeriod);


router.get('/shifts',queries_controller.AllShiftsWithinDatePeriod);
module.exports = router;