(function(app) {

	var CarouselContainerController = function($scope, hotkeys, ProductService, ProgressDialogService, AlertDialogService) {
		var self = this;

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
				var active = getSlideActive();
				if (active + 1 >= $scope.slides.length) {
					$scope.slides[0].active = true;
				} else {
					$scope.slides[active + 1].active = true;
				}
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
								callback: enterCallback,
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

			var escCallback = function() {
				$scope.configKeyboard.restart = function() {
					configHotkeys();
				};
				$scope.preview({
					value: false
				});
			};

			var leftCallback = function() {
				var active = getSlideActive();
				if (active - 1 < 0) {
					$scope.slides[$scope.slides.length - 1].active = true;
				} else {
					$scope.slides[active - 1].active = true;
				}
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
						callback: enterCallback,
					});
					hotkeys.add({
						combo: 'esc',
						callback: escCallback,
					});
				}
			};

			$scope.$watch('active', watchCallback);
		};

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
				configKeyboard: '=restartKeyboard',
			}
		};
	};

	app.controller('CarouselContainerController', ['$scope', 'hotkeys', 'ProductService', 'ProgressDialogService', 'AlertDialogService', CarouselContainerController]);
	app.directive('carouselContainer', CarouselContainer);

}(angular.module("caracolplaylgtvapp.carouselContainer", [
	'ui.router',
	'cfp.hotkeys'
])));