const InstanceController = require('../InstanceController');


InstanceController.start();

setTimeout(() => InstanceController.stop(), 2000);

