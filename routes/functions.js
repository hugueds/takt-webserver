//'use strict';
 const colors = require('colors') 
 ,s7 = require('../plc/plc')
 ;

exports.index = (req, res, next) => {
	console.log("Conection stablished with: " + req.ip.slice(7) + " " + new Date());
	res.render('index');
}

exports.getStopTime = (req, res, next) => {
	var inst = req.params.instance
	,data = null;

	data = s7.getStopTime(inst);
	res.status(200).json(data);
}

exports.getWagonTimer = (req, res, next) => {
	var inst = req.params.instance
	,wagon = req.params.wagon
	,data = null;

	data = s7.getWagonTimer(inst, wagon);
	res.status(200).json(data);
}

exports.updateWagons = (req, res, next) => {
	var qnt = req.body.quantity
	,inst = req.params.instance
	,wagon = req.params.wagon;

	s7.updateWagon(inst, wagon, qnt);
	res.status(201).json(req.body);
}

exports.updateWagonTimer = (req, res, next) => {
	var inst = req.params.instance
	,wagon = req.params.wagon
	,timer = req.body.timer;

	s7.updateWagonTimer(inst, wagon, timer);	
	res.status(201).json({message : "Wagon " + wagon + " timer updated", timer: timer});
}

exports.updateStopTime = (req, res, next) => {
	var inst = req.params.instance
	,time = req.body.time;

	s7.updateStopTime(inst, time);	
	res.status(201).json({message : "Stop Time updated", time: time});
}
