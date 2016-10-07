(function (app) {

    var ProductsContainerController = function ($scope, hotkeys, ProductService, AlertDialogService,
                                                ProgressDialogService, bestWatch, cacheImage) {
        var self = this;

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

        var updateSlides2 = function (isLeft) {
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
                onChangeActive();
                updateSlides2(false);

                return;
            }
            $scope.slides[active++].active = false;
            $scope.slides[active].active = true;
            onChangeActive();
            updateSlides2(false);

            //console.log($scope.slides2);

        };

        var leftCallback = function () {

            if (active - 1 < 0) {
                $scope.slides[active].active = false;
                active = $scope.slidesToShow.length - 1;
                $scope.slides[active].active = true;
                onChangeActive();
                updateSlides2(true);
                return;
            }
            $scope.slides[active--].active = false;
            $scope.slides[active].active = true;
            onChangeActive();
            updateSlides2(true);

        };

        var enterCallback = function () {

            if ($scope.slides[active]['progress_sec'] !== undefined && $scope.slides[active]['progress_sec'] !== "") {
                AlertDialogService.show(
                    'alert',
                    'Show video',
                    'Aceptar',
                    configHotkeys
                );
                return;
            }
            var productPremise = ProductService.getProductWithID($scope.slides[active].id, '');

            ProgressDialogService.start();

            productPremise.then(function (res) {

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
        };

        $scope.onItemSelected = function (item) {
            //console.log('item', $scope.slides[item]);

            if ($scope.slides[item]['progress_sec'] !== undefined) {
                AlertDialogService.show(
                    'alert',
                    'Show video',
                    'Aceptar',
                    configHotkeys
                );
                return;
            }
            var productPremise = ProductService.getProductWithID($scope.slides[item].id, '');

            productPremise.then(function (res) {
                //console.log("EN PREVIEW ",res);
                $scope.slides[active].active = false;
                active = item;
                $scope.slides[active].active = true;
                $scope.selected = res.data.products['0'][0];

                $scope.preview({
                    value: true,
                    item: $scope.selected
                });
            });
            $scope.configKeyboard.restart = function () {
                configHotkeys();
            };
          console.log("breaking point");
        };

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
            //var index = 0;
            //if (newValue) {
            //    if (newValue.length > minimum) {
            //        $scope.slides = newValue.concat(newValue.map(function (item) {
            //            item.uniqueId = newValue.indexOf(item);
            //            return item;
            //        })).map(function (item) {
            //            if (item.uniqueId === undefined) {
            //                item.uniqueId = newValue.indexOf(item) + newValue.length;
            //            }
            //            item.index = index++;
            //            return item;
            //        });
            //    } else {
            //        $scope.slides = newValue.map(function (item) {
            //            item.uniqueId = newValue.indexOf(item);
            //            return item;
            //        });
            //    }
            //}
        });
        bestWatch.watch($scope, 'slidesToShow', 'eventSlidesToShow', true, $scope);

        $scope.slides2 = $scope.slides.slice(0, active + 5);

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