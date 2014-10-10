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

	app.controller('DashboardController', ['$scope', 'ProductService', 'hotkeys', function ($scope, ProductService, hotkeys) {
		var self = this;

		self.slides = [];
		self.series = [];
		self.movies = [];
		self.telenovelas = [];
		self.news = [];

		self.active = 0;

		hotkeys.add({
			combo:'down',
			callback: function(event) {
				event.preventDefault();
				if(self.active + 1 > 5) { return; }
				self.active++;
			}
		});

		hotkeys.add({
			combo:'up',
			callback: function() {
				event.preventDefault();
				if(self.active - 1 < 1) { return; }
				self.active--;
			}
		});

		self.isKeyboardActive = function(pos) {
			return pos === self.active;
		};

		(function init() {
			var featuredPromise = ProductService.getFeatured();
			var seriesPromise = ProductService.getSeries();
			var moviesPromise = ProductService.getMovies();
			var telenovelasPromise = ProductService.getTelenovelas();
			var newsPromise = ProductService.getNews();

			featuredPromise.then(function(response) {
				var featuredArray = response.data.featured;

				for(var i in featuredArray) {
					//console.log(featuredArray[i].name + ': '+Math.ceil(featuredArray[i].rate/2)/10);
					self.slides.push({
						image: featuredArray[i].image_url,
						text: featuredArray[i].feature_text,
						rate: (featuredArray[i].rate/2)/10,
						name: featuredArray[i].name,
					});
				}
			});

			seriesPromise.then(function(response) {
				self.series = response.data.products;
			});

			moviesPromise.then(function(response) {
				self.movies = response.data.products;
			});

			telenovelasPromise.then(function(response) {
				self.telenovelas = response.data.products;
			});

			newsPromise.then(function(response) {
				self.news = response.data.products;
			});
		})();
	}]);

}(angular.module("caracolplaylgtvapp.dashboard", [
	'ui.router',
	'cfp.hotkeys'
])));