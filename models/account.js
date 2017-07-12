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
        start_date: [],
        end_date: [],
        start_time: [],
        end_time: [],
        location: [],
        hours: [],
        hourly_rate: [],
        amount:[],
        totalpay: Number,
        totalhours: Number,
        status: String,
    }],
    public_holiday:[{
        date: String,
        description: String
    }]
});



Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);