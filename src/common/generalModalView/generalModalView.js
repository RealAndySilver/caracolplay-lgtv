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

		self.show = function(image, text, onDismiss) {
			self.modalInstance = $modal.open({
				controller: 'GeneralModalViewController',
				templateUrl: 'generalModalView/generalModalView.tpl.html',
				size: 'lg',
				resolve: {
					modalInfo: function() {
						return {
							'image': image,
							'text': text,
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

		function init() {

		}
	};

	var GeneralModalViewController = function() {
		var self = this;

		init();

		function init() {

		}
	};

	var GeneralModalViewRouteController = function(GeneralModalViewService) {
		var self = this;

		init();

		function init() {
			GeneralModalViewService.show('title', 'text');
		}
	};

	module.service('GeneralModalViewService', ['$modal', GeneralModalViewService]);
	module.controller('GeneralModalViewController', [GeneralModalViewController]);
	module.controller('GeneralModalViewRouteController', ['GeneralModalViewService', GeneralModalViewRouteController]);

}(angular.module("caracolplaylgtvapp.generalModalView", [
	'ui.router'
])));