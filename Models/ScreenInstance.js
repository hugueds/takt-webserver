const Instance = function (dataBuffer) {

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
    this.andon = ((dataBuffer[42] & 0x02) >> 1) > 0; // dataBuffer.slice(42,44)|| null; //Verifica se há andon chamado, necessita de mascara para separar o Bit
    this.andonMsg = dataBuffer.slice(44, 62).toString('utf-8') || null; // Mensagem de Andon
    this.cfgTakt = dataBuffer.readInt32BE(62, 66); // Takt configurado na linha
    this.cfgWagonNumber = dataBuffer.readInt16BE(66, 68) || null; // Numero de vagoes
    this.cfgWagonAmount = dataBuffer.readInt16BE(68, 70) || null; // Numero de Popids por vagao    

    /* Implementando funcao para calcular a area dos vagoes */
    let wagonNameSizes = [dataBuffer.readUInt8(73, 74), dataBuffer.readUInt8(119, 120)]
    this.wagon = [{
        "enabled": dataBuffer[70] & 0x01 > 0,
        "name": dataBuffer.slice(74, (74 + wagonNameSizes[0])).toString('utf-8'),
        "quantity": dataBuffer.readInt16BE(106, 108),
        "timer": dataBuffer.readInt32BE(108, 112),
        "avaliability": dataBuffer.readInt32BE(112, 116)
    }, {
        "enabled": dataBuffer[116] & 0x01 > 0,
        "name": dataBuffer.slice(120, (120 + wagonNameSizes[1])).toString('utf-8'),
        "quantity": dataBuffer.readInt16BE(152, 154),
        "timer": dataBuffer.readInt32BE(154, 158),
        "avaliability": dataBuffer.readInt32BE(158, 162)
    }] || null;
};

module.exports = Instance;
