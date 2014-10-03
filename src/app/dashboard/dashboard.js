(function(app) {

    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('dashboard', {
            url: '/dashboard',
            views: {
                "main": {
                    controller: 'DashboardController',
                    controllerAs: 'dashCtrl',
                    templateUrl: 'dashboard/dashboard.tpl.html'
                }
            },
            data:{ pageTitle: 'Dashboard' }
        });
    }]);

    app.controller('DashboardController', ['$scope', 'ProductService', function ($scope, ProductService) {

        var self = this;

        self.slides = [];

        (function init() {

            var pfPromise = ProductService.getFeatured();

            pfPromise.then(function(response){

                var featuredArray = [],
                    temporalSlides = [];

                featuredArray = response.data.featured;

                for(var i = 0; i < featuredArray.length; i++){
                    console.log(featuredArray[i].name + ': '+Math.ceil(featuredArray[i].rate/2)/10);
                    temporalSlides.push({
                        image: featuredArray[i].image_url,
                        text: featuredArray[i].feature_text,
                        rate: (featuredArray[i].rate/2)/10,
                        name: featuredArray[i].name,
                    });
                }
                
                self.slides = temporalSlides;

                self.dummy = {
                    title:'featured',
                    slides: temporalSlides
                };
            });
        })();
    }]);

}(angular.module("caracolplaylgtvapp.dashboard", [
    'ui.router'
])));