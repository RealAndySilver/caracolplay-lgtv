(function(app) {
	var PurchaseViewController = function($scope) {
		var init = function() {
		};

		init();
	};

	var PurchaseViewDirective = function() {
		return {
			restrict: 'E',
			controller: 'PurchaseViewController',
			controllerAs: 'purchaseViewCtrl',
			templateUrl: 'purchaseView/purchaseView.tpl.html',
		};
	};

	app.controller('PurchaseViewController', ['$scope', PurchaseViewController]);
	app.directive('purchaseView', PurchaseViewDirective);

}(angular.module("caracolplaylgtvapp.purchaseView", [
	'ui.router'
])));