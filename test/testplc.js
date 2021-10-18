const PridePLC = require('../plc/PridePLC');

const pride = new PridePLC('10.8.66.101', 0, 1, 'Pride');

async function start() {

    await pride.connect();

    const instances = await pride.getInstances();

    console.log(instances);

}

start();

