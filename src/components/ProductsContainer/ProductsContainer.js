(function(app) {

    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('ProductsContainer', {
            url: '/productscontainer',
            views: {
                "main": {
                    controller: 'ProductsContainerController',
                    templateUrl: 'ProductsContainer/ProductsContainer.tpl.html'
                }
            },
            data:{ pageTitle: 'ProductsContainer' }
        });
    }]);

    app.controller('ProductsContainerController', ['$scope', function ($scope) {

        var init = function() {
        };

        init();
    }]);

    var ProductsContainer = function() {
        return {
            restrict: 'E',
            templateUrl: 'ProductsContainer.tpl.html',
            controller: 'ProductsContainerController',
            controllerAs: 'ProductsContainerCtrl',
            scope : {
                productData: '='
            }
        };
    };
    app.directive('ProductsContainer', ['', ProductsContainer]);




}(angular.module("caracolplaylgtvapp.ProductsContainer", [
    'ui.router'
])));