(function(module) {
	module.config(function($stateProvider) {
		$stateProvider.state('start', {
			url: '/tutorial',
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
            if(localStorage["tutorial"] == "finished2"){
                $state.go("dashboard");
                return;
            }

			$timeout(function() {
				$state.go('tutorialinit');
			}, 1000 * 2);
		}
	}]);

}(angular.module("caracolplaylgtvapp.start", [
	'ui.router'
])));