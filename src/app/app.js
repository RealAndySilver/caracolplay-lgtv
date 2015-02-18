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

	app.directive('ngEnter', function () {
		return function (scope, element, attrs) {
			element.bind("keydown keypress", function (event) {
				if(event.which === 13) {
					scope.$apply(function (){
						scope.$eval(attrs.ngEnter);
					});
					event.preventDefault();
				}
			});
		};
  });

  app.directive('ngSides', function () {
		return {
			link: function (scope, element, attrs) {
				element.bind("keydown keypress", function (event) {
					if(event.which === 38) {
						scope.$apply(function (){
							scope.$eval(attrs.ngSides, {side: 'up'});
						});
						event.preventDefault();
					} else if(event.which === 39) {
						scope.$apply(function (){
							scope.$eval(attrs.ngSides, {side: 'right'});
						});
						event.preventDefault();
					} else if(event.which === 40) {
						scope.$apply(function (){
							scope.$eval(attrs.ngSides, {side: 'down'});
						});
						event.preventDefault();
					} else if(event.which === 37) {
						scope.$apply(function (){
							scope.$eval(attrs.ngSides, {side: 'left'});
						});
						event.preventDefault();
					}
				});
			},
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
	'caracolplaylgtvapp.progressDialog',
])));