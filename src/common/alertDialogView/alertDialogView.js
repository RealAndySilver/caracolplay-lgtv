(function(app) {

    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('alertDialogView', {
            url: '/alertdialogview',
            views: {
                "main": {
                    controller: 'AlertDialogViewController',
                    templateUrl: 'alertDialogView/alertDialogView.tpl.html'
                }
            },
            data:{ pageTitle: 'AlertDialogView' }
        });
    }]);

    app.controller('AlertDialogViewController', ['$scope', function ($scope) {

        var init = function() {
        };

        init();
    }]);

}(angular.module("caracolplaylgtvapp.alertDialogView", [
    'ui.router'
])));