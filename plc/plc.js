'use strict';

const snap = require('node-snap7');
const Instance = require('./ScreenInstance'); // Carrega construtor de dados a serem exibidos na tela
const ConfigInstance = require('../Models/ConfigInstance');
const Takt = require('./TaktInstance'); // Carrega construtor do Takt
const PLC_SERVER = process.env.PLC_SERVER;
const PLC_TAKT = process.env.PLC_TAKT;
const RACK = 0;
const SLOT = 2;
//DBS
const DB_NUMBER = parseInt(process.env.DB_INSTANCE_NUMBER) || 8;
const DB_START = 0;
const DB_SIZE = parseInt(process.env.DB_INSTANCE_SIZE) || 162;
//DB Ajuste
const DB_ADJUST_NUMBER = parseInt(process.env.DB_ADJUST_NUMBER) || 9;
const DB_ADJUST_SIZE = parseInt(process.env.DB_ADJUST_SIZE) || 26;
const WAGON_SIZE = 10;
const WAGON_START = 6;
const WAGON_TIMER = WAGON_START + 2;
const STOP_TIME = 2;
//DB Config
const DB_CONFIG_NUMBER = parseInt(process.env.DB_CONFIG_NUMBER || 7);
const DB_CONFIG_SIZE = parseInt(process.env.DB_CONFIG_SIZE || 106);

//DB TAKT
const DB_TAKT_NUMBER = parseInt(process.env.DB_TAKT_NUMBER) || 67;
const DB_TAKT_INSTANCE_SIZE = parseInt(process.env.DB_TAKT_INSTANCE_SIZE) || 46;

const s7 = new snap7.S7Client();

const plc = {};
var data = {};
var ins = [];

plc.connect = () => {
    if (s7.Connect()) {
        return console.error("Client already connected", new Date().toLocaleString());
    }
    s7.ConnectTo(PLC_SERVER, RACK, SLOT, (err) => {
        if (err) {
            return console.error('>> Connection failed. Code#' + err + ' - ' + s7.ErrorText(err), new Date().toLocaleString());
        }
        return console.log(">> Connected to PLC at " + PLC_SERVER, new Date().toLocaleString());
    });
};

plc.disconnect = () => {
    return s7.Disconnect();
};

plc.getData = (instance) => {
    if (!s7.Connected()) {
        return console.error(">> There is no connection with PLC: " + PLC_SERVER, new Date().toLocaleString()); // ERRO SE NAO HOUVER CONEXAO
    }
    let pointer = (DB_START + (instance * DB_SIZE)); // CALCULA AREA DE DADOS DE ACORDO COM A INSTANCIA
    data = s7.DBRead(DB_NUMBER, pointer, DB_SIZE);
    if (!data || data.length === 0) {
        return console.error(">> No Data to get!\n", new Date().toLocaleString());
    }
    return new Instance(data);
};

plc.updateWagon = (instance, wagon, quantity) => {
    let start = WAGON_START + (instance * DB_ADJUST_SIZE) + (wagon * WAGON_SIZE);
    let size = 2;
    let buff = Buffer.alloc(2);
    buff[0] = 0;
    buff[1] = quantity;
    s7.DBWrite(DB_ADJUST_NUMBER, start, size, buff, (err) => {
        if (err) {
            return console.error(err, new Date().toLocaleString());
        }
        console.log('>> WAGON ' + wagon + '--> QUANTITY UPDATED');
    });
    return true;
};

plc.getWagonTimer = (instance, wagon) => {
    let size = 4;
    let start = 108 + ((wagon - 1) * 46);
    //108 - 154
    data = s7.DBRead(DB_NUMBER, start, size);
    return data;
};

plc.updateWagonTimer = (instance, wagon, ms) => {
    let start = WAGON_TIMER + (instance * DB_ADJUST_SIZE) + (wagon * WAGON_SIZE);
    var size = 4;
    let arr = new Uint32Array(1);
    arr[0] = ms;
    let buff = Buffer.from(arr.buffer);
    buff = buff.swap32();
    s7.DBWrite(DB_ADJUST_NUMBER, start, size, buff, (err) => {
        if (err) {
            return console.error(err, new Date().toLocaleString());
        }
        console.log('>> WAGON ' + wagon + '--> TIMER UPDATED');
    });
    return true;
};

plc.getStopTime = (instance) => {
    let size = 4;
    data = s7.DBRead(DB_NUMBER, 38, size);
    return data;
};

plc.updateStopTime = (instance, ms) => {
    let start = STOP_TIME + (instance * DB_ADJUST_SIZE);
    let size = 4;
    let arr = new Uint32Array(1);
    arr[0] = (ms * -1);
    let buff = Buffer.from(arr.buffer);
    buff = buff.swap32();
    s7.DBWrite(DB_ADJUST_NUMBER, start, size, buff, (err) => {
        if (err) return console.error(err, new Date().toLocaleString());
        console.log('>> STOP TIME UPDATED');
        console.log(buff);
    });
    return true;
};

plc.getInstances = () => {
    let instances = [];
    let maxInstances = 8;
    let size = 18;
    let start = 0;
    for (let i = 0; i < maxInstances; i++) {
        instances.push(s7.DBRead(DB_NUMBER, start, size).toString().replace(/[\u0000-\u001f]/g, ""));
        start += DB_SIZE;
    }
    return instances;
}

plc.getTaktTimeInstance = (instance) => {
    if (!s7.Connected()) {
        return console.error(">> There is no connection with PLC: " + PLC_SERVER, new Date().toLocaleString());
    }
    let pointer = instance * DB_TAKT_INSTANCE_SIZE; // CALCULA AREA DE DADOS DE ACORDO COM A INSTANCIA
    data = s7.DBRead(DB_TAKT_NUMBER, pointer, DB_TAKT_INSTANCE_SIZE);
    if (!data || !data.length) {
        return console.error(">> No Data to get!\n", new Date().toLocaleString());
    }
    return new Takt(data);
}

plc.getConfigInstance = (instance, callback) => {
    if (!s7.Connected()) {
        return console.error(">> There is no connection with PLC: " + PLC_SERVER, new Date().toLocaleString());
    }
    let pointer = instance * DB_CONFIG_SIZE;

    s7.DBRead(DB_CONFIG_NUMBER, pointer, DB_CONFIG_SIZE, (err, buffer) => {
        if (err) {
            console.error(err, new Date().toLocaleString());
            callback(err);
        }
        callback(null, new ConfigInstance(buffer));
    });
}

plc.updateConfigInstance = (instance, data, callback) => {
    if (!s7.Connected()) {
        return console.error(">> There is no connection with PLC: " + PLC_SERVER, new Date().toLocaleString());
    }

    let pointer = instance * DB_CONFIG_SIZE;

    s7.DBWrite(DB_CONFIG_NUMBER, pointer, DB_CONFIG_SIZE, buffer, (err, buffer) => {
        if (err) {
            console.error(err, new Date().toLocaleString());
            callback(err);
        }
        callback(null, new ConfigInstance(buffer));
    });
}



module.exports = plc;