/* ARQUIVO QUE CRIA OS MÉTODOS PARA A UTILIZAÇÃO DO SNAP7 PARA TRANSMISSÃO DE DADOS COM O PLC */

'use strict';
//Criar metodos para buscar informacoes no PLC
require('node-snap7');
var Instance = require('./ScreenInstance'); // Carrega construtor de dados a serem exibidos na tela
var plc = {};
var s7 = new snap7.S7Client();

const server_line = '10.8.66.8', rack = 0, slot = 2
	,server = '10.8.66.82';

const dbNumber = 8	//Hard Coded
	,dbStart  = 0
	,dbSize = 162;

const adjustInstantSize = 22
	, screenInstanceSize = 162;

var data = {};

var ins = [];

plc.connect = () => {
	if (s7.Connect()){
		return console.log("Client Already Connected");
	}
	return connection();
};

plc.disconnect = () => {
	return s7.Disconnect();
};

function connection(){		
	s7.ConnectTo(server, rack, slot, (err) => {
		if(err) 
			return console.log('>> Connection failed. Code#'+err+' - '+s7.ErrorText(err));
		console.log("Connected to PLC at " + server);
	});
}


plc.getData = () => {	
	var conn = s7.Connected();
	if (!conn){
		return console.log("There is no connection with PLC: " + server);		
	}
	data = s7.DBRead(dbNumber, dbStart, dbSize);	
	if (!data)
		return console.log("No Data!");
	ins = new Instance(data);
	return ins;
};

plc.getWagons = () => {
	var dbNumber = 5;
	var wagon =[];
	var conn = s7.Connected();
	if (!conn)
		console.log("There is no connection with PLC: " + server);
	 wagon[0] = s7.DBRead(5, 14, 2).readInt16BE(0,2); // Hard Coded
	 wagon[1] = s7.DBRead(5, 16, 2).readInt16BE(0,2); // Hard Coded 
	console.log(wagon);
	return wagon;
};

plc.updateWagon = (instance, wagon, quantity) => {
	//Alocar Instance, Offset, Inicio
	var dbNumber = 9;
	var start = 0 + (6 + (0 +((wagon -1) * 10)));;	//FUNCAO HARD CODED
	var size = 2;
	var buff = Buffer.alloc(2);
	buff[1] = quantity;
	buff[0] = 0;
	s7.DBWrite(dbNumber, start, size, buff, (err) => {
		if (err) 
			return console.error(err);
		console.log('WAGON '+ wagon +' quantity updated');
		console.log(buff);
	});
	return true;
};

plc.getWagonTimer = (instance, wagon) => {
	var dbNumber = 8;
	var size = 4;	
	var start = 108 + ((wagon - 1) * 46);
	//108 - 154
	data = s7.DBRead(dbNumber, start, size);
	console.log(data);
	return data;
	
};

plc.updateWagonTimer = (instance, wagon, ms) => {
	var dbNumber = 9;
	var instanceSize; //Preencher
	var start = 0 + (6 + (2 +((wagon -1) * 10))); //FUNCAO HARD CODED
	var size = 4;
	var arr = new Uint32Array(1);
	arr[0] = ms;
	var buff = Buffer.from(arr.buffer);
	buff = buff.swap32();
	s7.DBWrite(dbNumber, start, size, buff, (err) => {
		if (err) 
			return console.error(err);
		console.log('WAGON '+ wagon +' timer updated');
		console.log(buff);
	}); 

	return true;
};

plc.getStopTime = (instance) => {
	var dbNumber = 8;
	var instanceSize; //Preencher
	var size = 4;	
	data = s7.DBRead(dbNumber, 38, size);
	console.log(data);
	return data;
	
};

plc.updateStopTime = (instance, ms) => {
	var dbNumber = 9;
	var instanceSize; //Preencher
	var start = 0 + (2); //FUNCAO HARD CODED
	var size = 4;
	var arr = new Uint32Array(1);
	arr[0] = (ms * -1);
	var buff = Buffer.from(arr.buffer);
	buff = buff.swap32();
	s7.DBWrite(dbNumber, start, size, buff, (err) => {
		if (err) 
			return console.error(err);
		console.log('Stop time updated');
		console.log(buff);
	}); 

	return true;
};


module.exports = plc;
