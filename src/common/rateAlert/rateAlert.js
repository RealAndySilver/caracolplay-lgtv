(function(module) {

	module.controller('RateAlertController', ['$scope', '$modalInstance', 'items', function($scope, $modalInstance, items) {
		var model = this;

		init();

		function init() {
			$scope.items = items;
			
			$scope.selected = {
				item: $scope.items[0]
			};
			

			$scope.ok = function() {
				$modalInstance.close($scope.selected.item);
			};

			$scope.cancel = function() {
				$modalInstance.dismiss('cancel');
			};
		}
	}]);

}(angular.module("caracolplaylgtvapp.rateAlert", [
	'ui.router'
])));