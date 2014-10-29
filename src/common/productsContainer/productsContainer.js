(function(app) {

	var ProductsContainerController = function($scope, hotkeys, ProductService) {
		var self = this;

		var active = 0;

		var slider = {},
				cover = {};

		var onChangeActive = function() {
			$scope.selected = $scope.slides[active];
			console.log($scope.selected);
			slider.stop().animate({
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

		var enterCallback = function() {
			var productPremise = ProductService.getProductWithID($scope.slides[active].id, '');

			productPremise.then(function(res) {
				console.log(res.data.products['0'][0]);

				$scope.selected = res.data.products['0'][0];
			});
			$scope.preview();
		};

		var watchCallback = function(newValue, oldValue) {
			if(newValue) {
				$scope.slides[active].active = true;
				$scope.selected = $scope.slides[active];

				slider = $('#' + $scope.title + 'Slider');
				cover = $('.cover');

				var div = $('#' + $scope.title).attr('href');
				$('html, body').stop().animate({
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
				hotkeys.add({
					combo: 'enter',
					callback: enterCallback
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
				preview: '&',
				selected: '=itemSelected',
			}
		};
	};

	app.controller('ProductsContainerController', ['$scope', 'hotkeys', 'ProductService', ProductsContainerController]);
	app.directive('productsContainer', ProductsContainer);

}(angular.module("caracolplaylgtvapp.ProductsContainer", [
	'ui.router',
	'cfp.hotkeys'
])));