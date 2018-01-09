angular.module('hello').config([
    '$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('hello', {
                url: '/',
                templateUrl: '/module/hello/views/hello.client.view.jade'
            });
    }
]);