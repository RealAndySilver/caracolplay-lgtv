(function(app) {
	var SearchViewController = function($scope, ProductService, hotkeys, PreviewDataService, $state, $stateParams, ProgressDialogService, $window, DevInfo) {

		var init = function() {

			$scope.home = function() {
				$state.go('dashboard');
			};

			$scope.getTitle = function() {
				if ($scope.keyword) {
					return $scope.keyword + ' - ' + $scope.results.length + ' resultados encontrados';
				}
				return '';
			};

			$scope.keyword = $stateParams.keyword;
			$scope.from = $stateParams.from;

			$scope.results = [];
			$scope.resultButtons = [];

			$scope.isItemSelected = false;
			$scope.itemSelected = 0;

			$scope.isShowingPreview = true;

			var slider = {};
			var canceller = {};
			$scope.$watch('keyword', function(newValue) {
				ProductService.cancel();

				if(newValue === '') {
					$scope.results = [];
					$scope.resultButtons = [];
					return;
				}
				
				var searchPremise = ProductService.getListFromSearchWithKey($scope.keyword);

				configHotkeys();

				searchPremise.then(function(res) {
					$scope.results = res.data.products.map(function(item) {
						item.rate = item.rate * 5 / 100;
						return item;
					});

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

			$scope.onEnterItem = function(position) {
				$scope.resultButtons[$scope.itemSelected].active = false;
				$scope.resultButtons[position].active = true;

				var productPremise = ProductService.getProductWithID($scope.results[position].id, '');

				productPremise.then(function(res) {
					PreviewDataService.setItemSelected(res.data.products['0'][0]);
					$state.go('preview', {
						from: 'search'
					});
				});
			};

			var configHotkeys = function() {
				var redButtonCallback = function() {
					$state.go('dashboard');
				};

				hotkeys.add({
					combo: 'red',
					callback: redButtonCallback,
				});

				if (DevInfo.isInDev) {
					hotkeys.add({
						combo: 'r',
						callback: redButtonCallback,
					});
				}

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
					if (event.keyIdentifier === 'Enter') {
						if($scope.keyword === '') {
							$window.history.back();
							return;
						}

						event.target.blur();
						configHotkeys();
					}
				};

				hotkeys.add({
					combo: 'enter',
					callback: function(event) {
						$scope.onEnterItem($scope.itemSelected);
					}
				});

				hotkeys.add({
					combo: 'esc',
					callback: function(event) {
						if ($scope.isShowingPreview) {
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
			url: '/search/:keyword?',
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

	app.controller('SearchViewController', [
		'$scope',
		'ProductService',
		'hotkeys',
		'PreviewDataService',
		'$state',
		'$stateParams',
		'ProgressDialogService',
		'$window',
		'DevInfo',
		SearchViewController
	]);
	app.directive('searchView', SearchViewDirective);

}(angular.module("caracolplaylgtvapp.searchView", [
	'ui.router'
])));