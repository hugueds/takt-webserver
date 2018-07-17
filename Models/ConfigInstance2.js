const ConfigInstance2 = function (buffer) {
    if (!buffer || !buffer.length) {
        return;
    }
    console.log(buffer.slice(66, 66 + buffer.readUInt8(65, 66)).toString());
    this.name = buffer.slice(2, 2 + buffer.readUInt8(1, 2)).toString();
    this.cycleNumber = buffer.readInt16BE(22, 24);
    this.wagonNR = buffer.readInt16BE(24, 26);
    this.wagon = [
        {
            "enabled": (buffer[26] & 0x01) > 0,
            "name": buffer.slice(30, 30 + buffer.readUInt8(29, 30)).toString(),
            "numOperations": buffer.readInt16BE(62, 64),
            "operations": [
                { "enabled": ((buffer[64] & 0x01) > 0), "name": (buffer.slice(68, 68 + buffer.readUInt8(67, 68)).toString()), "stdTime": buffer.readInt32BE(78, 82) },
                { "enabled": (buffer[82] & 0x01) > 0, "name": buffer.slice(86, 86 + buffer.readUInt8(85, 86)).toString(), "stdTime": buffer.readInt32BE(96, 100) },
                { "enabled": (buffer[100] & 0x01) > 0, "name": buffer.slice(104, 104 + buffer.readUInt8(103, 104)).toString(), "stdTime": buffer.readInt32BE(114, 118) },
                { "enabled": (buffer[118] & 0x01) > 0, "name": buffer.slice(122, 122 + buffer.readUInt8(121, 122)).toString(), "stdTime": buffer.readInt32BE(132, 136) },
                { "enabled": (buffer[136] & 0x01) > 0, "name": buffer.slice(140, 140 + buffer.readUInt8(139, 140)).toString(), "stdTime": buffer.readInt32BE(150, 154) },
                { "enabled": (buffer[154] & 0x01) > 0, "name": buffer.slice(158, 158 + buffer.readUInt8(157, 158)).toString(), "stdTime": buffer.readInt32BE(168, 172) }

            ]
        },
        {
            "enabled": (buffer[172] & 0x01) > 0,
            "name": buffer.slice(176, 176 + buffer.readUInt8(175, 176)).toString(),
            "numOperations": buffer.readInt16BE(208, 210),
            "operations": [
                { "enabled": (buffer[210] & 0x01) > 0, "name": buffer.slice(214, 214 + buffer.readUInt8(213, 214)).toString(), "stdTime": buffer.readInt32BE(224, 228) },
                { "enabled": (buffer[228] & 0x01) > 0, "name": buffer.slice(232, 232 + buffer.readUInt8(231, 232)).toString(), "stdTime": buffer.readInt32BE(242, 246) },
                { "enabled": (buffer[246] & 0x01) > 0, "name": buffer.slice(250, 250 + buffer.readUInt8(249, 250)).toString(), "stdTime": buffer.readInt32BE(260, 264) },
                { "enabled": (buffer[264] & 0x01) > 0, "name": buffer.slice(268, 268 + buffer.readUInt8(267, 268)).toString(), "stdTime": buffer.readInt32BE(278, 282) },
                { "enabled": (buffer[282] & 0x01) > 0, "name": buffer.slice(286, 286 + buffer.readUInt8(285, 286)).toString(), "stdTime": buffer.readInt32BE(296, 300) },
                { "enabled": (buffer[300] & 0x01) > 0, "name": buffer.slice(304, 304 + buffer.readUInt8(303, 304)).toString(), "stdTime": buffer.readInt32BE(314, 318) }
            ]
        }
    ];

    this.configToByteArray = function () { // Config Instance

    }
}



module.exports = ConfigInstance2;