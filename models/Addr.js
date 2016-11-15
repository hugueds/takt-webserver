var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var Addr = new Schema ({
	"process" : String,
	"db" : Number, 
	"init" : Number,
	"takt" : ["offset" : Number, "size" : 4],
	"prod" : ["offset" : Number, "size" : 4],
	"prod" : ["offset" : Number, "size" : 4],
	"prod" : ["offset" : Number, "size" : 4],
	"prod" : ["offset" : Number, "size" : 4],
	"prod" : ["offset" : Number, "size" : 4],
	"prod" : ["offset" : Number, "size" : 4],

}},  { collection : 'addr' });

module.exports = mongoose.model('Addr', Addr);