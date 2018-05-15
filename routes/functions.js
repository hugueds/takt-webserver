//'use strict';
const colors = require('colors');
const s7 = require('../plc/plc');



exports.index = (req, res, next) => {
    console.log('Conection stablished with: ' + req.ip.slice(7));
    res.render('index');
}

exports.getStopTime = (req, res, next) => {
    let inst = req.params.instance;
    let data = s7.getStopTime(inst);
    res.status(200).json(data);
}

exports.getWagonTimer = (req, res, next) => {
    let inst = req.params.instance;
    let wagon = req.params.wagon;
    let data = s7.getWagonTimer(inst, wagon);
    res.status(200).json(data);
}

exports.updateWagons = (req, res, next) => {
    let inst = req.params.instance;
    let qnt = req.body.quantity;    
    let wagon = req.params.wagon;
    s7.updateWagon(inst, wagon, qnt);
    res.status(201).json({ message: "Quantity Updated", quantity: qnt });
}

exports.updateWagonTimer = (req, res, next) => {
    let inst = req.params.instance;
    let wagon = req.params.wagon;
    let timer = req.body.timer;    

    s7.updateWagonTimer(inst, wagon, timer);
    res.status(201).json({ message: "Wagon " + wagon + " timer updated", timer: timer });
}

exports.updateStopTime = (req, res, next) => {
    let inst = req.params.instance;
    let time = req.body.time;

    s7.updateStopTime(inst, time);
    res.status(201).json({ message: "Stop Time updated", time: time });
}

exports.getInstances = (req, res, next) => {
    s7.getInstances2((err, data) => {
        if (err) 
            return next();
        res.json(data);
    });
}