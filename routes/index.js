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
    const { message } = req.params;
    console.log(`Sending Message to Telegram\n Message: ${message}`);
    if (message == '' || !message) {
        message = 'Default Message';
    }
    try {
        Bot.sendMessage(process.env.ANDON_LOG_CHAT, message);
    }
    catch (err) {
        next();
    }
    res.status(200).json({ message: message });
});

router.get('/telegram/:group/:message', (req, res, next) => {
    const { group, message } = req.params;
    console.log(`Sending Message to Group: ${group} \n Message: ${message}`);
    if (message === '' || !message) {
        message = 'Default Message';
    }
    try {
        const compositeGroup = 'TELEGRAM_CHAT_' + group || 0;
        Bot.sendMessage(process.env[compositeGroup], message, {parse_mode: 'HTML'});
    }
    catch (err) {
        next();
    }
    res.status(200).json({ message: message });
});


module.exports = router;