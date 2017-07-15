var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Invoice = new Schema({
    username: {type: String, required:true},
    email: {type: String, required:true},
    date: Date,
    shifts_id : [{
        id: String,
    }]
});

module.exports = mongoose.model('Invoice',Invoice);