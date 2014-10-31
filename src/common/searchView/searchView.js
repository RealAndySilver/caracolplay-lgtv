(function(app) {
	var SearchViewController = function($scope, ProductService) {
		var self = this;

		$scope.getTitle = function() {
			return $scope.keyword + ' - 0 results found';
		};

		self.results = [];
		self.resultButtons = [];

		var init = function() {
			$scope.$watch('keyword', function(newValue, oldValue) {
				var searchPremise = ProductService.getListFromSearchWithKey(newValue);

				searchPremise.then(function(res) {
					self.results = res.data.products;

					self.resultButtons = [];

					for(var i in self.results) {
						var label = self.results[i].name;
						self.resultButtons.push({
							label: label,
							active: false,
						});
					}
					
				});
			});
		};

		init();
	};

	var SearchViewDirective = function() {
		return {
			restrict: 'E',
			controller: 'SearchViewController',
			controllerAs: 'searchViewCtrl',
			templateUrl: 'searchView/searchView.tpl.html',
			scope: {
				keyword: '@',
			}
		};
	};

	app.controller('SearchViewController', ['$scope', 'ProductService', SearchViewController]);
	app.directive('searchView', SearchViewDirective);

}(angular.module("caracolplaylgtvapp.searchView", [
	'ui.router'
])));