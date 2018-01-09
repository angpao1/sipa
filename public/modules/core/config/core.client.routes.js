angular.module('core').config([
    '$locationProvider',
    '$urlRouterProvider', function($urlRouterProvider) {
        $locationProvider.hashPrefix('!');
        $urlRouterProvider.otherwise('/');
    }
]);