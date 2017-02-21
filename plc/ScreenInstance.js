var Instance = function(dataBuffer) {
    if (!dataBuffer || dataBuffer.length === 0) return console.error("There is no Buffer from PLC!");

    this.instName = dataBuffer.slice(0, 18).toString() || null; //Nome da instância
    this.lineTakt = dataBuffer.readInt32BE(18, 22) || 0; //Takt da linha
    this.lineStopTime = dataBuffer.readInt32BE(22, 26) || null; //Stop time da linha
    this.produced = dataBuffer.readInt16BE(26, 28) || null; //Produzidos na linha
    this.objective = dataBuffer.readInt16BE(28, 30) || null; //Objetivo do Dia
    this.lineStopPlan = dataBuffer.readInt32BE(30, 34) || null; //Tempo de parada
    this.logTimer = dataBuffer.readInt32BE(34, 38) || null; //Tempo da logistica
    this.logStopTime = dataBuffer.readInt32BE(38, 42) || null; //Stop time da logistica
    this.andon = dataBuffer[42] & 0x01 || 0x00; //dataBuffer.slice(42,44)|| null; //Verifica se há andon chamado, necessita de mascara para separar o Bit
    this.logStopPlan = dataBuffer[42] & 0x00 || 0x00; //Verifica se há parada planejada na logistica, necessita de mascara para separar o Bit
    this.andonMsg = dataBuffer.slice(44, 62).toString() || null; //Mensagem de Andom
    this.cfgTakt = dataBuffer.readInt32BE(62, 66); //Takt configurado na linha
    this.cfgWagonNumber = dataBuffer.readInt16BE(66, 68) || null; //Numero de vagoes
    this.cfgWagonAmount = dataBuffer.readInt16BE(68, 70) || null; //Numero de Popids por vagao
    this.wagon = [{
        "enabled": dataBuffer.slice(70, 72) & 0x00 || 0x00,
        "name": dataBuffer.slice(72, 106).toString(),
        "quantity": dataBuffer.readInt16BE(106, 108),
        "timer": dataBuffer.readInt32BE(108, 112),
        "avaliability": dataBuffer.readInt32BE(112, 116)
    }, {
        "enabled": dataBuffer.slice(116, 118) & 0x00,
        "name": dataBuffer.slice(118, 152).toString('binary'), //.slice(118,152).
        "quantity": dataBuffer.readInt16BE(152, 154),
        "timer": dataBuffer.readInt32BE(154, 158),
        "avaliability": dataBuffer.readInt32BE(158, 162)
    }] || null;
};

module.exports = Instance;