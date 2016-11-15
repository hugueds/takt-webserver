//Coletar informações do banco
var snap7 = require('node-snap7');
var mongoose = require('mongoose');

var db = "mongodb://localhost/plc-config";

mongoose.connect(db, function(err, data){
	if (!err)
		console.log("MongoDB Connection stablished");
});



module.exports = plc-config;

/*
var server = '10.8.66.8';
var rack = 0;
var slot = 2;
*/

