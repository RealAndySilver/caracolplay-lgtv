(function(module) {
	module.config(function($stateProvider) {
		$stateProvider.state('videoModule', {
			url: '/videomodule/:chapterId/:productionId',
			views: {
				"main": {
					controller: 'VideoModuleController as model',
					templateUrl: 'videoModule/videoModule.tpl.html'
				}
			},
			resolve: {
				itemSelected: ['$stateParams', 'ProductService','UserInfo', function($stateParams, ProductService,UserInfo) {
                    var uid = 0;
                    if(UserInfo.uid !== undefined && UserInfo.uid !== ''){
                        uid = UserInfo.uid;
                    }
					var promiseProduct = ProductService.getProductWithID($stateParams.productionId,uid);

					return promiseProduct.then(function(response) {
						console.log(response);
						if (response.data.length !== 0) {
							response.data.products['0'][0].productId = $stateParams.productId;
							return response.data.products['0'][0];
						}
						return [];
					});
				}]
			},
			data: {
				pageTitle: 'VideoModule'
			}
		});
	});

	function VideoModuleController($scope, $timeout, ProductService, UserInfo, itemSelected, hotkeys, $state, AlertDialogService, DevInfo) {
		var model = this;
		$scope.selected = itemSelected;
		$scope.productId = itemSelected.id;
		$scope.itemSelected = {};

		init();
		keyboardInit();

		$scope.isRecomendents = false;
		$scope.optionSelected = 0;
		$scope.recomendentsSelected = 0;

		$scope.keyboardInit = keyboardInit;

		function keyboardInit() {
			var redButtonCallback = function() {
				$state.reload();
			};

			hotkeys.add({
				combo: 'red',
				callback: redButtonCallback
			});

			if (DevInfo.isInDev) {
				hotkeys.add({
					combo: 'r',
					callback: redButtonCallback
				});
			}

			hotkeys.add({
				combo: 'up',
				callback: function(event) {
					event.preventDefault();

					if ($scope.isRecomendents) {
						$scope.isRecomendents = false;
					} else {
						if ($scope.optionSelected - 1 > -1) {
							$scope.options[$scope.optionSelected--].active = false;
							$scope.options[$scope.optionSelected].active = true;
						}
					}
				}
			});

			hotkeys.add({
				combo: 'down',
				callback: function(event) {
					event.preventDefault();

					if ($scope.optionSelected + 1 < 4) {
						$scope.options[$scope.optionSelected++].active = false;
						$scope.options[$scope.optionSelected].active = true;
					} else {
						$scope.options[$scope.optionSelected].active = false;
						$scope.isRecomendents = true;
					}
				},
			});

			hotkeys.add({
				combo: 'enter',
				callback: function(event) {
					switch ($scope.options[$scope.optionSelected].label) {
						case 'Calificar':
							$state.go('rate', {
								'productId': $scope.selected.id,
								'rate': $scope.selected.rate,
								'type': $scope.selected.type
							});
							break;
						case 'Ver Tráiler':
							$state.go('videoModule', {
								productId: $scope.id
							});
							break;
						case 'Añadir a mi lista':
							AlertDialogService.show(
								'warning',
								'Add to list',
								'Aceptar',
								keyboardInit
							);
							break;
						case 'Volver al catálogo':
							$state.go('dashboard');
							break;
					}
				}
			});

			hotkeys.add({
				combo: 'right',
				callback: function() {

				}
			});

			hotkeys.add({
				combo: 'left',
				callback: function() {

				}
			});
		}

		$scope.$watch('isRecomendents', function(newValue) {
			if (newValue) {
				$scope.options[0].active = false;
				$scope.recomendents[0].active = true;
			} else {
				$scope.options[$scope.optionSelected].active = true;
				if ($scope.recomendents) {
					$scope.recomendents[0].active = false;
				}
				keyboardInit();
			}
		});

		function init() {
			$scope.isFinishingVideo = false;

			$scope.options = [{
				label: 'Calificar',
				active: true
			}, {
				label: 'Ver Tráiler',
				active: false
			}, {
				label: 'Añadir a mi lista',
				active: false
			}, {
				label: 'Volver al catálogo',
				active: false
			}, ];

			$timeout(function() {
				$scope.isFinishingVideo = true;
			}, 3000);

			var promise = ProductService.getRecommendationsWithProductID($scope.productId);
			promise.then(function(response) {
				$scope.recomendents = response.data.recommended_products.map(function(data) {
					return data.product;
				});
			});

			$scope.$watch('isFinishingVideo', function(newValue) {
				if (newValue) {
					$scope.videoCss = 'video-container-ended';
				} else {
					$scope.videoCss = 'video-container';
				}
			});
		}
	}

	module.controller('VideoModuleController', [
		'$scope',
		'$timeout',
		'ProductService',
		'UserInfo',
		'itemSelected',
		'hotkeys',
		'$state',
		'AlertDialogService',
		'DevInfo',
		VideoModuleController
	]);

}(angular.module("caracolplaylgtvapp.videoModule", [
	'ui.router'
])));