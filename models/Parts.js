var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Parts = new Schema({
	number : Number,
	description : String,
	location : String
});


module.exports = mongoose.model('Parts', Parts);