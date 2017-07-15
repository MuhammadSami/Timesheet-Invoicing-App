var express = require('express');
var router = express.Router();
var controller = require('../controllers/holiday_logic');

// GET /holidays/
router.get('/',controller.get_holidays);

// GET /holidays/check
// RESPONSE: { start_date: '....' , end_date : '....' , year : 0000 }
router.get('check',controller.check_holiday);


// POST /holidays/
// REQUEST: { start_date: '....' , end_date : '....' , year : 0000 }
router.post('/',controller.add_holiday);

// GET /holidays/year
// QUERY year
router.get('year',controller.get_holidays_in_year);

module.exports = router;