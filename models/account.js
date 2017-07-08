var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: {type: String, required:true, unique: true},
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    firstname: String,
    lastname: String,
    phonenumber: {type: String, required:true, unique: true},
    securitylicense: {type: String, required:true, unique: true},
    email: {type: String, required:true, unique: true},
    abnnumber: {type: String, required:true, unique: true},
    shifts: [{
        start_date: String,
        start_time: String,
        end_time: String,
        location: String,
        hours: Number,
        hourly_rate: Number,
        amount: Number,
        total: Number
    }],
    public_holiday:[{
        date: String,
        description: String
    }]
});



Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);