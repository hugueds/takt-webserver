var TaktInstance = function (dataBuffer) {
    if (!dataBuffer || dataBuffer.length === 0) return console.error("Buffer is Empty!");
    this.isActive = dataBuffer[0] & 0x01;
    this.isPPlan = dataBuffer[0] & 0x02;
    this.pplanTime = dataBuffer.readInt32BE(2, 6);
    this.parameters = getTaktParameters(dataBuffer);
    this.cycleEnd = dataBuffer[18] & 0x01;
    this.remainingTime = dataBuffer.readInt32BE(20, 24);
    this.production = dataBuffer.readInt16BE(24, 26);
    this.stopTime = dataBuffer.readInt32BE(26, 30);
    this.overBalance = dataBuffer.readInt16BE(34, 36);
    this.accumulatedBalance = dataBuffer.readInt16BE(36, 38);
    this.buzzer = dataBuffer[38] & 0x01;
    this.prodComplete = dataBuffer[38] & 0x02;
}

function getTaktParameters(dataBuffer) {
    var parameters = [];
    let shifts = 3; //Numero de turnos de trabalho
    let offset = 6;
    let size = 6;
    for (let i = 1; i < shifts; i++) {
        parameters.push({
            standTime: dataBuffer.readInt32BE(offset + 0, offset + 4),
            prodObjective: dataBuffer.readInt16BE(offset + 4, offset + 6)
        });
        offset += size;
    }
    return parameters;
}


module.exports = Takt;
