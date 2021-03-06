const snap7 = require('node-snap7');
const Instance = require('../Models/ScreenInstance');
const ConfigInstance = require('../Models/ConfigInstance');
const ConfigInstance2 = require('../Models/ConfigInstance2');
const Takt = require('../Models/TaktInstance');
const PLC_CONFIG = require('./plcConfig');

const s7 = new snap7.S7Client();

const plc = {};
let data = {};

let reconnectionCounter = 0;

plc.connect = () => {
    if (s7.Connected()) {
        return console.error("Client is already connected");
    }
    s7.ConnectTo(PLC_CONFIG.PLC_SERVER, PLC_CONFIG.PLC_RACK, PLC_CONFIG.PLC_SLOT, (err) => {
        if (err) {
            reconnectionCounter++;
            return console.error('>> Connection failed. Code #' + err + ' - ' + s7.ErrorText(err), 'Attempt n ' + reconnectionCounter);
        }
        reconnectionCounter = 0;
        return console.log('>> Connected to PLC at ' + PLC_CONFIG.PLC_SERVER);
    });
};

plc.disconnect = () => {
    return s7.Disconnect();
};

plc.getData = (callback) => {
    if (!s7.Connected()) {
        plc.connect();
        const err = ">> There is no connection with PLC: " + PLC_CONFIG.PLC_SERVER;
        console.error(err);
        return callback(err);        
    }
    // let pointer = (PLC_CONFIG.DB_START + (instance * PLC_CONFIG.DB_SIZE)); // CALCULA AREA DE DADOS DE ACORDO COM A INSTANCIA
    // data = s7.DBRead(PLC_CONFIG.DB_NUMBER, pointer, PLC_CONFIG.DB_SIZE);
    const MAX_INSTANCES = +process.env.MAX_INSTANCES || 19;
    s7.DBRead(PLC_CONFIG.DB_NUMBER, 0, PLC_CONFIG.DB_SIZE * MAX_INSTANCES, function (err, data) {
        if (!data || data.length === 0 || err) {
            console.error(">> No Data to get! - Instance Data");
            return callback(err, null);            
        }
        let pointer = 0;
        const instances = [];
        for (let i = 0; i < MAX_INSTANCES; i++) {
            let inst = data.slice(pointer, pointer + PLC_CONFIG.DB_SIZE);
            pointer = pointer + PLC_CONFIG.DB_SIZE;
            instances.push(new Instance(inst));
        }
        callback(null, instances);
    });
    return;
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
        console.log(`Instance ${instance}, Wagon: ${wagon} Updated`);
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
    const start = PLC_CONFIG.WAGON_START + 2 + (instance * PLC_CONFIG.DB_ADJUST_SIZE) + (wagon * PLC_CONFIG.WAGON_SIZE);
    const size = 4;
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
    if (!s7.Connected()) {
        return console.error(">> There is no connection with PLC: " + PLC_CONFIG.PLC_SERVER);
    }
    let instances = [];
    let size = 19;
    let start = 0;
    console.log('Buscando instâncias no PLC');
    for (let i = 0; i < PLC_CONFIG.MAX_INSTANCES; i++) {
        let dataBuffer = s7.DBRead(PLC_CONFIG.DB_NUMBER, start, size);
        if (dataBuffer) {
            let instNameSize = dataBuffer.readUInt8(1, 2);
            let inst = dataBuffer.slice(2, (2 + instNameSize)).toString('utf-8');
            instances.push(inst);
        } else {
            instances.push('SEM NOME');            
        }
        start += PLC_CONFIG.DB_SIZE;
    }
    return instances;
}

plc.getInstances2 = (callback) => {
    const MAX_INSTANCES = +process.env.MAX_INSTANCES || 19;
    let instances = [];
    plc.getData((err, data) => {
        if (err) 
            return callback(err, null);

        for (let i = 0; i < MAX_INSTANCES; i++) 
            instances.push(data[i].instName);
        
        callback(null, instances);
    });
}

plc.getTaktTimeInstance = (instance) => {
    if (!s7.Connected()) {
        return console.error(">> There is no connection with PLC: " + PLC_CONFIG.PLC_SERVER);
    }
    let pointer = instance * PLC_CONFIG.DB_TAKT_INSTANCE_SIZE;
    let data = s7.DBRead(PLC_CONFIG.DB_TAKT_NUMBER, pointer, PLC_CONFIG.DB_TAKT_INSTANCE_SIZE);
    if (!data || !data.length) {
        return console.error(">> No Takt Data to get");
    }
    return new Takt(data);
}

plc.getConfigInstance = (instance, callback) => {
    if (!s7.Connected()) {
        return console.error(">> There is no connection with PLC: " + PLC_CONFIG.PLC_SERVER);
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

plc.getAndons = (callback) => {    
    s7.DBRead(PLC_CONFIG.DB_ANDON, 0, PLC_CONFIG.DB_ANDON_SIZE, (err, data) => {
        if (err) return callback(err, null);
        callback(null, data);
    });
    return;
}

plc.getAndons2 = (callback) => {
    let start = 0;
    s7.DBRead(PLC_CONFIG.DB_ANDON, start, PLC_CONFIG.DB_ANDON_SIZE, (err, data) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, data);
    });
    return;
}

plc.getConfig2 = (instance, callback) => {
    const configDB = 33;
    const configDBSize = 318;
    const start = instance * configDBSize;

    s7.DBRead(configDB, start, configDBSize, (err, data) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        let configInstance = new ConfigInstance2(data);        
        callback(null, configInstance);
    });
    return;
}

plc.updateConfig2 = (data, callback) => {

    const dbConfigInterface = 3;
    const start = 0;
    const configDBSize = 180;
    const status = 1;   
    const arrayBuffer = new Buffer.alloc(configDBSize);

    arrayBuffer.writeInt16BE(data.instance, 0);
    arrayBuffer.writeInt16BE(data.wagonIndex, 2);
    arrayBuffer.writeInt16BE(data.operationIndex, 4);
    arrayBuffer.writeInt16BE(status, 6);

    // Instance
    arrayBuffer.writeInt8(18, 8);
    arrayBuffer.writeInt8(data.config.name.length, 9);
    arrayBuffer.write(data.config.name, 10);
    arrayBuffer.writeInt16BE(data.config.parallelInstance, 28);
    arrayBuffer.writeInt16BE(data.config.cycleNumber, 30);
    arrayBuffer.writeInt16BE(data.config.wagonNR, 32);

    // Wagon
    arrayBuffer.writeInt8(data.config.wagon.enabled, 34);
    arrayBuffer.writeInt8(32, 36);
    arrayBuffer.writeInt8(data.config.wagon.name.length, 37);
    arrayBuffer.write(data.config.wagon.name, 38);
    arrayBuffer.writeInt16BE(data.config.wagon.numOperations, 70);

    // Operation
    arrayBuffer.writeInt8(data.config.wagon.operation.enabled, 72);
    arrayBuffer.writeInt8(10, 74);
    arrayBuffer.writeInt8(data.config.wagon.operation.name.length, 75);
    arrayBuffer.write(data.config.wagon.operation.name, 76);
    arrayBuffer.writeInt32BE(data.config.wagon.operation.stdTime, 86);

    s7.DBWrite(dbConfigInterface, start, configDBSize, arrayBuffer, (err, res) => {
        if (err) {
            console.error(err);
            return callback(err);            
        }
        callback(null, data);
    });     
}

module.exports = plc;