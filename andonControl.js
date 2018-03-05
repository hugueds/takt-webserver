const Bot = require('./telegramBot');
const plc = require('./plc/plc');
const PLC_CONFIG = require('./plcConfig');
const andonControl = {};

let bitAndons = [];

function checkAndonStatus()  {
    let buffer = plc.getAndons();
    for (let i = 0; i < buffer.length; i++) {
        if (buffer[i]) {
            console.log('Andon' + i + ' acionado');
        }
    }
    // Pega o byte relacionado ao andon
    // verifica bit a bit se alguns está em 1
    // compara para ver se bit já não está na lista
    // Se não estiver emitir mensagem
}




andonControl.start() = () => {
    setInterval(checkAndonStatus, 1000);
}

module.exports = andonControl;