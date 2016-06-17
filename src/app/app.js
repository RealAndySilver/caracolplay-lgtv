(function (app) {

    app.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
        $httpProvider.interceptors.push('Interceptor');
        $urlRouterProvider.otherwise(function ($injector, $location) {
            $injector.invoke(['$state', function ($state) {
                    $state.go('dashboard');
                }]);
        });
    });

    app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
    ]);


    var init = function ($rootScope, $state) {



        /**
         * Esta funcion almacena en el localStorage la informacion de la sesion
         * */
        $rootScope.saveSessionInfo = function (response,password) {
            var resObj = response.data;
            console.log("EN SAVE SESSION INFO", response);
            if (resObj.status) {
                var userInfo={};
                userInfo.name = resObj.user.data.nombres;
                userInfo.lastname = resObj.user.data.apellidos;
                userInfo.alias = resObj.user.data.alias;
                userInfo.mail = resObj.user.data.mail;
                userInfo.password = password;
                userInfo.session = resObj.session;
                userInfo.uid = resObj.uid;
                userInfo.isSubscription = resObj.user.is_suscription;
                userInfo.timeEnds = resObj.user.time_ends;
                sessionStorage.setItem('sessionInfo', JSON.stringify(userInfo));
            }
        };

        /**
         * Limpia del cache toda la informacion relacionada con la sesion y las credenciales para ingresar
         * a la aplicacion
         * */
        $rootScope.clearAllCacheData=function(){
            localStorage.removeItem('loginCredentials');
            sessionStorage.removeItem('sessionInfo');
        };


        /**
         * Esta funcion almacena en el localStorage la informacion de logueo
         * */
        $rootScope.getLoginCredentials = function () {
            if (localStorage.getItem('loginCredentials')){
                return JSON.parse(localStorage.getItem('loginCredentials'));
            }else{
                return {};
            }
        };

        /**
         * Esta funcion almacena en el sessionStorage la informacion de la sesion
         * */
        $rootScope.getSessionInfo = function () {
            if (sessionStorage.getItem('sessionInfo')){
                return JSON.parse(sessionStorage.getItem('sessionInfo'));
            }else{
                return {};
            }
        };

        /**
         * Esta funcion retorna true si el usuario tiene una session activa
         *
         * * */
        $rootScope.isUserLogged = function () {
            if (sessionStorage.getItem('sessionInfo')){
                return true;
            }else{
                return false;
            }
        };

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (toState.name != "start" && toState.name != "tutorialinit" &&
                    (localStorage.getItem("tutorial") != "finished2")) {
                event.preventDefault();
                $state.go("start");
                return;
            }
        });
    };

    app.run(init);

    var AppController = function ($scope) {
        var self = this;

        var init = function () {

        };

        init();
    };

    app.controller('AppController', ['$scope', AppController]);
    app.value('UserInfo', {
        name: '',
        lastname: '',
        alias: '',
        mail: '',
        password: '',
        session: '',
        uid: '',
        isSubscription: false,
        timeEnds: ''
    });

    app.constant('DevInfo', {
        isInDev: true
    });

    app.value('MyListItems', {
        list: []
    });

    app.filter('nospace', function () {
        return function (value) {
            return (!value) ? '' : value.replace(/ /g, '');
        };
    });

    app.directive('forceFocus',function($timeout){
        return {
            link : function(scope,element,attr){

            }
        };
    });

    app.directive('focusMe', function ($timeout) {
        return {
            scope: {
                trigger: '@focusMe'
            },
            link: function (scope, element) {
                scope.$watch('trigger', function (value) {
                    //console.log("entro en el focusMe %s",value);
                    if (value === "true") {
                        $timeout(function () {
                            element[0].focus();
                        },3);
                    }
                });
            }
        };
    });

    app.directive('ngSrcUnsafe', function () {
        return {
            link: function (scope, element, attrs) {
                var unwatch = scope.$watch("slide.image_url", function (newValue) {
                    element[0].src = newValue;
                });

            }
        };
    });

    app.directive('ngEnter', ['$timeout', function ($timeout) {
            return function (scope, element, attrs) {
                element.bind("keydown keypress", function (event) {
                    if (event.which === 13) {
                        scope.$apply(function () {
                            scope.$eval(attrs.ngEnter);
                        });
                        var e = document.createEvent("MouseEvents");
                        e.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        var worked = element[0].dispatchEvent(e);

                        event.preventDefault();
                    }
                });
            };
        }]);

    app.directive('ngSides', function () {
        return {
            link: function (scope, element, attrs) {
                element.bind("keydown keypress", function (event) {
                    if (event.which === 38) {
                        scope.$apply(function () {
                            scope.$eval(attrs.ngSides, {side: 'up'});
                        });
                        event.preventDefault();
                    } else if (event.which === 39) {
                        scope.$apply(function () {
                            scope.$eval(attrs.ngSides, {side: 'right'});
                        });
                        event.preventDefault();
                    } else if (event.which === 40) {
                        scope.$apply(function () {
                            scope.$eval(attrs.ngSides, {side: 'down'});
                        });
                        event.preventDefault();
                    } else if (event.which === 37) {
                        scope.$apply(function () {
                            scope.$eval(attrs.ngSides, {side: 'left'});
                        });
                        event.preventDefault();
                    }
                });
            }
        };
    });

    app.factory('bestWatch', ['$timeout', function ($timeout) {

            this.watch = function (obj, nameProperty, eventName, initialize, $scope) {
                initialize = initialize || false;
                var virtualProperty;

                if (typeof obj[nameProperty] !== "undefined") {

                    virtualProperty = obj[nameProperty];
                    delete obj[nameProperty];
                }

                Object.defineProperty(obj, nameProperty, {
                    enumerable: true,
                    get: function () {
                        return virtualProperty;
                    },
                    set: function (newValue) {
                        var oldValue = virtualProperty;
                        virtualProperty = newValue;
                        $scope.$broadcast(eventName, virtualProperty, oldValue, obj);
                    }
                });

                if (initialize === true) {
                    $scope.$broadcast(eventName, virtualProperty, null);
                }
            };


            return this;
        }]);



    app.factory('Interceptor', function ($q, $location, $window, $rootScope) {
        return {
            request: function (req) {
                if (!$rootScope.callCounter) {
                    $rootScope.callCounter = 0;
                }
                $rootScope.callCounter++;
                $rootScope.showSpinner = true;
                $('#mydiv').show();
                return req;
            },
            'response': function (response) {
                // do something on success
                $rootScope.callCounter--;
                if ($rootScope.callCounter === 0) {
                    $('#mydiv').hide();
                }

                return response || $q.when(response);
            },
            'responseError': function (rejection) {
                $rootScope.callCounter--;
                if ($rootScope.callCounter === 0) {
                    $('#mydiv').hide();
                    if (rejection.status === 401) {
                        if (app.isLogged()) {
                            $rootScope.$broadcast('unauthorized');
                        }
                    }
                }
                if (rejection.status != 401) {
                    $rootScope.$broadcast('failure');
                }
                return $q.reject(rejection);
            }
        };
    });

}(angular.module("caracolplaylgtvapp", [
    'pasvaz.bindonce',
    'ngAnimate',
    'caracolplaylgtvapp.tutorial',
    'caracolplaylgtvapp.home',
    'caracolplaylgtvapp.about',
    'templates-app',
    'templates-common',
    'ui.router.state',
    'ui.router',
    'ui.select',
    'ui.bootstrap',
    'caracolplaylgtvapp.dashboard',
    'caracolplaylgtvapp.ServerCommunicator',
    'caracolplaylgtvapp.ProductsContainer',
    'cfp.hotkeys',
    'caracolplaylgtvapp.carouselContainer',
    'caracolplaylgtvapp.previewView',
    'caracolplaylgtvapp.previewButton',
    'caracolplaylgtvapp.previewList',
    'caracolplaylgtvapp.seriesProduct',
    'caracolplaylgtvapp.searchView',
    'caracolplaylgtvapp.purchaseView',
    'caracolplaylgtvapp.alertDialogView',
    'caracolplaylgtvapp.videoController',
    'caracolplaylgtvapp.rateAlert',
    'caracolplaylgtvapp.progressDialog',
    'caracolplaylgtvapp.videoModule',
    'caracolplaylgtvapp.start',
    'caracolplaylgtvapp.termsView',
    'caracolplaylgtvapp.generalModalView'
])));

var logs = {
    "list": {},
    "set": function (index, obj) {
        logs.list[index] = obj;
    },
    "get": function (n) {
        return logs.list[n];
    }
};