(function(app) {

    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('searchView', {
            url: '/searchview',
            views: {
                "main": {
                    controller: 'SearchViewController',
                    templateUrl: 'searchView/searchView.tpl.html'
                }
            },
            data:{ pageTitle: 'SearchView' }
        });
    }]);

    app.controller('SearchViewController', ['$scope', function ($scope) {

        var init = function() {
        };

        init();
    }]);

}(angular.module("caracolplaylgtvapp.searchView", [
    'ui.router'
])));