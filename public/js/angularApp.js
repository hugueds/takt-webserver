//MODULO DO PICK TAKT WEBSERVER
angular.module('TaktApp', ['ui.router', 'ui.bootstrap', 'takt-controller', 'appFilters'])
    .constant('SERVER', 'http://10.8.66.81/')
    .constant('HOSTNAME', 'rpitimerserver')
    .constant('PRIDE_PORT', '80')
    .constant('PART_MISSING_PORT', '8080')    
    .config([
        '$stateProvider', '$urlRouterProvider', '$locationProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider) {

            $stateProvider

            .state('takt', {
                url: '/',
                templateUrl: 'templates',
                controller: 'MainCtrl',
                onEnter : function($state, instances) { 
                    instances.checkInstance().then(function (hasInstance){
                        if (!hasInstance) {
                            $state.go('welcome');
                            console.log('There is no instances set');
                        }
                    })
                }
            })

            .state('adjusts', {
                url: '/ajustes',
                templateUrl: 'templates/ajustes/',
                controller: 'Adjust'
            })

            .state('welcome', {
                url : '/welcome',
                templateUrl : 'templates/welcome/',
                controller : 'WelcomeCtrl',
                onEnter : function($state, instances) { 
                    instances.unsetInstances();
                }
            })


            $urlRouterProvider.otherwise('/');
        }
    ]);