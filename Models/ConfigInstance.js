module.exports = function ConfigInstance(buffer) {
    if (!buffer || !buffer.length) {
        return;
    }
    this.name = buffer.slice(2, 2 + buffer.readUInt8(1, 2)).toString();
    this.cycleNumber = buffer.readInt16BE(18, 20);
    this.wagonNumber = buffer.readInt16BE(20, 22);
    this.operatorNumber = buffer.readInt16BE(22, 24);
    this.parallelInstance = buffer.readInt16BE(24, 26);
    this.wagon = [{
            "enabled": (buffer[26] & 0x01) > 0,
            "availabilityFirst": ((buffer[26] & 0x02) >> 1) > 0,
            "name": buffer.slice(30, 30 + buffer.readUInt8(29, 30)).toString(),
            "stdTime": buffer.readInt32BE(62, 66)
        },
        {
            "enabled": (buffer[66] & 0x01) > 0,
            "availabilityFirst": ((buffer[66] & 0x02) >> 1) > 0,
            "name": buffer.slice(70, 70 + buffer.readUInt8(69, 70)).toString(),
            "stdTime": buffer.readInt32BE(102, 106)
        }
    ]
}