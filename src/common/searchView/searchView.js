(function(app) {
	var SearchViewController = function($scope, ProductService, hotkeys, PreviewDataService, $state, $stateParams) {

		var init = function() {
			$scope.getTitle = function() {
				return $scope.keyword + ' - ' + $scope.results.length + ' results found';
			};

			$scope.from = $stateParams.from;

			$scope.results = [];
			$scope.resultButtons = [];

			$scope.isItemSelected = false;
			$scope.itemSelected = 0;

			$scope.isShowingPreview = true;

			var slider = {};

			var configHotkeys = function() {
				hotkeys.add({
					combo: 'up',
					callback: function(event) {
						if ($scope.itemSelected - 1 >= 0) {
							$scope.resultButtons[$scope.itemSelected--].active = false;
							$scope.resultButtons[$scope.itemSelected].active = true;

							$scope.selected = $scope.results[$scope.itemSelected];
						}

						var div = $('#buttonchapters' + $scope.itemSelected);

						slider = $('.search-results');
						slider.stop().animate({
							scrollTop: (div.height() + 14) * $scope.itemSelected,
						});

						event.preventDefault();
					}
				});

				$scope.shouldBeFocus = true;

				$scope.keydownCallback = function(event) {
					console.log('event', event.keyIdentifier);

					if(event.keyIdentifier === 'Enter') {
						event.target.blur();

						var searchPremise = ProductService.getListFromSearchWithKey($scope.keyword);

						configHotkeys();

						searchPremise.then(function(res) {
							$scope.results = res.data.products;

							console.log($scope.results);

							$scope.resultButtons = [];

							for (var i in $scope.results) {
								var label = $scope.results[i].name;
								$scope.resultButtons.push({
									label: label,
									active: false,
								});
							}

							if ($scope.results.length !== 0) {
								$scope.itemSelected = 0;
								$scope.resultButtons[$scope.itemSelected].active = true;
								$scope.selected = $scope.results[0];
								$scope.isItemSelected = true;
							} else {
								$scope.isItemSelected = false;
							}
						});
					}
				};

				hotkeys.add({
					combo: 'enter',
					callback: function(event) {
						console.log('enter');
						var productPremise = ProductService.getProductWithID($scope.selected.id, '');

						productPremise.then(function(res) {
							//console.log(res.data);

							PreviewDataService.setItemSelected(res.data.products['0'][0]);
							$state.go('preview', { from: 'search' });
						});
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
						if ($scope.itemSelected + 1 < $scope.resultButtons.length) {
							$scope.resultButtons[$scope.itemSelected++].active = false;
							$scope.resultButtons[$scope.itemSelected].active = true;

							$scope.selected = $scope.results[$scope.itemSelected];

							var div = $('#buttonchapters' + $scope.itemSelected);

							slider = $('.search-results');
							slider.stop().animate({
								scrollTop: (div.height() + 14) * $scope.itemSelected,
							});
						}

						event.preventDefault();
					}
				});
			};

			configHotkeys();

			/*
			$scope.$watch('keyword', function(newValue, oldValue) {
				if (newValue === undefined || newValue === '') {
					return;
				}
				var searchPremise = ProductService.getListFromSearchWithKey(newValue);

				configHotkeys();

				searchPremise.then(function(res) {
					$scope.results = res.data.products;

					console.log($scope.results);

					$scope.resultButtons = [];

					for (var i in $scope.results) {
						var label = $scope.results[i].name;
						$scope.resultButtons.push({
							label: label,
							active: false,
						});
					}

					if ($scope.results.length !== 0) {
						$scope.itemSelected = 0;
						$scope.resultButtons[$scope.itemSelected].active = true;
						$scope.selected = $scope.results[0];
						$scope.isItemSelected = true;
					} else {
						$scope.isItemSelected = false;
					}
				});
			});
			*/
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

	app.config(['$stateProvider', function($stateProvider) {
		$stateProvider.state('search', {
			url: '/search',
			views: {
				'main': {
					controller: 'SearchViewController',
					templateUrl: 'searchView/searchView.tpl.html'
				}
			},
			data: {
				pageTitle: 'Purchase'
			},
		});
	}]);

	app.controller('SearchViewController', ['$scope', 'ProductService', 'hotkeys', 'PreviewDataService', '$state', '$stateParams', SearchViewController]);
	app.directive('searchView', SearchViewDirective);

}(angular.module("caracolplaylgtvapp.searchView", [
	'ui.router'
])));