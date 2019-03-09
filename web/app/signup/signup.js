'use strict';

angular.module('myApp.signup', ['ngRoute', 'ngCookies', 'facebook'])


    .config(['$routeProvider', 'FacebookProvider', function($routeProvider, FacebookProvider) {
        $routeProvider.when('/signup', {
            templateUrl: 'signup/signup.html',
            controller: 'signupCtrl'
        });

        FacebookProvider.init("299009090787184");
    }])

    .controller('signupCtrl', ['$scope', '$location', '$http', '$cookies', 'Facebook', function($scope, $location, $http, $cookies, Facebook) {
        $scope.credentials = {
            fname : '',
            lname : '',
            mail : '',
            password : '',
            rpassword : '',
            error: ''
        };

        $scope.index = function() { $location.path('/index'); };
        $scope.signin = function() { $location.path('/signin'); };

        Object.toparams = function ObjecttoParams(obj) {
            let p = [];
            for (var key in obj) {
                p.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return p.join('&');
        };


        $scope.signup = function() {
            if ($scope.credentials.fname === "" || $scope.credentials.lname === "" || $scope.credentials.mail === ""
            || $scope.credentials.password === "" || $scope.credentials.password !== $scope.credentials.rpassword) {
                $scope.credentials.error = "Please verify your informations";
            }
            $http({
                method: 'POST',
                url : 'http://localhost:8080/api/signup',
                data : Object.toparams($scope.credentials)
            }).then(function (res){
                    if (!res.data.register)
                        $scope.credentials.error = "This mail address is already used.";
                    else {
                        $cookies.put('token', res.data.token.id);
                        $location.path('/discover');
                    }
            });
        };

        $scope.signupOffice = function() {
            window.config = {
                clientId: "0791015d-77c7-4935-b3e3-a66cec281640",
                instance: 'https://login.microsoftonline.com/',
                postLogoutRedirectUri: window.location.origin + "/OAuthCallback",
                redirectUri: window.location.origin,
                popup: true
            };
            let authContext = new AuthenticationContext(config);
            let user = authContext.getCachedUser();
            if (!user) {
                authContext.login();
            }
        };

        $scope.signupFacebook = function() {
            Facebook.login(function(response) {
                $http({
                    method: "POST",
                    url: "http://localhost:8080/api/signupFacebook",
                    data : Object.toparams({ accessToken: response.authResponse.accessToken, userId: response.authResponse.userID })
                }).then(function (res){
                    if (res.data.alreadyExist) {
                        $scope.credentials.error = "User already registred";
                    } else if (res.data.register) {
                        $cookies.put('token', res.data.token.id);
                        $location.path('/discover');
                    }
                });
            });
        }

    }]);