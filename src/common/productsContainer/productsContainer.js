(function (app) {

    var ProductsContainerController = function ($scope, hotkeys, ProductService, AlertDialogService,
                                                ProgressDialogService, bestWatch, cacheImage) {
        var active = 0;

        var slider = {},
            cover = {};

        $scope.slides = [];
        $scope.slides2 = [];

        $scope.left = function () {
            leftCallback();
        };

        $scope.right = function () {
            rightCallback();
        };

        var updateSlides = function (isLeft) {
            
            var a = $scope.slides;
            var s2 = $scope.slides2;
            var newSlide = a[active];

            if (isLeft && a.length > 1) {
                s2.splice(s2.length - 1, 1);
                s2.unshift(newSlide);
            } else if (!isLeft && a.length > 1) {
              
                var erased = s2[0];
                s2.splice(0, 1);
                var lastSlide;
              
                if(a.length < 5){
                    lastSlide = erased;
                }else if (active + 4 >= a.length && a.length >= 5)  {
                  
                    var indexCurrent = (active + 4) % a.length;
                    lastSlide = a[indexCurrent];
                } else {
                  
                    lastSlide = a[active + 4];
                }
                s2.push(lastSlide);
            }
        };

        var configHotkeys = function () {
            hotkeys.add({
                combo: 'right',
                callback: rightCallback
            });

            hotkeys.add({
                combo: 'left',
                callback: leftCallback
            });
            hotkeys.add({
                combo: 'enter',
                callback: enterCallback
            });
            hotkeys.add({
                combo: 'esc',
                callback: escCallback
            });
        };

        var triggerEvent = function (index) {
            $scope.$broadcast("changeSlideActive", index);
        };

        var onChangeActive = function () {
            $scope.selected = $scope.slides[active];
            $scope.$emit("updatedSelectItem", $scope.selected);
        };

        var rightCallback = function () {

            if (active + 1 > $scope.slides.length - 1) {
                $scope.slides[active].active = false;
                active = 0;
                $scope.slides[active].active = true;
                //onChangeActive();
                //updateSlides(false);
            }
            updateSlides(false);
            $scope.slides[active++].active = false;
            $scope.slides[active].active = true;
            onChangeActive();

        };

        var leftCallback = function () {

            if (active - 1 < 0) {
                $scope.slides[active].active = false;
                active = $scope.slidesToShow.length - 1;
                $scope.slides[active].active = true;
                //onChangeActive();
                //updateSlides(true);
            }
            updateSlides(true);
            $scope.slides[active--].active = false;
            $scope.slides[active].active = true;
            onChangeActive();

        };

        //funcion de apertura de datos de la produccion por enter 
        var enterCallback = function () {
            callDetails();
        };

        //funcion de apertura de datos de la produccion por click 
        $scope.onItemSelected = function (item) {
            callDetails(item);
        };
        
        function callDetails(item){
            
            if(item !== undefined){
                active = item;
            }
            
            if ($scope.slides[active]['progress_sec'] !== undefined && $scope.slides[active]['progress_sec'] !== "") {
                AlertDialogService.show(
                    'alert',
                    'Show video',
                    'Aceptar',
                    configHotkeys
                );
                return;
            }

            ProgressDialogService.start();

            ProductService.getProductWithID($scope.slides[active].id, '')
                .then(function (res) {

                ProgressDialogService.dismiss();
                $scope.selected = res.data.products['0'][0];

                $scope.preview({
                    value: true,
                    item: $scope.selected
                });

                $scope.configKeyboard.restart = function () {
                    configHotkeys();
                };
            });
            
        }

        var escCallback = function () {
            $scope.configKeyboard.restart = function () {
                configHotkeys();
            };
            $scope.preview({
                value: false
            });
        };

        var watchCallback = function (newValue, oldValue) {
            
            if (newValue) {
                //if(!$scope.slides) { return; }
                if ($scope.slides[active] === undefined) {
                    return;
                }
                $scope.slides[active].active = true;
                $scope.selected = $scope.slides[active];

                slider = $('#' + $scope.title.replace(/ /g, '') + 'Slider');
                cover = $('.ProductionItem');

                var div = $('#' + $scope.title.replace(/ /g, '')) /*.attr('href')*/;
                if ($(div).position()) {
                    $('.scroll-area').scrollTop($(div).position().top - 134);
                }

                $('.free-zone').width(cover.outerWidth(true) * $scope.slides.length);
                triggerEvent(active);
                /*
                 $('.scroll-area').stop().animate({
                 scrollTop: $(div).position().top - 134
                 }, 500);
                 */
                $scope.$emit("updatedSelectItem", $scope.selected);
                configHotkeys();
            } else {
                if ($scope.slides) {
                    if ($scope.slides[active]) {
                        $scope.slides[active].active = false;
                        triggerEvent(-1);
                    }
                }
            }
            
        };

        $scope.$on("eventActiveChange", function (event, newValue, oldValue) {
            watchCallback(newValue, oldValue);
        });
        
        bestWatch.watch($scope, 'active', "eventActiveChange", true, $scope);

        $scope.$on("eventSlidesToShow", function (event, newValue, oldValue) {

            if (!newValue) {
                return;
            }

            $scope.slides = newValue;
            var i = 0;
            $scope.slides.map(function (item) {
                item.index = i++;
                //cacheImage.cache(item.image_url,true,item,"image_url");
            });
            $scope.slides2 = $scope.slides.slice(0, active + 5);
        });
        bestWatch.watch($scope, 'slidesToShow', 'eventSlidesToShow', true, $scope);

        $scope.slides2 = $scope.slides.slice(0, active + 5);
        $scope.slides3 = $scope.slides;

    };

    var ProductsContainer = function () {
        return {
            restrict: 'E',
            templateUrl: 'productsContainer/productsContainer.tpl.html',
            controller: 'ProductsContainerController',
            controllerAs: 'ProductsContainerCtrl',
            scope: {
                slidesToShow: '=slides',
                title: '@',
                active: '=',
                preview: '&',
                //selected: '=itemSelected',
                configKeyboard: '=restartKeyboard'
            }

        };
    };

    app.directive('errSrc', function () {
        return {
            link: function (scope, element, attrs) {
                element.bind('error', function () {
                    if (attrs.src != attrs.errSrc) {
                        attrs.$set('src', attrs.errSrc);
                    }
                });
            }
        };
    });

    app.directive('ngSrcNoBind', function () {
        return {
            link: function (scope, element, attrs) {
                var image = scope.$eval(attrs.ngSrcNoBind);
                element[0].src = image;
                //$(element[0]).attr('src',image);
            }
        };
    });


    app.controller('ProductsContainerController', ['$scope', 'hotkeys', 'ProductService',
        'AlertDialogService', 'ProgressDialogService', 'bestWatch',
        'cacheImage', ProductsContainerController]);
    app.directive('productsContainer', ProductsContainer);


}(angular.module("caracolplaylgtvapp.ProductsContainer", [
    'pasvaz.bindonce',
    'ui.router',
    'cfp.hotkeys'
])));