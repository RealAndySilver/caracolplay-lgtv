(function(app) {

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
							'button': button
						};
					}
				}
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

	var AlertDialogViewController = function($scope, $modalInstance, alertInfo, hotkeys, $timeout, $location) {
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
                $location.path("/preview/dashboard");
			};

			$scope.$on('$stateChangeStart', function(event, newUrl, oldUrl) {
				// if modal instance difined, dismiss window
				if ($modalInstance) {
					$modalInstance.dismiss('cancel');
				}
			});

			$timeout(function() {
				hotkeys.add({
					combo: 'enter',
					callback: function(event) {
						event.preventDefault();

						$modalInstance.dismiss('cancel');
					}
				});
			}, 10);
		}
	};

	app.service('AlertDialogService', ['$modal', AlertDialogService]);
	app.controller('AlertDialogViewController', ['$scope', '$modalInstance', 'alertInfo', 'hotkeys', '$timeout','$location', AlertDialogViewController]);

}(angular.module("caracolplaylgtvapp.alertDialogView", [
	'ui.router'
])));