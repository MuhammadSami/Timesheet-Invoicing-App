var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Total_Shifts = new Schema({
    username: String,
    useremail: String,
    start_date: Date,
    end_date: Date,
    start_time: String,
    end_time: String,
    location: String,
    hours: Number,
    hourly_rate: Number,
    amount: Number,
    status: String,
});

module.exports = mongoose.model('Total_Shifts',Total_Shifts);