const Bot = require('./telegramBot');
const plc = require('./plc/plc');
const PLC_CONFIG = require('./plc/plcConfig');
const andonControl = {};
let andonInterval = null;
let instances = [];

let bytes = generateBytes(4);

andonControl.start = () => andonInterval = setInterval(checkAndonStatus, 1250);
andonControl.stop = () => clearInterval(andonInterval);

function checkAndonStatus() {
    if (!instances || !instances.length) {
        plc.getInstances2((err, data) => instances = data);
        return;
    }
    plc.getAndons((err, buffer) => {
        let readBytes = generateBytesFromBuffer(buffer);
        for (let i = 0; i < bytes.length; i++) {
            for (let j = 0; j < readBytes.length; j++) {
                if (bytes[i].index == readBytes[j].index) {
                    if (!bytes[i].active && readBytes[j].active) {
                        try {
                            let index = bytes[i].index;
                            let inst = instances || instances.length > 0 ? instances[index] : '';
                            let message = 'Chamando Andon na Instância: ' + index + ' - ' + inst;
                            Bot.sendMessage(process.env.ANDON_LOG_CHAT, message);
                            console.log(message);
                        } catch (err) {
                            console.error('Error na requisição do Telegram', err);
                        }
                    }
                }
            }
        }
        bytes = readBytes;
    });
}


function checkBytes(buffer) {
    const bytes = [];
    for (let i = 0; i < buffer.length; i++) {
        if (buffer[i] > 0) {
            let byte = i;
            for (let bit = 0; bit < 8; bit++) {
                let value = Math.pow(2, bit);
                let ok = ((buffer[i] & value) >> bit) > 0;
                if (ok) {
                    let index = byte * 8 + bit;
                    bytes.push({ index: index, byte: byte, bit: bit, active: true });
                }
            }
        }
    }
    return bytes;
}

function generateBytesFromBuffer(buffer) {
    const bytes = [];
    for (let i = 0; i < buffer.length; i++) {
        let byte = i;
        for (let bit = 0; bit < 8; bit++) {
            let value = Math.pow(2, bit);
            let active = ((buffer[i] & value) >> bit) > 0;
            let index = byte * 8 + bit;
            bytes.push({ index: index, byte: byte, bit: bit, active: active });
        }
    }
    return bytes;
}

function generateBytes(size) {
    const bytes = [];
    for (let i = 0; i < size; i++) {
        let byte = i;
        for (let bit = 0; bit < 8; bit++) {
            let value = Math.pow(2, bit);
            let index = byte * 8 + bit;
            bytes.push({ index: index, byte: byte, bit: bit, active: false });
        }
    }
    return bytes;
}


module.exports = andonControl;