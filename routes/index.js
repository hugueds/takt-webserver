const express = require('express');
const router = express.Router();
const plc = require('../routes/functions');
const Bot = require('../telegramBot');

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

router.get('/telegram/:message', (req, res, next) => {
    let message = req.params.message;
    console.log('Sending Message to Telegram', message);
    if (message == '' || !message) {
        message = 'Default Message';
    }
    try {
        Bot.sendMessage(process.env.HUGO_TELEGRAM, message);
    }
    catch (err) {
        next();
    }
    res.status(200).json({ message : message});
});



module.exports = router;