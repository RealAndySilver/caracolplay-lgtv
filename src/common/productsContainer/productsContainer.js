(function (app) {

    var ProductsContainerController = function ($scope, hotkeys, ProductService, AlertDialogService,
                                                ProgressDialogService, bestWatch, cacheImage) {
        
        var active = 0;// variable por defecto de el elemento selecionado 

        var slider = {},
            cover = {};

        $scope.slides = [];// array donde se gunadan el listado completo de las produciones 
        $scope.slides2 = [];// array donde se guardan los 5 producciones mostradas por categoria

        /* llamado de la funcion para correr el slider a la izquierda */
        $scope.left = function () {
            leftCallback();
        };

        /* llamado de la funcion para correr el slider a la derecha */
        $scope.right = function () {
            rightCallback();
        };

        /**funcion que actuliza el listado de elemento de slide2 **/
        var updateSlides = function (isLeft) {
            
            var a = $scope.slides;// variable local que contiene el listado original 
            var s2 = $scope.slides2;// variable local que contiene el listado mostrado 
            var newSlide = a[active];// variable que contiene la producion activa o selecionada

            /**discriminacion de la direcion en que se cambia el slider**/
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

        /** setup de los hotkeys que va a usar el componenete 
        *combo es el nombre concreto de la tecla 
        *callback la funcion que se llama cuando se preciona la tecla señalada en "combo"
        **/
        
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
        
        /**$broadcast es la activación de un suceso inferior 
        *en este caso cuando se cambia de categoria en la navegacion
        **/
        var triggerEvent = function (index) {
            $scope.$broadcast("changeSlideActive", index);
        };

        /**$emit es la activación de un suceso superior 
        *en este caso cuando se actuliza de categoria en la navegacion
        **/
        var onChangeActive = function () {
            $scope.selected = $scope.slides[active];
            $scope.$emit("updatedSelectItem", $scope.selected);
        };
        
        /** funcion de cambio a la derecha **/
        var rightCallback = function () {

            if (active + 1 > $scope.slides.length - 1) {
                $scope.slides[active].active = false;
                active = 0;
                $scope.slides[active].active = true;
                updateSlides(false);
            }
            $scope.slides[active++].active = false;
            $scope.slides[active].active = true;
            updateSlides(false);
            onChangeActive();

        };

        /** funcion de cambio a la izquierda **/
        var leftCallback = function () {

            if (active - 1 < 0) {
                $scope.slides[active].active = false;
                active = $scope.slidesToShow.length - 1;
                $scope.slides[active].active = true;
                updateSlides(true);
            }
            $scope.slides[active--].active = false;
            $scope.slides[active].active = true;
            updateSlides(true);
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
        
        /** funcion que se ejecuta cuando se selecciona una produccion **/
        function callDetails(item){
            
            //discriminacion si es por click o por enter 
            if(item !== undefined){// si el elemento no esta indefinido 
                active = item; //igula el valor de active con item que es la posicion del elemento
            }
            /*discriminacion si cumple con todos los requerimientos para reproducir el video directamente */
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
       
    /** 
    *directiva encargada de leer y remplazar links 
    *caidos o inexistentes 
    *de las imagenes 
    **/
    app.directive('onErrorSrc', function() {
      return {
        link: function(scope, element, attrs) {
          element.bind('error', function() {
            if (attrs.src != attrs.onErrorSrc) {
              attrs.$set('src', attrs.onErrorSrc);
            }
          });
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