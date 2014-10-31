(function(app) {
	var SearchViewController = function($scope) {
		var init = function() {
		};

		init();
	};

	var SearchViewDirective = function() {
		return {
			restrict: 'E',
			controller: 'SearchViewController',
			controllerAs: 'searchViewCtrl',
			templateUrl: 'seriesView/seriesView.tpl.html',
			scope: {
			},
		}
	}

	app.controller('SearchViewController', ['$scope', SearchViewController]);
	app.directive('searchView', SearchViewDirectives);

}(angular.module("caracolplaylgtvapp.searchView", [
	'ui.router'
])));