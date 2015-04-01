(function(app) {
	/*
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
	*/

	var AlertDialogService = function($modal) {
		var self = this;
		self.modalInstance = {};

		self.show = function(type, message, button, onDismiss) {
			self.modalInstance = $modal.open({
				controller: 'AlertDialogViewController',
				templateUrl: 'alertDialogView/alertDialogView.tpl.html',
				size: '',
				resolve: {
					alertInfo: function() {
						return {
							'type': type,
							'message': message,
							'button': button,
						};
					},
				},
			});
			
			self.modalInstance.result.then(function() {
				if(onDismiss) {
					onDismiss();
				}
			}, function() {
				if(onDismiss) {
					onDismiss();
				}
			});
		};

		self.dismiss = function() {
			self.dismiss('cancel');
		};
	};

	var AlertDialogViewController = function($scope, $modalInstance, alertInfo, hotkeys, $timeout) {
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

			$scope.dismiss = function() {
				$modalInstance.dismiss('cancel');
			};

			$timeout(function() {
				hotkeys.add({
					combo: 'enter',
					callback: function(event) {
						event.preventDefault();

						$modalInstance.dismiss('cancel');
					},
				});
			}, 10);
		}
	};

	app.service('AlertDialogService', ['$modal', AlertDialogService]);
	app.controller('AlertDialogViewController', ['$scope', '$modalInstance', 'alertInfo', 'hotkeys', '$timeout', AlertDialogViewController]);

}(angular.module("caracolplaylgtvapp.alertDialogView", [
	'ui.router'
])));