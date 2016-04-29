(function (app) {

    var ProductsContainerController = function ($scope, hotkeys, ProductService, AlertDialogService,
                                                ProgressDialogService, bestWatch, cacheImage) {
        var self = this;
        var minimum = 4;

        var init = function () {

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
                //console.log('slides', slider);
                //console.log('cover', cover.outerWidth(true));
                $scope.selected = $scope.slides[active];
                $scope.$emit("updatedSelectItem", $scope.selected);
                //slider.scrollLeft(active * cover.outerWidth(true));

                //console.log(document.querySelector("#slide_"+encodeURIComponent($scope.title)+"_"+active));
                /*
                 slider.stop().animate({
                 scrollLeft: active * cover.outerWidth(true)
                 }, 500);
                 */
            };

            var rightCallback = function () {

                if (active + 1 > $scope.slides.length - 1) {
                    $scope.slides[active].active = false;
                    active = 0;
                    $scope.slides[active].active = true;
                    //if ($scope.slides.length > minimum) {
                    onChangeActive();
                    //}
                    updateSlides2(false);

                    return;
                }
                $scope.slides[active++].active = false;
                $scope.slides[active].active = true;
                //if ($scope.slides.length > minimum) {
                onChangeActive();
                //}
                updateSlides2(false);


            };

            var leftCallback = function () {

                if (active - 1 < 0) {
                    $scope.slides[active].active = false;
                    active = $scope.slidesToShow.length - 1;
                    $scope.slides[active].active = true;
                    //if ($scope.slides.length > minimum) {
                    onChangeActive();
                    //}
                    updateSlides2(true);
                    return;
                }
                $scope.slides[active--].active = false;
                $scope.slides[active].active = true;
                //if ($scope.slides.length > minimum) {
                onChangeActive();
                //}
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

            $scope.getLoremPixel = function (i) {
                var types = ["abstract", "animals", "business", "cats", "city", "food", "nightlife", "fashion", "people", "nature"];
                var colors = ["1abc9c", "2ecc71", "3498db", "9b59b6", "34495e", "16a085", "27ae60", "2980b9", "8e44ad", "2c3e50", "f1c40f", "e67e22", "e74c3c", "ecf0f1", "95a5a6", "f39c12", "d35400", "c0392b", "bdc3c7", "7f8c8d"];
                var index = parseInt((Math.random() * types.length));


                return "http://lorempixel.com/91/139/" + types[index] + "/" + (i % 10);
                //return "http://ipsumimage.appspot.com/128x193.png,"+colors[index];
            };

            $scope.onItemSelected = function (item) {
                console.log('item', $scope.slides[item]);

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

            //$scope.$watch('active', watchCallback);

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
                    cacheImage.cache(item.image_url,true,item,"image_url");
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

            //$scope.$watch('slidesToShow', function(newValue) {
            //	if (newValue) {
            //		if (newValue.length > minimum) {
            //			$scope.slides = newValue.concat(newValue.map(function(item) {
            //				item.uniqueId = newValue.indexOf(item);
            //				return item;
            //			})).map(function(item) {
            //				if (item.uniqueId === undefined) {
            //					item.uniqueId = newValue.indexOf(item) + newValue.length;
            //				}
            //				return item;
            //			});
            //		} else {
            //			$scope.slides = newValue.map(function(item) {
            //				item.uniqueId = newValue.indexOf(item);
            //				return item;
            //			});
            //		}
            //	}
            //});

            $scope.slides2 = $scope.slides.slice(0, active + 5);
        };

        init();
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