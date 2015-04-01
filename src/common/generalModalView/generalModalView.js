(function(module) {

	module.config(function($stateProvider) {
		$stateProvider.state('generalModalView', {
			url: '/generalmodalview',
			views: {
				"main": {
					controller: 'GeneralModalViewController as model',
					templateUrl: 'generalModalView/generalModalView.tpl.html'
				}
			},
			data: {
				pageTitle: 'GeneralModalView'
			}
		});
	});

	module.controller('GeneralModalViewController', [function() {
		var model = this;

		init();

		function init() {

		}
	}]);

}(angular.module("caracolplaylgtvapp.generalModalView", [
	'ui.router'
])));