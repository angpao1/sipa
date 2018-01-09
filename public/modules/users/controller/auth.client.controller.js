angular.module('users').controller('AuthController', [
    '$scope',
    function($scope) {
        $scope.signup = function(isValid) {
            if (isValid) {
                alert('Ready signup');
            }
        };

        $scope.login = function(isValid) {
            if (isValid) {
                alert('Ready login');
            }
        };
    }
]);