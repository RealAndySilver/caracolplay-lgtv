(function(app) {
	var PreviewButtonController = function($scope) {
		var self = this;

		self.element = {};

		$scope.setElement = function(element) {
			self.element = element;
			if($scope.active) {
				self.element.addClass('button-active');
				self.element.removeClass('button-deactive');
			} else {
				self.element.addClass('button-deactive');
				self.element.removeClass('button-active');
			}
		};
		
		var activeWatcherFunction = function(newValue, oldValue) {
			if(newValue) {
				var div = '#button' + $scope.id + 0;

				$('.chapters-season').stop().animate({
					scrollTop: ($(div).height() + 14) * $scope.index
				});
				self.element.addClass('button-active');
				self.element.removeClass('button-deactive');
			} else {
				self.element.addClass('button-deactive');
				self.element.removeClass('button-active');
			}
		};

		var init = function() {
			$scope.$watch('active', activeWatcherFunction);
		};

		init();
	};

	var PreviewButtonDirective = function() {
		return {
			restrict: 'E',
			templateUrl: 'previewButton/previewButton.tpl.html',
			controller: 'PreviewButtonController',
			controllerAs: 'previewButtonCtrl',
			scope: {
				active: '=isActive',
				text: '@label',
				index: '=position',
				id: '@',
			},
			link: function(scope, element, attrs) {
				scope.setElement(element.find('div'));
			},
		};
	};

	app.controller('PreviewButtonController', ['$scope', PreviewButtonController]);
	app.directive('previewButton', PreviewButtonDirective);

}(angular.module("caracolplaylgtvapp.previewButton", [
	'ui.router'
])));