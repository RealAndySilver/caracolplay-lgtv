(function(app) {

	var ProductsContainerController = function($scope, hotkeys) {
		var self = this;

		var active = 0;

		var slider = {},
				cover = {};

		var onChangeActive = function() {
			console.log('width:' + cover.width());
			slider.animate({
				scrollLeft: active*cover.width()
      }, 500);
		};

		var rightCallback = function() {
			if(active + 1 > $scope.slides.length - 1) { return; }
			$scope.slides[active++].active = false;
			$scope.slides[active].active = true;
			onChangeActive();
		};

		var leftCallback = function() {
			if(active - 1 < 0) { return; }
			$scope.slides[active--].active = false;
			$scope.slides[active].active = true;
			onChangeActive();
		};

		var watchCallback = function(newValue, oldValue) {
			if(newValue) {
				$scope.slides[active].active = true;

				slider = $('#' + $scope.title + 'Slider');
				cover = $('.cover');

				var div = $('#' + $scope.title).attr('href');
				$('html, body').animate({
					scrollTop: $(div).offset().top - 134
				}, 500);

				hotkeys.add({
					combo: 'right',
					callback: rightCallback
				});

				hotkeys.add({
					combo: 'left',
					callback: leftCallback
				});
			} else {
				if($scope.slides[active]) {
					$scope.slides[active].active = false;
				}
			}
		};

		var init = function() {
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
			scope : {
				slides: '=',
				title: '@',
				active: '=',
			}
		};
	};

	app.controller('ProductsContainerController', ['$scope', 'hotkeys', ProductsContainerController]);
	app.directive('productsContainer', ProductsContainer);

}(angular.module("caracolplaylgtvapp.ProductsContainer", [
	'ui.router',
	'cfp.hotkeys'
])));