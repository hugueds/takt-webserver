var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PartLocation = new Schema({
	partID	:	 {type: mongoose.Schema.Types.ObjectId, ref: 'Parts'},
	bufferID :  {type: mongoose.Schema.Types.ObjectId, ref: 'Buffers'},
	corridorID :  {type: mongoose.Schema.Types.ObjectId, ref: 'Corridor'},
	moduleID :  {type: mongoose.Schema.Types.ObjectId, ref: 'Modules'},
	quantity : {type: Number}
});

