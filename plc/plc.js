const snap = require('node-snap7');
const Instance = require('../Models/ScreenInstance');
const ConfigInstance = require('../Models/ConfigInstance');
const Takt = require('../Models/TaktInstance');
const PLC_CONFIG = require('./plcConfig');

const s7 = new snap7.S7Client();

const plc = {};
let data = {};
let ins = [];

plc.connect = () => {    
    if (s7.Connected()) {
        return console.error("Client already connected", new Date().toLocaleString());
    }
    s7.ConnectTo(PLC_CONFIG.PLC_SERVER, PLC_CONFIG.PLC_RACK, PLC_CONFIG.PLC_SLOT, (err) => {
        if (err) {
            return console.error('>> Connection failed. Code#' + err + ' - ' + s7.ErrorText(err), new Date().toLocaleString());
        }
        return console.log(">> Connected to PLC at " + PLC_CONFIG.PLC_SERVER, new Date().toLocaleString());
    });
};

plc.disconnect = () => {
    return s7.Disconnect();
};

plc.getData = (instance) => {
    if (!s7.Connected()) {
        return console.error(">> There is no connection with PLC: " + PLC_CONFIG.PLC_SERVER, new Date().toLocaleString()); // ERRO SE NAO HOUVER CONEXAO
    }
    let pointer = (PLC_CONFIG.DB_START + (instance * PLC_CONFIG.DB_SIZE)); // CALCULA AREA DE DADOS DE ACORDO COM A INSTANCIA
    data = s7.DBRead(PLC_CONFIG.DB_NUMBER, pointer, PLC_CONFIG.DB_SIZE);
    if (!data || data.length === 0) {
        return console.error(">> No Data to get! - Get Data", new Date().toLocaleString());
    }
    return new Instance(data);
};

plc.updateWagon = (instance, wagon, quantity) => {
    let start = PLC_CONFIG.WAGON_START + (instance * PLC_CONFIG.DB_ADJUST_SIZE) + (wagon * PLC_CONFIG.WAGON_SIZE);
    let size = 2;
    let buff = Buffer.alloc(size);
    buff.writeInt16BE(quantity);    
    s7.DBWrite(PLC_CONFIG.DB_ADJUST_NUMBER, start, size, buff, (err) => {
        if (err) {
            return console.error(err, new Date().toLocaleString());
        }
        console.log(`Instance ${instance}, Wagon: ${wagon} Updated`, new Date().toLocaleString());
    });
    return true;
};

plc.getWagonTimer = (instance, wagon) => {
    let size = 4;
    let start = 108 + ((wagon - 1) * 46);
    //108 - 154
    data = s7.DBRead(PLC_CONFIG.DB_NUMBER, start, size);
    return data;
};

plc.updateWagonTimer = (instance, wagon, ms) => {
    let start = PLC_CONFIG.WAGON_TIMER + (instance * PLC_CONFIG.DB_ADJUST_SIZE) + (wagon * PLC_CONFIG.WAGON_SIZE);
    var size = 4;
    let arr = new Uint32Array(1);
    arr[0] = ms;
    let buff = Buffer.from(arr.buffer);
    buff = buff.swap32();
    s7.DBWrite(PLC_CONFIG.DB_ADJUST_NUMBER, start, size, buff, (err) => {
        if (err) {
            return console.error(err, new Date().toLocaleString());
        }
        console.log('>> WAGON ' + wagon + '--> TIMER UPDATED');
    });
    return true;
};

plc.getStopTime = (instance) => {
    let size = 4;
    data = s7.DBRead(PLC_CONFIG.DB_NUMBER, 38, size);
    return data;
};

plc.updateStopTime = (instance, ms) => {
    let start = PLC_CONFIG.STOP_TIME + (instance * PLC_CONFIG.DB_ADJUST_SIZE);
    let size = 4;
    let arr = new Uint32Array(1);
    arr[0] = (ms * -1);
    let buff = Buffer.from(arr.buffer);
    buff = buff.swap32();
    s7.DBWrite(PLC_CONFIG.DB_ADJUST_NUMBER, start, size, buff, (err) => {
        if (err) return console.error(err, new Date().toLocaleString());
        console.log('>> STOP TIME UPDATED');
        console.log(buff);
    });
    return true;
};

