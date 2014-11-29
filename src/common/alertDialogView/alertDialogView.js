(function(app) {
	/** Start code for testing **/
	app.config(['$stateProvider', function ($stateProvider) {
		$stateProvider.state('alertDialogView', {
			url: '/alertdialogview',
			views: {
				"main": {
					controller: 'AlertDialogViewController',
					//templateUrl: 'alertDialogView/alertDialogView.tpl.html'
				}
			},
			data:{ pageTitle: 'AlertDialogView' }
		});
	}]);
	/** End code for testing **/

	var AlertDialogViewController = function($scope, $modal) {
		var init = function() {
			var modalInstance = $modal.open({
				templateUrl: 'alertDialogView/alertDialogView.tpl.html',
				size: '',
				resolve: {
					items: function () {
						return $scope.items;
					}
				}
			});
		};

		init();
	};

	app.controller('AlertDialogViewController', ['$scope', '$modal', AlertDialogViewController]);

}(angular.module("caracolplaylgtvapp.alertDialogView", [
	'ui.router'
])));