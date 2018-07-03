const express = require('express');
const router = express.Router();
const plc = require('../plc/plc');
const ConfigInstance = require('../Models/ConfigInstance');

router.get('/', (req, res, next) => {
    res.json({ message: 'please provide a instance' });
});


router.get('available', (req, res, next) => {
    plc.getInstanceNames( (err,data) => {
        if (err) {
            res.json(err);
            return;
        }
        res.json(data);
    });
});


router.get('/:instanceId', (req, res, next) => {
    const instance = req.params.instanceId;   
    try {
        plc.getConfigInstance(instance, (err, data) => {
            if (err) {
                res.json(err);
                return;
            }
            res.json(data);
        });
    }  catch(err) {
        next();
    }
   
});

router.put('/:instanceId', (req, res, next) => {
    const instanceId = req.params.instanceId;    
    console.log('Recebendo: ' + req.body);
    try {
        plc.updateConfigInstance(instanceId, req.body, (err, data) => {
            if (err) {
                res.json({status: false, message : 'Error during update request'}).status(403);    
            }
            res.json({status: true, message : 'Configuration Updated' + data });
        });
    } catch(err) {
        next();
    }   
    
});

module.exports = router;