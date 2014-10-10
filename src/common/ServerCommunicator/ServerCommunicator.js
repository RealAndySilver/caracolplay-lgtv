(function(app) {

	var ProductService =  function($http) {
		this.getFeatured = function() {
			return $http.get('assets/dummy/featured.json');
		};

		this.getSeries = function() {
			return $http.get('assets/dummy/series.json');
		};

		this.getMovies = function() {
			return $http.get('assets/dummy/peliculas.json');
		};

		this.getTelenovelas = function() {
			return $http.get('assets/dummy/telenovelas.json');
		};

		this.getNews = function() {
			return $http.get('assets/dummy/noticias.json');
		};
	};

	app.service('ProductService',['$http', ProductService]);

} (angular.module("caracolplaylgtvapp.ServerCommunicator", [
	'ui.router'
])));