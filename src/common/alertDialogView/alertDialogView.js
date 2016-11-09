(function(app) {

	var AlertDialogService = function($modal) {
		var self = this;
		self.modalInstance = {};

		self.show = function(type, message, button, onDismiss, succeso) {
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
                            'succeso': succeso
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

	var AlertDialogViewController = function($scope, $modalInstance, alertInfo, hotkeys, $timeout, $window) {
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

            /** funcion parra cerrar las alertas **/
			$scope.dismiss = function() {
                if(alertInfo.succeso !== undefined){
                    $modalInstance.dismiss('cancel');
                }
                else{
                    $modalInstance.dismiss('cancel');
                    $window.history.back();
                }
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
	app.controller('AlertDialogViewController', [
        '$scope', 
        '$modalInstance', 
        'alertInfo', 
        'hotkeys', 
        '$timeout', 
        '$window', 
        AlertDialogViewController
    ]);

}(angular.module("caracolplaylgtvapp.alertDialogView", [
	'ui.router'
])));