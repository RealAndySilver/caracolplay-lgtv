(function(app) {

	app.config(['$stateProvider', function($stateProvider) {
		$stateProvider.state('alertDialogView', {
			url: '/alertView/:type/:message/:button',
			views: {
				"main": {
					controller: 'ShowAlertDialogViewController',
					template: ''
				}
			},
			data: {
				pageTitle: 'AlertDialogView'
			}
		});
	}]);

	var ShowAlertDialogViewController = function($scope, $modal) {
		init();

		function init() {
			var modalInstance = $modal.open({
				controller: 'AlertDialogViewController',
				templateUrl: 'alertDialogView/alertDialogView.tpl.html',
				size: '',
				resolve: {
					alertInfo: function($stateParams) {
						return {
							'type': $stateParams.type,
							'message': $stateParams.message,
							'button': $stateParams.button,
						};
					},
				},
			});

			$scope.$on('$stateChangeStart', function(event, newUrl, oldUrl) {
				// if modal instance difined, dismiss window
				if (modalInstance) {
					modalInstance.dismiss('cancel');
				}
			});
		}
	};

	var AlertDialogViewController = function($scope, $modalInstance, alertInfo, hotkeys) {
		init();

		function init() {
			$scope.message = alertInfo.message;
			$scope.buttonMessage = alertInfo.button;
			$scope.type = alertInfo.type;

			if(!$scope.type) {
				$scope.type = 'warning';
			}

			if(!$scope.buttonMessage) {
				$scope.buttonMessage = 'Aceptar';
			}

			hotkeys.add({
				combo: 'enter',
				callback: function(event) {
					event.preventDefault();

					window.history.back();
				},
			});
		}
	};

	app.controller('ShowAlertDialogViewController', ['$scope', '$modal', ShowAlertDialogViewController]);
	app.controller('AlertDialogViewController', ['$scope', '$modalInstance', 'alertInfo', 'hotkeys', AlertDialogViewController]);

}(angular.module("caracolplaylgtvapp.alertDialogView", [
	'ui.router'
])));