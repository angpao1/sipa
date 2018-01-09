angular.module('hello').filter('sayHello', function () {
    return function (name) {
        return 'Hello, ' + name;
    };
});