(function(app) {

    /** se declara y se usa como servicio para utilizarlo en los llamados de varios controladores 
    ** para llamarlo en un servioc se usa "AlertDialogService.show" este llama todo el contenido necesario para que se muestre la alerta 
    **/
    
    /** declaracion del servicio como variable **/
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
            
			$scope.message = alertInfo.message;//mensaje que muestra la alerta 
			$scope.buttonMessage = alertInfo.button; // texto del boton de la alerta  
			$scope.type = alertInfo.type;// tipo de alerta 

            /** validacion si no contiene tipo de alerta **/
			if(!$scope.type) {
				$scope.type = 'warning';//valor por defecto de la alerta en caso de que llegue vacio 
			}

            /** validacion si no contiene textodel boton de la alerta **/
			if(!$scope.buttonMessage) {
				$scope.buttonMessage = 'Aceptar';// valor por defecto del boton en la alerta 
			}

            /** funcion parra cerrar las alertas **/
			$scope.dismiss = function() {
                /**Validacion encargada de leer si se debe debolver a la pagina anterior o solo cerrar la alerta **/
                if(alertInfo.succeso !== undefined){
                    $modalInstance.dismiss('cancel');//cierra la alerta 
                }
                else{
                    $modalInstance.dismiss('cancel');//cierra la alerta
                    $window.history.back();//debuelbe a la pagina anterior 
                }
			};

            /** funcion para cambio de url con la alerta **/
			$scope.$on('$stateChangeStart', function(event, newUrl, oldUrl) {
				if ($modalInstance) {
					$modalInstance.dismiss('cancel');
				}
			});

            /** funcion de enter
            **  encargada de darle funcionamiento al enter en las alertas 
            **/
			$timeout(function() {
				hotkeys.add({
					combo: 'enter',
					callback: function(event) {
						event.preventDefault();
						$modalInstance.dismiss('cancel');//cierra la alerta
					}
				});
			}, 10);
		}
	};

    /** declaracion del servicio **/
	app.service('AlertDialogService', ['$modal', AlertDialogService]);
    
    /** declaracion del controlador **/
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