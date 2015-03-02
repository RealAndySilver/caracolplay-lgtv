(function(app) {
	var PreviewViewDirective = function() {
		return {
			restrict: 'E',
			templateUrl: 'previewView/previewView.tpl.html',
			controller: 'PreviewViewController',
			controllerAs: 'previewViewCtrl',
			scope: {
				show: '=onShow',
				selected: '=selectedItem',
			}
		};
	};

	var PreviewDataService = function() {
		var self = this;

		self.selected = {};

		self.setItemSelected = function(selected) {
			self.selected = selected;
		};

		self.getItemSelected = function(selected) {
			return self.selected;
		};
	};

	app.service('PreviewDataService', [PreviewDataService]);

	app.config(['$stateProvider', function($stateProvider) {
		$stateProvider.state('preview', {
			url: '/preview/:from',
			views: {
				'main': {
					controller: 'PreviewViewController',
					templateUrl: 'previewView/previewView.tpl.html'
				}
			},
			data: {
				pageTitle: 'Preview'
			},
			resolve: {
				itemSelected: function(PreviewDataService) {
					return PreviewDataService.getItemSelected();
				}
			}
		});
	}]);

	var PreviewViewController = function($scope, $modal, itemSelected, $stateParams, hotkeys, DevInfo, $state) {
		var self = this;
		
		$scope.from = $stateParams.from;
		$scope.selected = itemSelected;

		var init = function() {
			$scope.items = ['item1', 'item2', 'item3'];

			var yellowButtonCallback = function(event) {
				if($scope.from === 'search') {
					window.history.back();
				} else {
					$state.go('search');
				}
			};

			hotkeys.add({
				combo: 'yellow',
				callback: yellowButtonCallback
			});

			if (DevInfo.isInDev) {
				hotkeys.add({
					combo: 'y',
					callback: yellowButtonCallback
				});
			}

			$scope.onRate = function() {
				var modalInstance = $modal.open({
					templateUrl: 'rateAlert/rateAlert.tpl.html',
					controller: 'RateAlertController',
					size: 'sm',
					resolve: {
						items: function() {
							return $scope.items;
						}
					}
				});

				modalInstance.result.then(function(selectedItem) {
					$scope.selected = selectedItem;
				}, function() {
					$log.info('Modal dismissed at: ' + new Date());
				});
			};

			$scope.moviesOptions = [{
				label: 'Reproducir',
				active: true
			}, {
				label: 'Calificar',
				active: false
			}, {
				label: 'Trailer',
				active: false
			}, {
				label: 'Añadir a mi lista',
				active: false
			}, ];

			$scope.telenovelasOptions = [{
				label: 'Capitulos',
				active: true
			}, {
				label: 'Calificar',
				active: false
			}, {
				label: 'Trailer',
				active: false
			}, {
				label: 'Añadir a mi lista',
				active: false
			}, ];

			$scope.seriesOptions = [{
				label: 'Capitulos',
				active: true
			}, {
				label: 'Calificar',
				active: false
			}, {
				label: 'Trailer',
				active: false
			}, {
				label: 'Añadir a mi lista',
				active: false
			}, ];

			$scope.newsOptions = [{
				label: 'Ultimas Noticias',
				active: true
			}, {
				label: 'Trailer',
				active: false
			}, {
				label: 'Añadir a mi lista',
				active: false
			}, ];

			$scope.getSelected = function(type) {
				if ($scope.selected.type === type) {
					return $scope.selected;
				}
				return null;
			};

			$scope.isMovie = function() {
				return $scope.selected.type === 'Películas';
			};

			$scope.isNews = function() {
				return $scope.selected.type === 'Noticias';
			};

			$scope.isSeries = function() {
				return $scope.selected.type === 'Series';
			};

			$scope.isTelenovelas = function() {
				return $scope.selected.type === 'Telenovelas';
			};

			$scope.$watch('selected', function(newValue, oldValue) {
				if (newValue.description) {
					$scope.selected.feature_text = newValue.description;
				}

			});
		};

		init();
	};

	app.controller('PreviewViewController', ['$scope', '$modal', 'itemSelected', '$stateParams', 'hotkeys', 'DevInfo', '$state', PreviewViewController]);
	app.directive('previewView', PreviewViewDirective);

}(angular.module("caracolplaylgtvapp.previewView", [
	'ui.router'
])));