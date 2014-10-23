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