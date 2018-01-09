'use strict';

var mainAppModuleName = 'Main'
var mainAppModule = angular.module(mainAppModuleName, ['hello']);

mainAppModule.controller('NameController', ['$scope', '$http', function ($scope, $http) {
    $scope.yourName = 'No Name';
    var users_json = $http.get('/user');
}]);

mainAppModule.filter('sayhello', function () {
    return function (name) {
        return 'Hello, ' + name;
    };
});