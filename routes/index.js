'use strict';

const express = require('express');
const router = express.Router();
const plc = require('../routes/functions');

router.route('/').get(plc.index);

router.route('/instances')
    .get(plc.getInstances);

router.route('/instance/:instance/stop-time')
    .get(plc.getStopTime)
    .post(plc.updateStopTime);

router.route('/instance/:instance/wagon/:wagon/timer')
    .get(plc.getWagonTimer)
    .post(plc.updateWagonTimer);

router.route('/instance/:instance/wagon/:wagon/quantity').post(plc.updateWagons);

module.exports = router;


// Criar um configure instance para ver quais takts podem ter por tablet