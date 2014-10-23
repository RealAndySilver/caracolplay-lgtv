(function(app) {
	var PreviewButtonController = function($scope) {
		var self = this;

		self.element = {};

		$scope.setElement = function(element) {
			console.log('element' + self.element);
			self.element = element;
			if(newValue) {
				self.element.addClass('button-active');
				self.element.removeClass('button-deactive');
			} else {
				self.element.addClass('button-deactive');
				self.element.removeClass('button-active');
			}
		};

		var init = function() {
			$scope.$watch('active', function(newValue, oldValue) {
				console.log('active: ' + newValue);
				if(newValue) {
					self.element.addClass('button-active');
					self.element.removeClass('button-deactive');
				} else {
					self.element.addClass('button-deactive');
					self.element.removeClass('button-active');
				}
			});
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