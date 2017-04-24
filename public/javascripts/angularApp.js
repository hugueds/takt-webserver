//MODULO DO PICK TAKT WEBSERVER
angular.module('TaktApp', ['ui.router', 'ui.bootstrap', 'takt-controller', 'appFilters'])
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
                        if (!hasInstance) $state.go('welcome');
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