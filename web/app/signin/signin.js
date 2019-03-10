'use strict';

angular.module('myApp.signin', ['ngRoute', 'ngCookies', 'facebook'])


    .config(['$routeProvider', 'FacebookProvider', function($routeProvider, FacebookProvider) {
        $routeProvider.when('/signin', {
            templateUrl: 'signin/signin.html',
            controller: 'signinCtrl'
        });

        FacebookProvider.init("299009090787184");
    }])

    .controller('signinCtrl', ['$scope', '$location', '$http', '$cookies', 'Facebook', function($scope, $location, $http, $cookies, Facebook) {

        $scope.credentials = {
            mail : '',
            password : '',
            error : ''
        };

        $scope.index = function() { $location.path('/index'); };
        $scope.signup = function() { $location.path('/signup'); };

        Object.toparams = function ObjecttoParams(obj) {
            let p = [];
            for (var key in obj) {
                p.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return p.join('&');
        };

        $scope.signin = function () {
            if ($scope.credentials.mail === "" || $scope.credentials.password === "")
                return $scope.credentials.error = "Please complete your informations.";
            $http({
                method: 'POST',
                url : 'http://localhost:8080/api/signin',
                data : Object.toparams($scope.credentials)
            }).then(function (res){
                if (!res.data.logged)
                    $scope.credentials.error = "Verify your mail or your password.";
                else {
                    $cookies.put('token', res.data.token.id);
                    $location.path('/discover');
                }
            });
        }

        $scope.signinFacebook = function() {
            Facebook.login(function(response) {
                $http({
                    method: "POST",
                    url: "http://localhost:8080/api/signinFacebook",
                    data : Object.toparams({ accessToken: response.authResponse.accessToken, userId: response.authResponse.userID })
                }).then(function (res){
                    Facebook.api('/me/permissions', 'delete', null);
                    if (!res.data.logged)
                        return $scope.credentials.error = "You're not registred.";
                    $cookies.put('token', res.data.token.id);
                    $location.path('/discover');
                });
            });

        }


    }]);