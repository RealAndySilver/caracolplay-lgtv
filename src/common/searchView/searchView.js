(function(app) {
	var SearchViewController = function($scope, ProductService, hotkeys) {
		var self = this;

		$scope.getTitle = function() {
			return $scope.keyword + ' - ' + self.results.length + ' results found';
		};

		self.results = [];
		self.resultButtons = [];

		self.isItemSelected = false;
		self.itemSelected = 0;

		var init = function() {
			hotkeys.add({
				combo: 'up',
				callback: function(event) {
					if(self.itemSelected - 1 >= 0) {
						self.resultButtons[self.itemSelected--].active = false;
						self.resultButtons[self.itemSelected].active = true;

						$scope.selected = self.results[self.itemSelected];
					}
					
					event.preventDefault();
				}
			});

			hotkeys.add({
				combo: 'down',
				callback: function(event) {
					if(self.itemSelected + 1 < self.resultButtons.length) {
						self.resultButtons[self.itemSelected++].active = false;
						self.resultButtons[self.itemSelected].active = true;

						$scope.selected = self.results[self.itemSelected];
					}

					event.preventDefault();
				}
			});

			$scope.$watch('keyword', function(newValue, oldValue) {
				var searchPremise = ProductService.getListFromSearchWithKey(newValue);

				searchPremise.then(function(res) {
					self.results = res.data.products;

					console.log(self.results);

					self.resultButtons = [];

					for(var i in self.results) {
						var label = self.results[i].name;
						self.resultButtons.push({
							label: label,
							active: false,
						});
					}

					if(self.results.length !== 0) {
						self.itemSelected = 0;
						self.resultButtons[self.itemSelected].active = true;
						$scope.selected = self.results[0];
						self.isItemSelected = true;
					} else {
						self.isItemSelected = false;
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

	app.controller('SearchViewController', ['$scope', 'ProductService', 'hotkeys', SearchViewController]);
	app.directive('searchView', SearchViewDirective);

}(angular.module("caracolplaylgtvapp.searchView", [
	'ui.router'
])));