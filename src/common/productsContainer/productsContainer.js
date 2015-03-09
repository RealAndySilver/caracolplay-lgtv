(function(app) {

	var ProductsContainerController = function($scope, hotkeys, ProductService, AlertDialogService) {
		var self = this;

		var init = function() {

			var active = 0;

			var slider = {},
				cover = {};

			$scope.slides = [];

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
				if (active + 1 > $scope.slidesToShow.length - 1) {
					$scope.slides[active].active = false;
					active = 0;
					$scope.slides[active].active = true;
					onChangeActive();
					return;
				}
				$scope.slides[active++].active = false;
				$scope.slides[active].active = true;
				onChangeActive();
			};

			var leftCallback = function() {
				if (active - 1 < 0) {
					$scope.slides[active].active = false;
					active = $scope.slidesToShow.length - 1;
					$scope.slides[active].active = true;
					onChangeActive();
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
				if (newValue) {
					//if(!$scope.slides) { return; }
					$scope.slides[active].active = true;
					$scope.selected = $scope.slides[active];

					slider = $('#' + $scope.title.replace(/ /g, '') + 'Slider');
					cover = $('.ProductionItem');

					var div = $('#' + $scope.title.replace(/ /g, '')) /*.attr('href')*/ ;
					if ($(div).position()) {
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

			$scope.$watch('slidesToShow', function(newValue) {
				if(newValue) {
					console.log('newValue', newValue);
					$scope.slides = newValue.concat(newValue.map(function(item) {
						item.uniqueId = newValue.indexOf(item);
						return item;
					})).map(function(item) {
						if(item.uniqueId === undefined) {
							item.uniqueId = newValue.indexOf(item) + newValue.length;
						}
						return item;
					});
				}
			});
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
				slidesToShow: '=slides',
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