'use strict';

const express = require('express');
const router = express.Router();

var stopTime = require('../routes/functions');

router.route('/').get(stopTime.index);

router.route('/instance/:instance/stop-time')
    .get(stopTime.getStopTime)
    .post(stopTime.updateStopTime);

router.route('/instance/:instance/wagon/:wagon/timer')
    .get(stopTime.getWagonTimer)
    .post(stopTime.updateWagonTimer);

router.route('/instance/:instance/wagon/:wagon/quantity').post(stopTime.updateWagons);

module.exports = router;