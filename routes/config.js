const express = require('express');
const router = express.Router();
const plc = require('../plc/plc');


router.get('/', (req, res, next) => {
    res.json({ message: 'please provide a instance' });
});

router.get('/:instanceId', (req, res, next) => {
    const instance = req.params.instanceId;
    console.log(instance);
    plc.getConfigInstance(instance, (err, data) => {
        if (err) {
            res.json(err);
        }
        res.json(data);
    });
});

module.exports = router;