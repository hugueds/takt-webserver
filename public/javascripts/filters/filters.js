angular.module('appFilters',[])

.filter('takt', function() {
 	return function(ms){
 		var negative = false;
 		var takt;
 		if (ms < 0){
 			negative = true;
 			ms = ms * -1;
 		}
 		var hr = 0,
 		min = (ms/1000/60) << 0,
 		sec = (ms/1000) % 60;
 		if (sec < 10)
 			takt = min+":0"+sec;
 		else
 			takt = min+":"+sec;

 		if (negative)
 			takt = "-" + takt;
 		return takt;
 	}
 });
