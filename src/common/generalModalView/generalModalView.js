(function(module) {

	module.config(function($stateProvider) {
		$stateProvider.state('generalModalView', {
			url: '/generalmodalview',
			views: {
				"main": {
					controller: 'GeneralModalViewRouteController as self',
				}
			},
			data: {
				pageTitle: 'GeneralModalView'
			}
		});
	});

	var GeneralModalViewService = function($modal) {
		var self = this;
		self.modalInstance = {};

		init();

		self.show = function(image, text, title, positive, negative, onPositive, onNegative) {
			self.modalInstance = $modal.open({
				controller: 'GeneralModalViewController',
				templateUrl: 'generalModalView/generalModalView.tpl.html',
				size: 'lg',
				resolve: {
					modalInfo: function() {
						return {
							'image': image,
							'text': text,
							'title': title,
							'positive': positive,
							'negative': negative,
						};
					}
				}
			});

			self.modalInstance.result.then(function() {
				if(onPositive) {
					onPositive();
				}
			}, function() {
				if(onNegative) {
					onNegative();
				}
			});
		};

		self.dismiss = function() {
			self.dismiss('cancel');
		};

		function init() {

		}
	};

	var GeneralModalViewController = function($scope, $modalInstance, modalInfo) {
		var self = this;

		$scope.title = '';
		$scope.message = '';
		$scope.imageUrl = '';
		$scope.positiveButton = '';
		$scope.negativeButton = '';

		$scope.positive = function() {
			$modalInstance.close('ok');
		};

		$scope.negative = function() {
			$modalInstance.dismiss('cancel');
		};

		init();

		function init() {
			$scope.title = modalInfo.title;
			$scope.message = modalInfo.text;
			$scope.positiveButton = modalInfo.positive;
			$scope.negativeButton = modalInfo.negative;

			switch(modalInfo.image) {
				case 'alert':
					$scope.imageUrl = './assets/img/alert.png';
					break;
				case 'warning':
					$scope.imageUrl = './assets/img/interrogative.png';
					break;
				case 'redeem':
					$scope.imageUrl = './assets/img/redeem-logo.png';
					break;
				case 'rent':
					$scope.imageUrl = './assets/img/rent-logo.png';
					break;
				case 'subscribe':
					$scope.imageUrl = './assets/img/subscribe-logo.png';
					break;
				default:
					$scope.imageUrl = modalInfo.image;
					break;
			}
		}
	};

	var GeneralModalViewRouteController = function(GeneralModalViewService) {
		var self = this;

		init();

		function init() {
			GeneralModalViewService.show('redeem', 'text', 'title', 'positive', 'negative', function() {
				console.log('ok');
			},
			function() {
				console.log('cancel');
			});
		}
	};

	module.service('GeneralModalViewService', ['$modal', GeneralModalViewService]);
	module.controller('GeneralModalViewController', ['$scope', '$modalInstance', 'modalInfo', GeneralModalViewController]);
	module.controller('GeneralModalViewRouteController', ['GeneralModalViewService', GeneralModalViewRouteController]);

}(angular.module("caracolplaylgtvapp.generalModalView", [
	'ui.router'
])));