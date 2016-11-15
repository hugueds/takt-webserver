var express = require('express');
var router = express.Router();
var colors = require('colors');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/config.db');

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log("Conection stablished with: " + req.ip + " " + new Date());
	res.render('index');
});

/* GET Config page. */
router.get('/config', function(req, res, next) {
	db.run(`CREATE TABLE IF NOT EXISTS plc_conn (
		id int
		,address varchar(15)
		,rack integer
		,slot integer
		,location varchar(10)
		,active int
		)`
		);

	db.all(`SELECT * from plc_conn` , function(err, data){
		res.send(data);
	});

	

});

//db.close();

module.exports = router;
