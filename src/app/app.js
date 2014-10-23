(function(app) {

	app.config(function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/dashboard');
	});

	var init = function() {

	};

	app.run(init);

	var AppController = function($scope) {
		var self = this;

		var init = function() {

		};

		init();
	};

	app.controller('AppController', ['$scope', AppController]);

}(angular.module("caracolplaylgtvapp", [
	'caracolplaylgtvapp.home',
	'caracolplaylgtvapp.about',
	'templates-app',
	'templates-common',
	'ui.router.state',
	'ui.router',
	'ui.bootstrap',
	'caracolplaylgtvapp.dashboard',
	'caracolplaylgtvapp.ServerCommunicator',
	'caracolplaylgtvapp.ProductsContainer',
	'cfp.hotkeys',
	'caracolplaylgtvapp.carouselContainer',
	'caracolplaylgtvapp.previewView',
	'caracolplaylgtvapp.previewButton',
	'caracolplaylgtvapp.previewList',
    'caracolplaylgtvapp.seriesProduct',
])));
