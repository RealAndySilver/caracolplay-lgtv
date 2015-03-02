(function(app) {

	var ProductsContainerController = function($scope, hotkeys, ProductService, AlertDialogService) {
		var self = this;

		var init = function() {

			var active = 0;

			var slider = {},
				cover = {};

			var configHotkeys = function() {
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
					callback: escCallback,
				});
			};

			var onChangeActive = function() {
				$scope.selected = $scope.slides[active];
				slider.scrollLeft(active * cover.outerWidth(true));
				/*
				slider.stop().animate({
					scrollLeft: active * cover.outerWidth(true)
				}, 500);
				*/
			};

			var rightCallback = function() {
				if (active + 1 > $scope.slides.length - 1) {
					return;
				}
				$scope.slides[active++].active = false;
				$scope.slides[active].active = true;
				onChangeActive();
			};

			var leftCallback = function() {
				if (active - 1 < 0) {
					return;
				}
				$scope.slides[active--].active = false;
				$scope.slides[active].active = true;
				onChangeActive();
			};

			var enterCallback = function() {

				if ($scope.slides[active]['progress_sec'] !== undefined) {
					AlertDialogService.show(
						'alert',
						'Show video',
						'Aceptar',
						configHotkeys
					);
					return;
				}
				var productPremise = ProductService.getProductWithID($scope.slides[active].id, '');

				productPremise.then(function(res) {

					$scope.selected = res.data.products['0'][0];
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

			var watchCallback = function(newValue, oldValue) {
				console.log('active value', $scope.active);
				if (newValue) {
					//if(!$scope.slides) { return; }
					$scope.slides[active].active = true;
					$scope.selected = $scope.slides[active];

					slider = $('#' + $scope.title.replace(/ /g, '') + 'Slider');
					cover = $('.ProductionItem');

					if ($(div).position()) {
						var div = $('#' + $scope.title.replace(/ /g, '')) /*.attr('href')*/ ;
						$('.scroll-area').scrollTop($(div).position().top - 134);
					}

					$('.free-zone').width(cover.outerWidth(true) * $scope.slides.length);

					/*
					$('.scroll-area').stop().animate({
						scrollTop: $(div).position().top - 134
					}, 500);
					*/

					configHotkeys();
				} else {
					if ($scope.slides) {
						if ($scope.slides[active]) {
							$scope.slides[active].active = false;
						}
					}
				}
			};

			$scope.$watch('active', watchCallback);
		};

		init();
	};

	var ProductsContainer = function() {
		return {
			restrict: 'E',
			templateUrl: 'productsContainer/productsContainer.tpl.html',
			controller: 'ProductsContainerController',
			controllerAs: 'ProductsContainerCtrl',
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

	app.directive('errSrc', function() {
		return {
			link: function(scope, element, attrs) {
				element.bind('error', function() {
					if (attrs.src != attrs.errSrc) {
						attrs.$set('src', attrs.errSrc);
					}
				});
			}
		};
	});

	app.controller('ProductsContainerController', ['$scope', 'hotkeys', 'ProductService', 'AlertDialogService', ProductsContainerController]);
	app.directive('productsContainer', ProductsContainer);

}(angular.module("caracolplaylgtvapp.ProductsContainer", [
	'ui.router',
	'cfp.hotkeys'
])));