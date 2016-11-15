var s7 = require('node-snap7');

//S7Client.ReadArea(area, dbNumber, start, amount, wordLen, [callback])
//S7Client.DBRead(dbNumber, start, amount, wordLen, [callback])
//S7Client.ReadMultiVars(multiVars, [callback])
//S7GetPlcDateTime([callback])
//S7Client.GetCpuInfo([callback]) >> return ModuleType, SeriaNumber, ASName, Copyright, ModuleName
//S7Client.Connected()
/*
multivars = [
	{
	"Area" : S7Client.S7AreaDB,
	"WordLen" : S7Client.S7WLByte,
	"DBNumber" : 1,
	"Start" : 1,
	"Amount" : 1
	},
];
*/

var s7 = new snap7.S7Client();

var server = '10.8.66.8';
var rack = 0;
var slot = 2;


function getDb() {
	s7.DBRead(19, 20, 4, function(err, data){
		if (err) 
			console.log(err);
		var decimal = data.readUIntBE(0, 4);
		console.log(decimal);		
		var ms = decimal,
		min = (ms/1000/60) << 0,
		sec = (ms/1000) % 60;
		if (sec > 59){
			min += 1;
			sec = 0;
		}
		if (sec < 10)
			console.log("%d : 0%d", min, sec);
		else
			console.log("%d:%d", min, sec);
	});		
}		
			
	
s7.ConnectTo(server, rack, slot, function(err){
	if(err) return console.log('>> Connection failed. Code#'+err+' - '+s7.ErrorText(err));
	console.log("Connected");
	
	getDb();
	
});

s7.Disconnect();
