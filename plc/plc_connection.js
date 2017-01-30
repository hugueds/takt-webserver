require('node-snap7');
var Conn = require('../models/Conn');
var s7 = new snap7.S7Client();

var server = '10.33.22.251',
	rack = 0,
	slot = 2;

function setConfig (data){
	var config = JSON.stringify(data[0]);
	console.log(config.server);
	return true;
}


/*
s7.ConnectTo(server, rack, slot, function(err){
	if(err) return console.log('>> Connection failed. Code#'+err+' - '+s7.ErrorText(err));
	console.log("Connected to PLC at " + server);	
});
*/

module.exports;
