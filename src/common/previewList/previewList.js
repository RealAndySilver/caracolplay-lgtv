(function(app) {
	var PreviewListController = function($scope) {

		var init = function() {};

		init();
	};

	var PreviewListDirective = function() {
		return {
			restrict: 'E',
			templateUrl: 'previewList/previewList.tpl.html',
			controller: 'PreviewListController',
			controllerAs: 'previewListCtrl',
			scope: {
				buttons: '=list',
				id: '@',
				click: '&onClick'
			}
		};
	};

	app.controller('PreviewListController', ['$scope', PreviewListController]);
	app.directive('previewList', PreviewListDirective);

}(angular.module("caracolplaylgtvapp.previewList", [
	'ui.router'
])));