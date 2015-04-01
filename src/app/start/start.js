(function(module) {
	module.config(function($stateProvider) {
		$stateProvider.state('start', {
			url: '/dashboard',
			views: {
				"main": {
					controller: 'StartController as model',
					templateUrl: 'start/start.tpl.html'
				}
			},
			data: {
				pageTitle: 'Start'
			}
		});
	});

	module.controller('StartController', ['$timeout', '$state', function($timeout, $state) {
		var model = this;

		init();

		function init() {
			$timeout(function() {
				$state.go('dashboard');
			}, 1000 * 10);
		}
	}]);

}(angular.module("caracolplaylgtvapp.start", [
	'ui.router'
])));