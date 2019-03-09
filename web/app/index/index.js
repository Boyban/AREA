'use strict';

angular.module('myApp.index', ['ngRoute'])


    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'index/index.html',
            controller: 'indexCtrl'
        });
    }])

    .controller('indexCtrl', ['$scope', '$location', '$http', '$cookies', "$timeout", function($scope, $location, $http, $cookies, $timeout) {

        $scope.signin = function() { $location.path('/signin'); };
        $scope.signup = function() { $location.path('/signup'); };

        Object.toparams = function ObjecttoParams(obj) {
            let p = [];
            for (var key in obj) {
                p.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return p.join('&');
        };


        $scope.url = $location.url();
        if ($location.url().indexOf('access_token') > -1){
            $scope.loc = $location.url().split('=')[1];
            $http.defaults.headers.common['Authorization'] = $cookies.get('token');
            $http({
                method : "POST",
                url : 'http://localhost:8080/api/registerInstagram',
                data: Object.toparams({ token : $scope.loc })
            }).then(function (res){
                console.log(res);
                if (res.data.logged)
                    $location.path("/discover");
            });
        }

    }]);