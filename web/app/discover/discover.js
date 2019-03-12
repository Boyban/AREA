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

    .directive('myEscape', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 27) {
                    scope.$apply(function (){
                        scope.$eval(attrs.myEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    })

    .controller('discoverCtrl', ['$scope', '$location', '$http', '$cookies', '$rootScope', 'socialLoginService', '$timeout', 'Facebook', '$timeout', function($scope, $location, $http, $cookies, $rootScope, socialLoginService, $timeout, Facebook, $interval) {
        $scope.credentials = {
            token : $cookies.get('token'),
            fname : '',
            lname : '',
            mail : ''
        };
        $scope.display = false;

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

        $scope.pickables = {
            mailTimer : {
                hour :  new Date('December 17, 1995 20:00')
            },
            mailTemp : {
                temp : 0,
                location : "Pithiviers"
            },
            mailPPFacebook : {
                mail : ""
            }
        };

        $scope.classId = ["w-timer", "w-weather", "w-instagram", "w-google", "w-facebook"]
        $scope.widgets = [];

        $scope.subscribe = function(id, cl, icon, params) {
            $http.defaults.headers.common['Authorization'] = $scope.credentials.token;
            $scope.widgets.unshift({ class: cl, text: document.getElementById(id.toString()).innerText, icon: icon});
            $http({
                method: 'POST',
                url: "http://localhost:8080/api/addWidget",
                data: Object.toparams({ id: id, cl: $scope.classId.findIndex(x => x === cl), text: document.getElementById(id.toString()).innerText, icon: icon, parameters: Object.toparams(params) })
            }).then(function (res) {
                if (!res.data.logged)
                    $location.path("/");
            });
            $scope.display = false;
            $timeout(function(){
                sortable( document.getElementById('list'), function (item){});
            }, 200);
        };

        $scope.unsubscribe = function(text) {
            $http.defaults.headers.common['Authorization'] = $scope.credentials.token;
            $scope.widgets.splice($scope.widgets.findIndex(item => item.text === text), 1);
            $http({
                method: 'POST',
                url: "http://localhost:8080/api/unsubscribe",
                data: Object.toparams({ text: text })
            }).then(function (res) {
                if (!res.data.logged)
                    $location.path("/");
            });
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
                $scope.widgets = res.data.widgets;
                $scope.widgets.forEach(function (widget) {
                    widget["class"] = $scope.classId[widget.cl];
                });
                $timeout(function(){
                    sortable( document.getElementById('list'), function (item){});
                }, 200);
            });

        $scope.instagram = function() {
            if (!$scope.services.instagram.connected)
                window.location.href = "https://api.instagram.com/oauth/authorize/?client_id=b445544a2a70448c96c3cc1b59ef36ba&redirect_uri=http://localhost:8081&response_type=token";
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
        };

        $scope.logout = function() {
            $http.defaults.headers.common['Authorization'] = $scope.credentials.token;
            $http({
                method : "GET",
                url : 'http://localhost:8080/api/logout'
            }).then(function (){
                $location.path("/");
            });
        };

        $scope.pickWidget = function() {
            $scope.display = true;
        };

        $scope.escape =  function (event) {
            if (event.which == 27)
                $scope.display = false;
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

        function sortable(section, onUpdate){
            var dragEl, nextEl, newPos, dragGhost;

            let oldPos = [...section.children].map(item => {
                console.log(item.id);
                item.draggable = true;
                let pos = document.getElementById(item.id).getBoundingClientRect();
                return pos;
            });

            function _onDragOver(e){
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';

                var target = e.target;
                if( target && target !== dragEl && target.nodeName == 'DIV' ){
                    if(target.classList.contains('inside')) {
                        e.stopPropagation();
                    } else {
                        var targetPos = target.getBoundingClientRect();
                        var next = (e.clientY - targetPos.top) / (targetPos.bottom - targetPos.top) > .1 || (e.clientX - targetPos.left) / (targetPos.right - targetPos.left) > .1;
                        section.insertBefore(dragEl, next && target.nextSibling || target);

                        console.log(oldPos);
                    }
                }
            }

            function _onDragEnd(evt){
                evt.preventDefault();
                newPos = [...section.children].map(child => {
                    let pos = document.getElementById(child.id).getBoundingClientRect();
                    return pos;
                });
                console.log(newPos);
                dragEl.classList.remove('ghost');
                section.removeEventListener('dragover', _onDragOver, false);
                section.removeEventListener('dragend', _onDragEnd, false);

                nextEl !== dragEl.nextSibling ? onUpdate(dragEl) : false;
            }

            section.addEventListener('dragstart', function(e){
                dragEl = e.target;
                nextEl = dragEl.nextSibling;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('Text', dragEl.textContent);

                section.addEventListener('dragover', _onDragOver, false);
                section.addEventListener('dragend', _onDragEnd, false);

                setTimeout(function (){
                    dragEl.classList.add('ghost');
                }, 0)

            });
        };

    }]);