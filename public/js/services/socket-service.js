angular.module('socket-service',[])
.factory('socket', function ($rootScope) {

	const serverLan = 'http://10.8.66.81:8084';
	const serverWifi = 'rpitimerserver';

	var locationServer = 'http://' + window.location.hostname;
	//locationServer = serverLan;

//	var socket = io('/pride');
 	var socket = io('/', {path: '/pride/socket.io'});
	

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
