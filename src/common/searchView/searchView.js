(function(app) {
	var SearchViewController = function($scope, ProductService, hotkeys) {
		var self = this;

		var init = function() {
			$scope.getTitle = function() {
				return $scope.keyword + ' - ' + self.results.length + ' results found';
			};

			self.results = [];
			self.resultButtons = [];

			self.isItemSelected = false;
			self.itemSelected = 0;

			$scope.isShowingPreview = true;

			var slider = {};

			var configHotkeys = function() {
				hotkeys.add({
					combo: 'up',
					callback: function(event) {
						if (self.itemSelected - 1 >= 0) {
							self.resultButtons[self.itemSelected--].active = false;
							self.resultButtons[self.itemSelected].active = true;

							$scope.selected = self.results[self.itemSelected];
						}

						var div = $('#buttonchapters' + self.itemSelected);

						slider = $('.search-results');
						slider.stop().animate({
							scrollTop: (div.height() + 14) * self.itemSelected,
						});

						event.preventDefault();
					}
				});

				hotkeys.add({
					combo: 'enter',
					callback: function(event) {
						//$scope.selected = self.results[self.itemSelected];

						console.log($scope.selected);
						var productPremise = ProductService.getProductWithID($scope.selected.id, '');

						productPremise.then(function(res) {
							//console.log(res.data);

							$scope.selected = res.data.products['0'][0];
						});
						$scope.configKeyboard.restart = function() {
							configHotkeys();
						};
						$scope.preview({
							value: true
						});

						$scope.isShowingPreview = false;
					}
				});

				hotkeys.add({
					combo: 'esc',
					callback: function(event) {
						if($scope.isShowingPreview) {
							$scope.visible({
								value: false
							});
						} else {
							$scope.isShowingPreview = true;

							$scope.preview({
								value: false
							});
						}
					}
				});

				hotkeys.add({
					combo: 'down',
					callback: function(event) {
						if (self.itemSelected + 1 < self.resultButtons.length) {
							self.resultButtons[self.itemSelected++].active = false;
							self.resultButtons[self.itemSelected].active = true;

							$scope.selected = self.results[self.itemSelected];

							var div = $('#buttonchapters' + self.itemSelected);

							slider = $('.search-results');
							slider.stop().animate({
								scrollTop: (div.height() + 14) * self.itemSelected,
							});
						}

						event.preventDefault();
					}
				});
			};

			configHotkeys();

			$scope.$watch('keyword', function(newValue, oldValue) {
				if (newValue === undefined || newValue === '') {
					return;
				}
				var searchPremise = ProductService.getListFromSearchWithKey(newValue);

				configHotkeys();

				searchPremise.then(function(res) {
					self.results = res.data.products;

					console.log(self.results);

					self.resultButtons = [];

					for (var i in self.results) {
						var label = self.results[i].name;
						self.resultButtons.push({
							label: label,
							active: false,
						});
					}

					if (self.results.length !== 0) {
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
				visible: '&onShow',
				keyword: '@',
				preview: '&',
				selected: '=itemSelected',
				configKeyboard: '=restartKeyboard'
			}
		};
	};

	app.controller('SearchViewController', ['$scope', 'ProductService', 'hotkeys', SearchViewController]);
	app.directive('searchView', SearchViewDirective);

}(angular.module("caracolplaylgtvapp.searchView", [
	'ui.router'
])));