(function(module) {

	module.controller('RateAlertController', ['$scope', '$modalInstance', 'items', function($scope, $modalInstance, items) {
		var model = this;

		init();

		function init() {

			$scope.ok = function() {
				$modalInstance.close($scope.selected.item);
			};

			$scope.cancel = function() {
				$modalInstance.dismiss('cancel');
			};

			$scope.rate = 2;
			$scope.max = 5;
			$scope.isReadonly = false;

			$scope.hoveringOver = function(value) {
				$scope.overStar = value;
				$scope.percent = 100 * (value / $scope.max);
			};
		}
	}]);

}(angular.module("caracolplaylgtvapp.rateAlert", [
	'ui.router'
])));