(function(module) {
	module.config(['$stateProvider', function($stateProvider) {
		$stateProvider.state('progress', {
			url: '/progress',
			views: {
				'main': {
					controller: 'ProgressDialogRouteProviderController',
				}
			},
			data: {
				pageTitle: 'Rate'
			}
		});
	}]);

	var ProgressDialogRouteProviderController = function($scope, ProgressDialogService) {

		init();

		function init() {
			ProgressDialogService.setMessage('');
			ProgressDialogService.start();
		}
	};

	var ProgressDialogController = function($scope, $modalInstance, message) {
		var self = this;

		init();

		function init() {
			$scope.message = message;
		}
	};

	var ProgressDialogService = function($modal) {
		var self = this;
		self.modalInstance = {};
		self.message = 'Cargando...';

		self.setMessage = function(message) {
			self.message = message;
		};

		self.start = function() {
			self.modalInstance = $modal.open({
				controller: 'ProgressDialogController',
				templateUrl: 'progressDialog/progressDialog.tpl.html',
				size: '',
				resolve: {
					message: function() {
						return self.message;
					},
				},
			});
		};

		self.dismiss = function() {
			self.modalInstance.dismiss('cancel');
		};
	};

	module.controller('ProgressDialogRouteProviderController', ['$scope', 'ProgressDialogService', ProgressDialogRouteProviderController]);
	module.service('ProgressDialogService', ['$modal', ProgressDialogService]);
	module.controller('ProgressDialogController', ['$scope', '$modalInstance', 'message', ProgressDialogController]);
}(angular.module("caracolplaylgtvapp.progressDialog", [
	'ui.router'
])));