(function(app) {

    var ProductService =  function($http){
        this.getFeatured = function(){
            return $http.get('assets/dummy/featured.json');
        };
    };
    app.service('ProductService',['$http', ProductService]);

}(angular.module("caracolplaylgtvapp.ServerCommunicator", [
    'ui.router'
])));