plc.getInstances = () => {
    let instances = [];    
    let size = 18;
    let start = 0;
    for (let i = 0; i < PLC_CONFIG.MAX_INSTANCES; i++) {
        instances.push(s7.DBRead(PLC_CONFIG.DB_NUMBER, start, size).toString().replace(/[\u0000-\u001f]/g, ""));
        start += PLC_CONFIG.DB_SIZE;
    }
    return instances;
}

plc.getTaktTimeInstance = (instance) => {
    if (!s7.Connected()) {
        return console.error(">> There is no connection with PLC: " + PLC_CONFIG.PLC_SERVER, new Date().toLocaleString());
    }
    let pointer = instance * PLC_CONFIG.DB_TAKT_INSTANCE_SIZE;
    data = s7.DBRead(PLC_CONFIG.DB_TAKT_NUMBER, pointer, PLC_CONFIG.DB_TAKT_INSTANCE_SIZE);
    if (!data || !data.length) {
        return console.error(">> No Takt Data to get!", new Date().toLocaleString());
    }
    return new Takt(data);
}


plc.getConfigInstance = (instance, callback) => {
    if (!s7.Connected()) {
        return console.error(">> There is no connection with PLC: " + PLC_CONFIG.PLC_SERVER, new Date().toLocaleString());
    }
    let pointer = instance * PLC_CONFIG.DB_CONFIG_SIZE;
    
    s7.DBRead(PLC_CONFIG.DB_CONFIG_NUMBER, pointer, PLC_CONFIG.DB_CONFIG_SIZE, (err, buffer) => {
        if (err) {
            console.error(err, new Date().toLocaleString());
            callback(err);
        }
        callback(null, new ConfigInstance(buffer));
    });
}

plc.updateConfigInstance = (instance, data, callback) => {
    if (!s7.Connected()) {
        return console.error(">> There is no connection with PLC: " + PLC_CONFIG.PLC_SERVER, new Date().toLocaleString());
    }

    let pointer = instance * PLC_CONFIG.DB_CONFIG_SIZE;

    let arrayBuffer = new Buffer.alloc(parseInt(PLC_CONFIG.DB_CONFIG_SIZE));

    // arrayBuffer.writeInt8(16);
    arrayBuffer.writeInt8(data.name.length, 1);
    arrayBuffer.write(data.name, 2);

    arrayBuffer.writeInt16BE(parseInt(data.cycleNumber), 18);
    arrayBuffer.writeInt16BE(parseInt(data.wagonNumber), 20);
    arrayBuffer.writeInt16BE(parseInt(data.operatorNumber), 22);
    arrayBuffer.writeInt16BE(parseInt(data.parallelInstance), 24);

    let res = (_par1, _par2) => {
        let _val1 = _par1 ? 1 : 0
        let _val2 = _par2 ? 2 : 0;
        return _val1 | _val2;
    }
    arrayBuffer.writeInt8(res(data.wagon[0].enabled, data.wagon[0].availabilityFirst), 26);
    arrayBuffer.writeInt8(32, 28);
    arrayBuffer.writeInt8(data.wagon[0].name.length, 29);
    arrayBuffer.write(data.wagon[0].name, 30);
    arrayBuffer.writeInt32BE(parseInt(data.wagon[0].stdTime), 62);

    arrayBuffer.writeInt8(res(data.wagon[1].enabled, data.wagon[1].availabilityFirst), 66);
    arrayBuffer.writeInt8(32, 68);
    arrayBuffer.writeInt8(data.wagon[1].name.length, 69);
    arrayBuffer.write(data.wagon[1].name, 70);
    arrayBuffer.writeInt32BE(parseInt(data.wagon[1].stdTime), 102);


    s7.DBWrite(PLC_CONFIG.DB_CONFIG_NUMBER, pointer, PLC_CONFIG.DB_CONFIG_SIZE, arrayBuffer, (err, response) => {
        if (err) {
            console.error(err, new Date().toLocaleString());
            callback(err);
        }
        callback(null, new ConfigInstance(response));
    });
}

plc.getAndons = () => {
    let start = 0;
    let bytes =  s7.DBRead(PLC_CONFIG.DB_ANDON, start, PLC_CONFIG.DB_ANDON_SIZE);        
    return bytes;
}


module.exports = plc;