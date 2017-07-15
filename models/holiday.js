var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Holiday = new Schema({
    date: {type: String, required: true, unique: true},
    name: {type: String, required: true },
    year: String,
});

module.exports = mongoose.model('Holiday',Holiday);