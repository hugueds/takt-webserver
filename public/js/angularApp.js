//MODULO DO PICK TAKT WEBSERVER
angular.module('TaktApp', ['ui.router', 'ui.bootstrap', 'takt-controller', 'appFilters'])
    .constant('SERVER', 'http://10.8.66.81/')
    .constant('HOSTNAME', 'rpitimerserver')
    .constant('PRIDE_PORT', '8084')
    .constant('PART_MISSING_PORT', '8083')    
    .config([
        '$stateProvider', '$urlRouterProvider', '$locationProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider) {

            $stateProvider

            .state('takt', {
                url: '/',
                templateUrl: 'views',
                controller: 'MainCtrl',
                onEnter : function($state, instances) { 
                    instances.checkInstance().then(function (hasInstance){
                        if (!hasInstance) {
			    setTimeout(function() {
				$state.go('welcome');
			    }, 1000)
                            
                            console.log('There is no instances set');
                        }
                    })
                }
            })

            .state('adjusts', {
                url: '/ajustes',
                templateUrl: 'views/ajustes/',
                controller: 'AdjustCtrl'
            })

            .state('config', {
                url : '/config',
                templateUrl : 'views/config/',
                controller : 'ConfigCtrl'                
            })

            .state('welcome', {
                url : '/welcome',
                templateUrl : 'views/welcome/',
                controller : 'WelcomeCtrl',
                onEnter : function($state, instances) { 
                    instances.unsetInstances();
                }
            })


            $urlRouterProvider.otherwise('/');
        }
    ]);