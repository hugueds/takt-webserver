'use strict';

/* ARQUIVO QUE CRIA OS MÉTODOS PARA A UTILIZAÇÃO DO SNAP7 PARA TRANSMISSÃO DE DADOS COM O PLC */

//Criar metodos para buscar informacoes no PLC
const snap = require('node-snap7');
const PLC_SERVER = process.env.PLC_SERVER;
const PLC_TAKT = process.env.PLC_TAKT;
const RACK = 0;
const SLOT = 2;
const DB_NUMBER = process.env.DB_INSTANCE_NUMBER || 8;
const DB_START = 0;
const DB_SIZE = process.env.DB_INSTANCE_SIZE || 162;
const adjustInstantSize = 22;
const screenInstanceSize = 162;

var s7 = new snap7.S7Client();

var Instance = require('./ScreenInstance'); // Carrega construtor de dados a serem exibidos na tela
var plc = {};
var data = {};
var ins = [];

plc.connect = () => {
    if (s7.Connect()) return console.log("THE CLIENT IS ALREADY CONNECTED \n");
    console.log(PLC_SERVER);
    s7.ConnectTo(PLC_SERVER, RACK, SLOT, (err) => {
        if (err) return console.error('>> Connection failed. Code#' + err + ' - ' + s7.ErrorText(err));
        return console.log("Connected to PLC at " + PLC_SERVER);
    });
};

plc.disconnect = () => { return s7.Disconnect(); };

plc.getData = (instance) => {
    //ERRO SE NAO HOUVER CONEXAO
    if (!s7.Connected()) return console.log("There is no connection with PLC: " + PLC_SERVER);
    //CALCULA AREA DE DADOS DE ACORDO COM A INSTANCIA
    data = s7.DBRead(DB_NUMBER, (DB_START + (instance * DB_SIZE)), DB_SIZE);
    if (!data || data.length === 0) return console.error("No Data to get!\n");
    return new Instance(data);
};

plc.getWagons = () => {
    var DB_NUMBER = 5;
    var wagon = [];
    if (s7.Connected()) return console.error("There is no connection with PLC: " + PLC_SERVER);
    wagon[0] = s7.DBRead(DB_NUMBER, 14, 2).readInt16BE(0, 2); // Hard Coded
    wagon[1] = s7.DBRead(DB_NUMBER, 16, 2).readInt16BE(0, 2); // Hard Coded 
    console.log(wagon);
    return wagon;
};

plc.updateWagon = (instance, wagon, quantity) => {
    //Alocar Instance, Offset, Inicio
    const DB_NUMBER = 9;
    var start = 0 + (6 + (0 + ((wagon - 1) * 10)));; //FUNCAO HARD CODED
    var size = 2;
    var buff = Buffer.alloc(2);
    buff[1] = quantity;
    buff[0] = 0;
    s7.DBWrite(DB_NUMBER, start, size, buff, (err) => {
        if (err) return console.error(err);
        console.log('WAGON ' + wagon + ' quantity updated');
        console.log(buff);
    });
    return true;
};

plc.getWagonTimer = (instance, wagon) => {
    var DB_NUMBER = 8;
    var size = 4;
    var start = 108 + ((wagon - 1) * 46);
    //108 - 154
    data = s7.DBRead(DB_NUMBER, start, size);
    console.log(data);
    return data;
};

plc.updateWagonTimer = (instance, wagon, ms) => {
    var DB_NUMBER = 9;
    var instanceSize; //Preencher
    var start = 0 + (6 + (2 + ((wagon - 1) * 10))); //FUNCAO HARD CODED
    var size = 4;
    var arr = new Uint32Array(1);
    arr[0] = ms;
    var buff = Buffer.from(arr.buffer);
    buff = buff.swap32();
    s7.DBWrite(DB_NUMBER, start, size, buff, (err) => {
        if (err) return console.error(err);
        console.log('WAGON ' + wagon + ' TIMER UPDATED');
    });
    return true;
};

plc.getStopTime = (instance) => {
    var DB_NUMBER = 8;
    var instanceSize; //Preencher
    var size = 4;
    data = s7.DBRead(DB_NUMBER, 38, size);
    return data;
};

plc.updateStopTime = (instance, ms) => {
    var DB_NUMBER = 9;
    var instanceSize; //Preencher
    var start = 0 + (2); //FUNCAO HARD CODED
    var size = 4;
    var arr = new Uint32Array(1);
    arr[0] = (ms * -1);
    var buff = Buffer.from(arr.buffer);
    buff = buff.swap32();
    s7.DBWrite(DB_NUMBER, start, size, buff, (err) => {
        if (err) return console.error(err);
        console.log('Stop time updated');
        console.log(buff);
    });
    return true;
};

plc.connect();

module.exports = plc;