const Bot = require('./telegramBot');
const plc = require('./plc/plc');
const PLC_CONFIG = require('./plc/plcConfig');
const andonControl = {};

let bytes = generateBytes(4);

andonControl.start = () => setInterval(checkAndonStatus, 1000);

function checkAndonStatus() {
    let buffer = plc.getAndons();
    // let readBytes = checkBytes(buffer);
    let readBytes = generateBytesFromBuffer(buffer);
    // console.log(readBytes)
    for (let i = 0; i < bytes.length; i++) {        
        for (let j = 0; j < readBytes.length; j++) {
            if (bytes[i].index == readBytes[j].index) {
                if (!bytes[i].active && readBytes[j].active) {                                        
                    console.log('Acionando andon: ', bytes[i]);
                    Bot.sendMessage(process.env.ANDON_LOG_CHAT, "Chamando Andon na Instância: " + bytes[i].index);
                }                                                                 
            }
        }
    }
    bytes = readBytes;    
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
                bytes.push({ index: index, byte: byte, bit: bit, active: active  });
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