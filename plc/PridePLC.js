const PLCClass = require('./PLCClass');

class PridePLC extends PLCClass {

    constructor(ip, rack, slot, name) {
        super(ip, rack, slot);
        this.name = name;
    }

    getInstances() {

    }

    updateInstances() {

    }

    getTaktTimeInstance() {

    }


}

export default PridePLC;