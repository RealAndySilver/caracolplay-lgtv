(function(app) {

	var CarouselContainerController = function($scope, hotkeys) {

		var self = this;

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
			}
		};

		var init = function() {
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
			}
		};
	};

	app.controller('CarouselContainerController', ['$scope', 'hotkeys', CarouselContainerController]);
	app.directive('carouselContainer', CarouselContainer);

}(angular.module("caracolplaylgtvapp.carouselContainer", [
	'ui.router',
	'cfp.hotkeys'
])));