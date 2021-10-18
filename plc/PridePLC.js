const PLCClass = require('./PLCClass');
const ScreenInstance = require('../Models/ScreenInstance');
require('dotenv').config();

const start = 0;
class PridePLC extends PLCClass {

    constructor(ip, rack, slot, name) {
        super(ip, rack, slot);
        this.name = name;
        this.maxInstances = +process.env.MAX_INSTANCES || 19;
        this.db = {            
            number: +process.env.DB_INSTANCE_NUMBER,
            start: +process.env.DB_INSTANCE_START,
            size: +process.env.DB_INSTANCE_SIZE
        }
        this.instanceSize = +process.env.DB_INSTANCE_SIZE;
    }

    async getInstances() {

        if (this.locked)
            return;

        this.locked = true;

        try {
            const data = await this.s7.DBRead(this.db.number, this.db.start, this.db.size * this.maxInstances);
            if (!data) {
                console.error("PridePLC::getInstances::No instances to GET");
                return;
            }            
            const instances = [];
            let pointer = 0;
            for (let i = 0; i < this.maxInstances; i++) {
                let inst = data.slice(pointer, pointer + this.db.size);
                pointer = pointer + this.db.size;
                instances.push(new ScreenInstance(inst));
            }
            return instances;
        }
        catch (err){
            console.error(err)
            console.error("PridePLC::getInstances::Error during PLC Request");
            return null;
        }
        finally {
            this.locked = false;
        }

    }

    updateInstances() {

    }

    getTaktTimeInstance() {

    }


}

module.exports = PridePLC;