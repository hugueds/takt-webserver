var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var Conn = new Schema ({ conn : {
	server: String,
	rack : Number,
	slot : Number
}},  { collection : 'conn' });

module.exports = mongoose.model('Conn', Conn);