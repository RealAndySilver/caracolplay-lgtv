(function(app) {


	app.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
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
	app.value('UserInfo', {
		name: '',
		lastname: '',
		alias: '',
		mail: '',
		password: '',
		session: '',
		uid: '',
		isSubscription: false,
		timeEnds: '',
	});

	app.constant('DevInfo', {
		isInDev: true,
	});

	app.filter('nospace', function() {
		return function(value) {
			return (!value) ? '' : value.replace(/ /g, '');
		};
	});

	app.directive('focusMe', function($timeout) {
		return {
			scope: {
				trigger: '@focusMe'
			},
			link: function(scope, element) {
				scope.$watch('trigger', function(value) {
					if (value === "true") {
						$timeout(function() {
							element[0].focus();
						});
					}
				});
			}
		};
	});

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
	'caracolplaylgtvapp.searchView',
	'caracolplaylgtvapp.purchaseView',
	'caracolplaylgtvapp.alertDialogView',
	'caracolplaylgtvapp.videoController',
	'caracolplaylgtvapp.rateAlert',
])));