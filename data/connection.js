/* DEFAULT HARD CODED ADDRESSES */
//server = '10.8.66.8'; //Takt Time Chassis
//server = '10.33.22.251'; //PLC Logistica na  Sala
//server = '?' //PLC LOGISTICA NO P30
/*
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./config.db');

var server = [];

db.run(`CREATE TABLE IF NOT EXISTS plc_conn (
	id int
	,address varchar(15)
	,rack integer
	,slot integer
	,location varchar(10)
	)`
	);

db.all(`SELECT * from plc_conn` , function(err, data){
	console.log(data);
});

db.close();


/*
var setServer = function (err, data){
	var newData = data;	
	return
}
*/



//module.exports = setServer;
