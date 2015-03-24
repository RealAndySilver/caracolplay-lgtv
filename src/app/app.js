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

	app.value('MyListItems', {
		list: [],
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

	app.directive('ngEnter', ['$timeout', function ($timeout) {
		return function (scope, element, attrs) {
			element.bind("keydown keypress", function (event) {
				if(event.which === 13) {
					scope.$apply(function (){
						scope.$eval(attrs.ngEnter);
					});
					var e = document.createEvent("MouseEvents");
					e.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
					var worked = element[0].dispatchEvent(e);

					event.preventDefault();
				}
			});
		};
	}]);

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
	//'ngAnimate',
	'caracolplaylgtvapp.home',
	'caracolplaylgtvapp.about',
	'templates-app',
	'templates-common',
	'ui.router.state',
	'ui.router',
	'ui.select',
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
	'caracolplaylgtvapp.videoModule',
  'caracolplaylgtvapp.start',
  'caracolplaylgtvapp.termsView',
])));