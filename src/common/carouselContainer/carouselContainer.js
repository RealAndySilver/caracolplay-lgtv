(function(app) {

	var CarouselContainerController = function($scope, hotkeys, ProductService, ProgressDialogService, AlertDialogService,$state,
                                               bestWatch,$timeout) {
		var self = this;
		$scope.MAX_STRING_SIZE = 200;

		var init = function() {
			self.myInterval = 5000;

			var getSlideActive = function() {
				var slides = $scope.slides;
				for (var i = 0; i < slides.length; i++) {
					if (slides[i].active) {
						return i;
					}
				}
			};

			var rightCallback = function() {

                $timeout(function(){
                    $("a.right.carousel-control")[0].click();
                });
			};

			var enterCallback = function() {
				var active = getSlideActive();

				if ($scope.slides[active]['progress_sec'] !== undefined) {
					AlertDialogService.show(
						'alert',
						'Show video',
						'Aceptar',
						function() {
							hotkeys.add({
								combo: 'enter',
								callback: enterCallback
							});
						}
					);
					return;
				}

				ProgressDialogService.start();
				var productPremise = ProductService.getProductWithID($scope.slides[active].id, '');

				productPremise.then(function(res) {

					$scope.selected = res.data.products['0'][0];

					ProgressDialogService.dismiss();
				});
				$scope.configKeyboard.restart = function() {
					configHotkeys();
				};
				$scope.preview({
					value: true
				});
			};


			$scope.onClickButton = enterCallback;

			var escCallback = function() {
				$scope.configKeyboard.restart = function() {
					configHotkeys();
				};
				$scope.preview({
					value: false
				});
			};

			var leftCallback = function(){
                $timeout(function(){
                    $("a.left.carousel-control")[0].click();
                });
			};

			var watchCallback = function(newValue, oldValue) {
                
				if (newValue) {
					var div = $('#' + $scope.title)/*.attr('href')*/;
					$('.scroll-area').scrollTop($(div).position().top - 134);
					/*
					$('.scroll-area').stop().animate({
						scrollTop: $(div).position().top - 134
					}, 500);
					*/

					$scope.selected = $scope.slides[getSlideActive()];

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
				}
			};

			//$scope.$watch('active', watchCallback);

            $scope.$on("eventActiveChange",function(event,newValue,oldValue){
                watchCallback(newValue,oldValue);
            });
            bestWatch.watch($scope,"active","eventActiveChange",false,$scope);
		};


        var unregister = $scope.$watch("slides.length",function(newValue){
            if($scope.slides.length > 0){
                var addEvent = function(nameEvent){
                    $scope.$on(nameEvent,function(event,newValue,oldValue,target){
                        if(newValue){
                            $scope.selected = target;
                        }
                    });
                };

                for(var i=0, j=$scope.slides.length; i<j; i++){
                    var current = $scope.slides[i];
                    addEvent("eventSlideActive"+i);
                    bestWatch.watch(current,"active","eventSlideActive"+i,true,$scope);
                }
                
                console.log($scope.slides);
                unregister();
            }

        });

		init();
	};

	var CarouselContainer = function() {
		return {
			restrict: 'E',
			templateUrl: 'carouselContainer/carouselContainer.tpl.html',
			controller: 'CarouselContainerController',
			controllerAs: ' CarouselContainerCtrl',
			scope: {
				slides: '=',
				title: '@',
				active: '=',
				preview: '&',
				selected: '=itemSelected',
				configKeyboard: '=restartKeyboard'
			}
		};
	};

	app.controller('CarouselContainerController', ['$scope', 'hotkeys', 'ProductService', 'ProgressDialogService', 'AlertDialogService',
        '$state','bestWatch','$timeout', CarouselContainerController]);
	app.directive('carouselContainer', CarouselContainer);


}(angular.module("caracolplaylgtvapp.carouselContainer", [
	'ui.router',
	'cfp.hotkeys'
])));