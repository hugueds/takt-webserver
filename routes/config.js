const express = require('express');
const router = express.Router();
const plc = require('../plc/plc');
const ConfigInstance = require('../Models/ConfigInstance');
const ClientConfig = require('../Models/ClientConfig');

router.post('/', (req, res) => {
    const config = new ClientConfig(req.body);
    console.log(config);
    try {
        plc.updateConfig2(config, (err, data) => {
            if (!err) {
                console.log('Config Instance: ' + config.instance + ' updated');
                res.json(data);
            } else {
                throw new Error(err);
            }
        });
    } catch (err) {
        console.error(err);
        res.json({ message: 'Error during request' }).status(500);
    }
});


router.get('available', (req, res, next) => {
    plc.getInstanceNames((err, data) => {
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
        plc.getConfig2(instance, (err, data) => {
            if (err) {
                return res.json(err);                
            }
            res.json(data);
        });
    } catch (err) {
        res.json({message : 'Error during request'}).status(500);
    }
});

router.put('/:instanceId', (req, res, next) => {
    next();
    // const instanceId = req.params.instanceId;    
    // console.log('Recebendo: ' + req.body);
    // try {
    //     plc.updateConfigInstance(instanceId, req.body, (err, data) => {
    //         if (err) {
    //             res.json({status: false, message : 'Error during update request'}).status(403);    
    //         }
    //         res.json({status: true, message : 'Configuration Updated' + data });
    //     });
    // } catch(err) {
    //     next();
    // }
});

module.exports = router;