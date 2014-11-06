(function(app) {
	var PurchaseViewController = function($scope, $modal) {
		var init = function() {
		};

		init();

		$scope.options = [
			{ 'title': 'User Login', 'image': 'http://a762.phobos.apple.com/us/r30/Purple6/v4/a7/83/db/a783db58-cb4d-601c-2739-66ab0b48b2d8/mzl.gmnvztdf.png', active: true },
			{ 'title': 'Subscribe to CaracolPlay', 'image': 'http://a762.phobos.apple.com/us/r30/Purple6/v4/a7/83/db/a783db58-cb4d-601c-2739-66ab0b48b2d8/mzl.gmnvztdf.png', active: false },
			{ 'title': 'Rent the content', 'image': 'http://a762.phobos.apple.com/us/r30/Purple6/v4/a7/83/db/a783db58-cb4d-601c-2739-66ab0b48b2d8/mzl.gmnvztdf.png', active: false },
			{ 'title': 'Redeem code', 'image': 'http://a762.phobos.apple.com/us/r30/Purple6/v4/a7/83/db/a783db58-cb4d-601c-2739-66ab0b48b2d8/mzl.gmnvztdf.png', active: false }
		];
	};

	app.controller('PurchaseViewController', ['$scope', '$modal', PurchaseViewController]);

}(angular.module("caracolplaylgtvapp.purchaseView", [
	'ui.router'
])));