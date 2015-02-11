(function(module) {

	module.config(['$stateProvider', function($stateProvider) {
		$stateProvider.state('rate', {
			url: '/rate/:productId/:rate',
			views: {
				'main': {
					controller: 'RateAlertDialogController',
					template: ''
				}
			},
			data: {
				pageTitle: 'Rate'
			}
		});
	}]);

	module.controller('RateAlertDialogController', ['$scope', '$modal', '$stateParams', function($scope, $modal, $stateParams) {
		var productId = $stateParams.productId;
		var defaultRate = $stateParams.rate;

		var modalInstance = $modal.open({
			templateUrl: 'rateAlert/rateAlert.tpl.html',
			controller: 'RateAlertController',
			size: 'lg',
			resolve: {
				productId: function() {
					return productId;
				},
				defaultRate: function() {
					return defaultRate;
				},
			}
		});

		$scope.$on('$stateChangeStart', function(event, newUrl, oldUrl) {
      console.log('Remove modal popup if necessary!');
      // if modal instance difined, dismiss window
      if (modalInstance) {
        modalInstance.dismiss('cancel');
      }
    });
	}]);

	module.controller('RateAlertController', ['$scope', '$modalInstance', 'ProductService', 'productId', 'defaultRate', 'hotkeys', function($scope, $modalInstance, ProductService, productId, defaultRate, hotkeys) {
		var model = this;

		init();
		keyboardInit();

		model.state = 0;

		model.buttons = {
			'ok': false,
			'false': false,
		};

		function keyboardInit() {
			hotkeys.add({
				combo: 'left',
				callback: function(event) {
					switch(model.state) {
						case 0:
							if(--$scope.rate < 0) {
								$scope.rate = 0;
							}
							console.log($scope.rate);
							break;
						case 1:
							model.buttons['cancel'] = false;
							model.buttons['ok'] = true;
							break;
					}
				}
			});

			hotkeys.add({
				combo: 'right',
				callback: function(event) {
					switch(model.state) {
						case 0:
							if(++$scope.rate > 5) {
								$scope.rate = 5;
							}
							console.log($scope.rate);
							break;
						case 1:
							model.buttons['cancel'] = true;
							model.buttons['ok'] = false;
							break;
					}
				}
			});

			hotkeys.add({
				combo: 'enter',
				callback: function(event) {
					event.preventDefault();
					switch(model.state) {
						case 0:
							$scope.ok();
							break;
						case 1:
							if(model.buttons['cancel']) {
								$scope.cancel();
							} else if(model.buttons['ok']) {
								$scope.ok();
							}
							break;
					}
				}
			});

			hotkeys.add({
				combo: 'up',
				callback: function(event) {
					event.preventDefault();
					model.state = 0;
					model.buttons['ok'] = false;
					model.buttons['cancel'] = false;
				}
			});

			hotkeys.add({
				combo: 'down',
				callback: function(event) {
					event.preventDefault();
					model.state = 1;
					model.buttons['ok'] = true;
				}
			});
		}

		function init() {

			$scope.isFocused = function(button) {
				return model.buttons[button];
			};

			$scope.ok = function() {
				var updatePromise = ProductService.updateUserFeedbackForProduct(productId, $scope.rate);

				updatePromise.then(function(response) {
					console.log(response);

					window.history.back();					
				});

				
				//$modalInstance.dismiss('cancel');
			};

			$scope.cancel = function() {
				window.history.back();
				//$modalInstance.dismiss('cancel');
			};

			$scope.rate = defaultRate ? defaultRate / 100.0 * 5.0 : 5;
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