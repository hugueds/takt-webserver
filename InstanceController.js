const PridePLC = require('./plc/PridePLC');

class InstanceController {

    constructor() {
        this.interval = null;
        this.intervalTime = 900;
        this.instances = [];
        this.plc = new PridePLC('10.8.66.101', 0, 1, 'Pride');
    }

    async start() {        
        await this.plc.connect();
        this.interval = setInterval(() => this.loop(), this.intervalTime);        
    }

    async loop() {
        this.instances = await this.plc.getInstances();
        console.log('Aquiring PLC DATA');                
    }

    getInstanceNames() {        
        return this.instances.map(x => x.instName);
    }

    print() {
        console.log(this.instances);
    }

    stop() {
        clearInterval(this.interval);        
    }

}

module.exports = new InstanceController();