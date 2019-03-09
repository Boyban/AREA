'use strict';

angular.module('myApp.discover', ['ngRoute', 'ngCookies', 'socialLogin', 'facebook'])


    .config(['$routeProvider', 'socialProvider', 'FacebookProvider', function($routeProvider, socialProvider, FacebookProvider) {
        $routeProvider.when('/discover', {
            templateUrl: 'discover/discover.html',
            controller: 'discoverCtrl'
        });

        FacebookProvider.init("299009090787184");
        socialProvider.setGoogleKey("914127394687-lpbrt5devsk6ntbe2ufsjktqj66hqa1f.apps.googleusercontent.com");
    }])

    .controller('discoverCtrl', ['$scope', '$location', '$http', '$cookies', '$rootScope', 'socialLoginService', '$timeout', 'Facebook', function($scope, $location, $http, $cookies, $rootScope, socialLoginService, $timeout, Facebook) {
        $scope.credentials = {
            token : $cookies.get('token'),
            fname : '',
            lname : '',
            mail : ''
        };

        $scope.services = {
            facebook : {
                buttonConnect : {
                    text : "Facebook"
                },
                connected : false
            },
            google : {
                buttonConnect : {
                    text : "Google"
                },
                connected : false
            },
            instagram : {
                buttonConnect : {
                    text : "Instagram"
                },
                connected : false
            },
        };

        Object.toparams = function ObjecttoParams(obj) {
            let p = [];
            for (let key in obj) {
                p.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return p.join('&');
        };


        if ($scope.credentials.token === undefined)
            $location.path('/');

        $http.get('http://localhost:8080/api/user/', { headers: {'Authorization': $scope.credentials.token }})
            .then(function(res){
                if (res.data.logged !== undefined && res.data.logged === false)
                    return $location.path("/");
                $scope.credentials.fname = res.data.fname;
                $scope.credentials.lname = res.data.lname;
                $scope.credentials.mail = res.data.mail;
                $scope.services.google.buttonConnect.text = (res.data.serviceCd.Google) ? "Disconnect" : "Connect";
                $scope.services.instagram.buttonConnect.text = (res.data.serviceCd.Instagram) ? "Disconnect" : "Connect";
                $scope.services.facebook.buttonConnect.text = (res.data.serviceCd.Facebook) ? "Disconnect" : "Connect";
                $scope.services.facebook.connected = res.data.serviceCd.Facebook;
                $scope.services.google.connected = res.data.serviceCd.Google;
                $scope.services.instagram.connected = res.data.serviceCd.Instagram;
            });

        $scope.instagram = function() {
            if (!$scope.services.instagram.connected)
                window.location.href = "https://api.instagram.com/oauth/authorize/?client_id=b445544a2a70448c96c3cc1b59ef36ba&redirect_uri=http://localhost:8000&response_type=token";
        };

        $scope.facebook = function() {
            $http.defaults.headers.common['Authorization'] = $scope.credentials.token;
            Facebook.login(function(response) {
                $http({
                    method: "POST",
                    url: "http://localhost:8080/api/registerFacebook",
                    data : Object.toparams({ accessToken: response.authResponse.accessToken, userId: response.authResponse.userID })
                }).then(function (res){
                    if (!res.data.logged)
                        $location.path("/");
                    $scope.services.facebook.buttonConnect.text = "Disconnect";
                    $scope.services.facebook.connected = true;
                });
            });
        }

        $scope.logout = function() {
            $http.defaults.headers.common['Authorization'] = $scope.credentials.token;
            $http({
                method : "GET",
                url : 'http://localhost:8080/api/logout'
            }).then(function (){
                $location.path("/");
            });
        };

        $rootScope.$on('event:social-sign-in-success', function(event, userDetails){
            $http.defaults.headers.common['Authorization'] = $scope.credentials.token;
            $http({
                method : "POST",
                url : 'http://localhost:8080/api/registerGoogle',
                headers : Object.toparams({ Authorization : $scope.credentials.token }),
                data: Object.toparams(userDetails)
            }).then(function (res){
                    if (!res.data.logged)
                        $location.path("/");
                $scope.services.google.buttonConnect.text = "Disconnect";
                $scope.services.google.connected = true;

            });
        });
    }]);