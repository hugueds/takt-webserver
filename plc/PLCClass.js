const snap7 = require('node-snap7');

// 589856
class PLC {

    constructor(ip, rack, slot) {
        this.s7 = new snap7.S7Client();
        this.ip = ip;
        this.rack = rack;
        this.slot = slot;
        this.locked = false;
    }

    connect() {
        if (this.locked) {
            return;
        }
        try {
            this.locked = true;
            this.s7.ConnectTo(this.ip, this.rack, this.slot, (err) => {
                this.locked = false;
                if (err)
                    this._handleConnectionError(err);
                else
                    console.log(`PLC Connected at ${this.ip}`);

            });
        } catch (err) {
            this._handleConnectionError(err);
        }
    }

    disconnect() {
        return this.s7.Disconnect();
    }

    getPLCInfo() {

        if (this.locked) {
            return;
        }
        this.locked = true;
        const Promise = new Promise((resolve, reject) => {
            this.s7.GetCpuInfo((err, data) => {
                if (!err) {
                    console.error(err);
                    this.locked = false;
                    reject();
                    return;
                }
                this.locked = false;
                resolve(data);
                return;
            })
        });
        return Promise;

    }



    _handleConnectionError(err) {
        if (this.locked) {
            return;
        }

        this.locked = true;
        console.log(`Error: ${err} \n PLC ${this.ip} not connected, trying to reconnect...`);
        setTimeout(() => {
            this.s7.Disconnect();
            this.locked = false;
            this.connect();
        }, 5000);

    }

    _handleReadError(err) {
        if (this.locked) {
            return;
        }
        console.error('Reading error: ' + err);
        if (!this.s7.Connected() || err == 589856) {
            this._handleConnectionError(err);
            return;
        }
    }

    _handleWriteError(err) {
        if (this.locked) {
            return;
        }
        console.error('Write Error: ' + err);
        if (!this.s7.Connected()) {
            this._handleConnectionError(err);
            return;
        }
    }


};


module.exports = PLC;
