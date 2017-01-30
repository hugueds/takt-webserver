//Criar metodos para buscar informacoes no PLC
//Metodos para extrair informacoes do PLC
var s7 = require('node-snap7');
var db = require('../data/db');
var s7 = new snap7.S7Client();

var plc = {};


plc.cpuInfo = function(){
	s7.GetCpuInfo(function(data){
		console.log(data);
	});
};

plc.cpuDt = function(){
	s7.S7GetPlcDateTime(function(data){
		console.log(data);
	});
};

plc.isConnected = function(){
	if (s7.Connected())
		console.log("PLC CONECTADO");
	else
		console.log("PLC DESCONECTADO");
}



plc.getDb = function() {
	var res = s7.DBRead(19, 20, 4);
	var takt = taktToString(res);	
	return takt;
}		

plc.ReadPlc = function(){
	var result = s7.ReadMultiVars(multiVars);
	return result;
}



module.exports = plc;

//S7Client.ReadArea(area, dbNumber, start, amount, wordLen, [callback])
//S7Client.DBRead(dbNumber, start, amount, wordLen, [callback])
//S7Client.ReadMultiVars(multiVars, [callback])
//S7GetPlcDateTime([callback])
//S7Client.GetCpuInfo([callback]) >> return ModuleType, SeriaNumber, ASName, Copyright, ModuleName
//S7Client.Connected()
/*
multivars = [
	{
	"Area" : S7Client.S7AreaDB,
	"WordLen" : S7Client.S7WLByte,
	"DBNumber" : 1,
	"Start" : 1,
	"Amount" : 1
	},
];
*/

