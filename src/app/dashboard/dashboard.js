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

	var DashboardController = function($scope, ProductService, hotkeys) {
		var self = this;

		self.slides = [];
		self.list = [];

		self.active = 0;
		self.isPreviewActive = false;
		self.isShowInfo = false;

		self.selectedItem = {};

		self.isKeyboardActive = function(pos) {
			return pos === self.active;
		};

		self.showPreview = function() {
			return self.isPreviewActive;
		};

		self.showInfo = function() {
			return self.isShowInfo;
		};

		self.activePreview = function() {
			self.isPreviewActive = true;
		};

		var inAnimation = function() {
			if(!self.isShowInfo) {
				$('.preview-cover').animate({
					right: 0,
				}, 1000, 'swing');
			}
			self.isShowInfo = true;
			
		};

		var outAnimation = function() {
			$('.preview-cover').animate({
				right: '-=' + ($('.preview-cover').width() + 200),
			}, 1000, 'swing', function() {
				self.isShowInfo = false;
			});
		};

		(function keyboardInit() {
			hotkeys.add({
				combo:'down',
				callback: function(event) {
					event.preventDefault();
					if(self.active + 1 >= self.slides.length - 2) { return; }
					self.active++;
					if(self.active === 1) {
						outAnimation();
					} else {
						inAnimation();
					}
				}
			});

			outAnimation();

			hotkeys.add({
				combo:'up',
				callback: function() {
					event.preventDefault();
					if(self.active - 1 < 1) { return; }
					self.active--;
					if(self.active === 1) {
						outAnimation();
					} else {
						inAnimation();
					}
				}
			});
		})();
		
		(function init() {
			var featuredPromise = ProductService.getFeatured();

			var categoriesPromise = ProductService.getCategories();

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

			categoriesPromise.then(function(response) {
				var list = response.data.categories;
				var promise = {};
				var pos = 0;

				console.log(list);

				var promiseFunction = function(pos) {
					return function(res) {
						if(res.data.products && res.data.products.length > 0) {
							self.list.push({ name: list[pos].name, products: res.data.products });
						}
					};
				};
				for(var i in list) {
					pos = i;
					promise = ProductService.getListFromCategoryId(list[i].id);
					promise.then(promiseFunction(i));
				}
			});

		})();
	};

	app.controller('DashboardController', ['$scope', 'ProductService', 'hotkeys', DashboardController]);

}(angular.module("caracolplaylgtvapp.dashboard", [
	'ui.router',
	'cfp.hotkeys'
])));