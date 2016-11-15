//Criar metodos para buscar informacoes no PLC
require('node-snap7');
var db = require('../data/db');
var plc = {};
var s7 = new snap7.S7Client();

var ins = [];

var Instance = function(dataBuffer){
	this.instName = dataBuffer.slice(0,18).toString();
	this.lineTakt = dataBuffer.readInt32BE(18,22);
	this.lineStopTime = dataBuffer.readInt32BE(22,26);
	this.produce = dataBuffer.readInt16BE(26,28);
	this.objective =   dataBuffer.readInt16BE(28,30);
	this.lineStopPlan = dataBuffer.readInt32BE(30,34);
	this.logTimer = dataBuffer.readInt32BE(34,38);
	this.logStopTime = dataBuffer.readInt32BE(38,42);
	this.andon = dataBuffer.slice(42,44);
	this.logStopPlan = dataBuffer.slice(42,44);
	this.andonMsg = dataBuffer.slice(44,62).toString();	
	this.wagon = [
	{"enabled" : dataBuffer.slice(62,64), "name" : dataBuffer.slice(64,84).toString(), "quantity" : dataBuffer.readInt16BE(82,84)}
	,{"enabled" : dataBuffer.slice(84,86), "name" : dataBuffer.slice(86,104).toString(), "quantity" : dataBuffer.readInt16BE(104,106)}
	]	
};

var server2 = '10.8.66.8', rack = 0, slot = 2;
var server = '10.33.22.251', rack = 0, slot = 2;

var dbNumber = 8;	//Hard Coded
var dbStart  = 0;
var dbSize = 106;


var data = {};

/*
s7.ConnectTo(server, rack, slot, function(err){
	if(err) return console.log('>> Connection failed. Code#'+err+' - '+s7.ErrorText(err));
	console.log("Connected to PLC at " + server);
});
*/

/*
plc.taktToString = function (buff){
	var negative = false;
	var takt;
	var ms = buff.readInt32BE(0, 4);
	if (ms < 0){
		negative = true;
		ms = ms * -1;
	}
	var hr = 0,
		min = (ms/1000/60) << 0,
		sec = (ms/1000) % 60;
	if (sec < 10){
		takt = min+":0"+sec;
	}
	else{
		takt = min+":"+sec;
	}
	if (negative)
		takt = "-" + takt;
	return takt;
}
*/

/*
plc.getDb = function() {
	var conn = s7.Connected();
	if (!conn)
		return console.log("Not connected Yet");
	var takt1 = s7.DBRead(6, 20, 4);
	var takt2 = s7.DBRead(19, 20, 4);
	takt1 = plc.taktToString(takt1);
	takt2 = plc.taktToString(takt2);
	return {takt1, takt2};
};
*/


plc.getData = function(){
	var conn = s7.Connected();
	if (!conn)
		return console.log("There is no connection with PLC: " + server);
	data = s7.DBRead(dbNumber, dbStart, dbSize);
	ins = new Instance(data);
	return ins;
};


module.exports = plc;
