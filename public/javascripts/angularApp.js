 angular;
 var app = angular.module('MainApp', ['ui.router']);

 app.config([
 	'$stateProvider'
 	,'$urlRouterProvider'
 	,'$locationProvider'
 	,function ($stateProvider, $urlRouterProvider, $locationProvider) {

 		$stateProvider.state('index', {
 			url: '/'
 			,templateUrl: 'templates'
 			,controller: 'MainCtrl'
 		})

 		,$stateProvider.state('config', {
 			url: '/config'
 			,templateUrl: 'templates/config'
 			,controller: 'Config'
 			,resolve : {
 				postPromise : ['config', function(config){
 					return o.getConfig();
 				}]
 			}
 		})


	//,$urlRouterProvider.otherwise('home');
	;
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
}]);


 app.factory('socket', function ($rootScope) {
 	var socket = io();
 	return {
 		on: function (eventName, callback) {
 			socket.on(eventName, function () {
 				var args = arguments;
 				$rootScope.$apply(function () {
 					callback.apply(socket, args);
 				});
 			});
 		},
 		emit: function (eventName, data, callback) {
 			socket.emit(eventName, data, function () {
 				var args = arguments;
 				$rootScope.$apply(function () {
 					if (callback) {
 						callback.apply(socket, args);
 					}
 				});
 			})
 		}
 	};
 });

 app.factory('config', '$http', function ($http) {
 	var o = {
 		addr : String
 	}

 	o.getConfig = () =>{
 		return $http.get('/config')
 		.success()
 		.error();
 	}

 	return o;
 });



 app.controller('MainCtrl', ['$scope', '$filter','socket', function($scope, $filter, socket){

 	var randomlyGeneratedUID = Math.random().toString(36).substring(3,16);
 	socket.emit('register', randomlyGeneratedUID);

 	var popidAmount = 8;
 	$scope.popidWagon = [];

 	for (var i=1; i <= popidAmount; i++)
 		$scope.popidWagon.push(i);


 	$scope.consumed = 8;

 	$scope.pctUsed = function(item){
 		var consumed = $scope.consumed;
 		if (consumed < item.popid)
 			return 'wagon-not-used';
 		if (item.popid / popidAmount < 0.7){
 			return 'wagon-used';
 		}
 		else if (item.popid / popidAmount < 0.9) {
 			return 'wagon-used-warning';
 		}
 		else{
 			return 'wagon-used-danger';
 		}
 		return 'wagon-used';
 	} 


 	socket.on('takt-1', function(data){
 		if (data == null){
 			$scope.error = 'Sem Conexao';
 			return ;
 		}
 		$scope.instName = data.instName;
		$scope.lineTakt = 660000;//data.lineTakt;
		$scope.lineStopTime = data.lineStopTime;
		$scope.produced = data.produce;
		$scope.objective = data.objective;
		$scope.lineStopPlan = data.lineStopPlan;
		$scope.logTimer = data.logTimer;
		$scope.logStopTime = data.logStopTime;
		$scope.logStopPlan = data.logStopPlan
		$scope.andon = data.andon;
		$scope.andonMsg = data.andonMsg;
		$scope.wagons = data.wagon;
		$scope.error = '';
	});

 	socket.on('serial', function(data){
 		$scope.serial = data;
 		console.log('Received from Scanner: ' + data);
 	});  

 }]);

 app.controller('Config', ['$scope', function($scope){

 	;
 }]);


 app.filter('takt', function() {
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

