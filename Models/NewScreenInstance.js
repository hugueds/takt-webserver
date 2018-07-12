const NewInstance = function (dataBuffer) {

    if (!dataBuffer || !dataBuffer.length) {
        return console.error("There is no Buffer from PLC!");
    }

    let instNameSize = dataBuffer.readUInt8(1, 2);
    this.instName = dataBuffer.slice(2, (2 + instNameSize)).toString('utf-8') || null;
    this.lineTakt = dataBuffer.readInt32BE(18, 22) || 0; // Takt da linha
    this.lineStopTime = dataBuffer.readInt32BE(22, 26) || null; // Stop time da linha
    this.produced = dataBuffer.readInt16BE(26, 28) || null; // Produzidos na linha
    this.objective = dataBuffer.readInt16BE(28, 30) || null; // Objetivo do Dia
    this.lineStopPlan = dataBuffer.readInt32BE(30, 34) || null; // Tempo de parada
    this.logTimer = dataBuffer.readInt32BE(34, 38) || null; // Tempo da logistica
    this.logStopTime = dataBuffer.readInt32BE(38, 42) || null; // Stop time da logistica
    this.logStopPlan = (dataBuffer[42] & 0x01) > 0; // Verifica se há parada planejada na logistica, necessita de mascara para separar o Bit    
    this.andon_1 = (dataBuffer[42] & 0x01) > 0; 
    this.andon_2 = ((dataBuffer[42] & 0x02) >> 1) > 0;
    this.linePPlan = ((dataBuffer[42] & 0x03) >> 2) > 0;
    this.andonMsg = dataBuffer.slice(44, 62).toString('utf-8') || null; // Mensagem de Andon
    this.cfgTakt = dataBuffer.readInt32BE(62, 66); // Takt configurado na linha
    this.cfgWagonNumber = dataBuffer.readInt16BE(66, 68) || null; // Numero de vagoes
    this.cfgWagonAmount = dataBuffer.readInt16BE(68, 70) || null; // Numero de Popids por vagao    

    /* Implementando funcao para calcular a area dos vagoes */
    
    let wagonNameSizes = [dataBuffer.readUInt8(73, 74), dataBuffer.readUInt8(119, 120)];
    let operationNameSizes = [dataBuffer.readUInt8(137, 138), dataBuffer.readUInt8(187, 188)];
    
    this.wagon = [{
        "enabled": dataBuffer[70] & 0x01 > 0,
        "name": dataBuffer.slice(74, (74 + wagonNameSizes[0])).toString('utf-8'),
        "quantity": dataBuffer.readInt16BE(106, 108),
        "timer": dataBuffer.readInt32BE(108, 112),
        "avaliability": dataBuffer.readInt32BE(112, 116),
        "stopTime": dataBuffer.readInt32BE(116, 120),
        "step": dataBuffer.readInt16BE(120,122),
        "operationName": dataBuffer.slice(124, (124 + operationNameSizes[0])).toString('utf-8')
    }, {
        "enabled": dataBuffer[134] & 0x01 > 0,
        "name": dataBuffer.slice(138, (138 + wagonNameSizes[1])).toString('utf-8'),
        "quantity": dataBuffer.readInt16BE(170, 172),
        "timer": dataBuffer.readInt32BE(172, 176),
        "avaliability": dataBuffer.readInt32BE(176, 180),
        "stopTime": dataBuffer.readInt32BE(180, 184),
        "step": dataBuffer.readInt16BE(184,186),
        "operationName": dataBuffer.slice(188, (188 + operationNameSizes[1])).toString('utf-8')
    }] || null;
};

module.exports = Instance;
