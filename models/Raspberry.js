var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RaspberrySchema = new Schema({
	name : String,
	local : String, 
	ip	: String	
});


module.exports = mongoose.model('Raspberry', RaspberrySchema);
