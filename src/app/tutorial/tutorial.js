(function (app) {
    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('tutorialinit', {
            url: '/tutorial/inicial',
            views: {
                "main": {
                    controller: 'TutorialController',
                    controllerAs: 'tutoCtrl',
                    templateUrl: 'tutorial/tutorial.tpl.html'
                }
            },
            data: {
                pageTitle: 'Tutorial'
            }
        });
    }]);


    app.controller('TutorialController', ['$scope', '$state', 'hotkeys','$rootScope','bestWatch', function ($scope, $state, hotkeys,$rootScope,bestWatch) {
        var self = this;

        $scope.slides = [
            {image: 'assets/img/tutorial/tutorial_1.png', active: true},
            {image: 'assets/img/tutorial/tutorial_2.png', active: false},
            {image: 'assets/img/tutorial/tutorial_3.png', active: false},
            {image: 'assets/img/tutorial/tutorial_4.png', active: false},
            {image: 'assets/img/tutorial/tutorial_5.png', active: false},
            {image: 'assets/img/tutorial/tutorial_6.png', active: false},
            {image: 'assets/img/tutorial/tutorial_7.png', active: false},
            {image: 'assets/img/tutorial/tutorial_8.png', active: false}
        ];
        $scope.isButtonNext = true;

        $scope.$on("onActiveChange",function(event,newValue){
            $scope.isButtonNext = !newValue;
        });
        bestWatch.watch($scope.slides[$scope.slides.length-1],"active","onActiveChange",true,$scope);

        //$scope.$watch("slides[slides.length-1].active", function (newValue, oldValue) {
        //    $scope.isButtonNext = !newValue;
        //});

        $scope.next = function () {
            console.log("click next");
        };

        var init = function () {
            if(localStorage.getItem("tutorial")==="finished2"){
                $state.go("dashboard");
            }
        };

        init();
    }]);

    app.directive('nextButtonCarousel', ['$state', '$timeout', '$rootScope', function ($state, $timeout, $rootScope) {
        return {
            link: function (scope, element, attrs) {
                $("#button-tutorial").focus();
                element.bind("click", function (event) {
                    var ce = scope.$eval(attrs.nextButtonCarousel); //obtengo el estado actual del boton para saber si ya se finalizo el carrusel
                    if (ce) {
                        var node = $("a.right.carousel-control");
                        node[0].click();
                    } else {
                        localStorage.setItem("tutorial","finished2");
                        $rootScope.tutorial = true;
                        $state.go("dashboard");         //en el caso que no sea siguiente es por que el usuario ya ha visto todo el tutorial
                    }
                });
            }
        };
    }]);

    app.directive('hotEnterKey', ['hotkeys','$timeout','$state', function (hotkeys,$timeout,$state) {
        return {
            link: function (scope, element, attrs){
                var enterKeyEvent = function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    event.stopImmediatePropagation();

                    $timeout(function(){
                        var ce = scope.$eval(attrs.hotEnterKey);
                        if(ce){
                            document.querySelector("a.right.carousel-control").click();
                        }else{
                            localStorage.setItem("tutorial]","finished2");
                            $state.go("dashboard");         //en el caso que no sea siguiente es por que el usuario ya ha visto todo el tutorial
                        }
                    });

                };
                hotkeys.add({
                    combo: "enter",
                    callback: enterKeyEvent
                });
            }
        };
    }]);

    app.directive('hotRightKey', ['hotkeys','$timeout','$state', function (hotkeys,$timeout,$state) {
        return {
            link: function (scope, element, attrs) {
                var rightKeyEvent = function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    $timeout(function(){
                        var ce = scope.$eval(attrs.hotEnterKey);
                        if(ce){
                            var node = $("a.right.carousel-control");
                            node[0].click();
                        }else{
                            localStorage.setItem("tutorial]","finished2");
                            $state.go("dashboard");         //en el caso que no sea siguiente es por que el usuario ya ha visto todo el tutorial
                        }
                    });
                };

                hotkeys.add({
                    combo: "right",
                    callback: rightKeyEvent
                });
            }
        };
    }]);

    app.directive('hotLeftKey', ['hotkeys','$timeout', function (hotkeys,$timeout) {
        return {
            link: function (scope, element, attrs) {
                var leftKeyEvent = function(event){
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    $timeout(function(){
                        var node = $("a.left.carousel-control");
                        node[0].click();
                    });
                };

                hotkeys.add({
                    combo: "left",
                    callback: leftKeyEvent
                });
            }
        };
    }]);

}(angular.module("caracolplaylgtvapp.tutorial", [
    'ui.router',
    'cfp.hotkeys'
])));