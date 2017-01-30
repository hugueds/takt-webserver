//MODULO DO PICK TAKT WEBSERVER
angular.module('TaktApp', ['ui.router', 'ui.bootstrap', 'takt-controller',  'appFilters'])
.config([
 	'$stateProvider'
 	,'$urlRouterProvider'
 	,'$locationProvider'
 	,function ($stateProvider, $urlRouterProvider, $locationProvider) {

 		$stateProvider
	 		.state('takt', {
	 			url: '/'
	 			,templateUrl: 'templates'
	 			,controller: 'MainCtrl'
	 		})

	 		.state('adjusts', {
	 			url: '/ajustes'
	 			,templateUrl: 'templates/ajustes/'
	 			,controller: 'Adjust'
	 		});
 		

 		$urlRouterProvider.otherwise('/');
}]);

 