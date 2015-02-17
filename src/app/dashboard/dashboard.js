(function(app) {

	app.config(['$stateProvider', function($stateProvider) {
		$stateProvider.state('dashboard', {
			url: '/',
			views: {
				"main": {
					controller: 'DashboardController',
					controllerAs: 'dashCtrl',
					templateUrl: 'dashboard/dashboard.tpl.html'
				}
			},
			data: {
				pageTitle: 'Dashboard'
			}
		});
	}]);

	var DashboardController = function($scope, ProductService, UserInfo, hotkeys, $state, PreviewDataService, DevInfo) {
		var self = this;
		var keyboardInit = {};

		self.slides = [];
		self.list = [];

		self.active = 0;
		self.isPreviewActive = false;
		self.isShowInfo = false;

		self.selectedItem = {};
		self.isInSearch = false;

		self.beforeSearchIsPreviewActive = false;

		$scope.$watch('keywordToSearch', function(newValue, oldValue) {
			console.log(newValue);
			if (newValue !== undefined && newValue !== '') {
				self.isInSearch = true;
				console.log('In search!');

				if ($scope.restartConfigKeyboard.searchRestart) {
					$scope.restartConfigKeyboard.searchRestart();
				}

				if (self.isPreviewActive) {
					self.beforeSearchIsPreviewActive = true;
					self.isPreviewActive = false;
				}
			} else {
				self.isInSearch = false;
				console.log('No search!');

				keyboardInit();

				/*
				if(self.beforeSearchIsPreviewActive) {
					self.isPreviewActive = true;
					self.beforeSearchIsPreviewActive = false;

					if($scope.restartConfigKeyboard.restart) {
						$scope.restartConfigKeyboard.restart();
					}

					if($scope.restartConfigKeyboard.restartHotkeysSeriesProduct) {
						$scope.restartConfigKeyboard.restartHotkeysSeriesProduct();
					}
					
				}
				*/
			}
		});

		$scope.restartConfigKeyboard = {};

		self.isKeyboardActive = function(pos) {
			return pos === self.active;
		};

		self.showPreview = function() {
			return self.isPreviewActive;
		};

		self.showInfo = function() {
			return self.isShowInfo;
		};

		self.getUserRecentlyWatched = function() {
			var promiseRecentWatched = ProductService.getUserRecentlyWatched();
			promiseRecentWatched.then(function(response) {
				if (response.data.length === 0) {
					return;
				}

				for (var list in self.list) {
					if (list.name === 'Ultimos vistos') {
						list.products = response.data;
						return;
					}
				}

				self.list.push({
					name: 'Ultimos vistos',
					products: response.data
				});
			});
		};

		self.showSearch = function(value) {
			self.isInSearch = value;

			if (!value) {
				keyboardInit();

				if ($scope.restartConfigKeyboard.restart) {
					$scope.restartConfigKeyboard.restart();
				}
			}
		};

		self.activePreview = function(value) {
			var productPremise = ProductService.getProductWithID(self.selectedItem.id, '');

			productPremise.then(function(res) {
				PreviewDataService.setItemSelected(res.data.products['0'][0]);
				$state.go('preview', { from: 'dashboard' });
			});

			self.isShowInfo = value;
			self.isPreviewActive = value;
			if (!value) {
				keyboardInit();

				self.getUserRecentlyWatched();

				if ($scope.restartConfigKeyboard.restart) {
					$scope.restartConfigKeyboard.restart();
				}
			}
		};

		var inAnimation = function() {
			$('.preview-cover').stop().animate({
				right: '0%',
			}, 500, 'swing', function() {
				self.isShowInfo = true;
			});
			self.isShowInfo = true;

		};

		var outAnimation = function() {
			$('.preview-cover').stop().animate({
				right: '-25%',
			}, 500, 'swing', function() {
				self.isShowInfo = false;
			});
		};

		keyboardInit = function() {

			var yellowButtonCallback = function(event) {
				$state.go('search');
			};

			hotkeys.add({
				combo: 'yellow',
				callback: yellowButtonCallback
			});

			if (DevInfo.isInDev) {
				hotkeys.add({
					combo: 'y',
					callback: yellowButtonCallback
				});
			}

			hotkeys.add({
				combo: 'down',
				callback: function(event) {
					event.preventDefault();
					if (self.active + 1 > self.list.length + 1) {
						return;
					}
					self.active++;
					if (self.active === 1) {
						outAnimation();
					} else {
						inAnimation();
					}
				}
			});

			hotkeys.add({
				combo: '79',
				callback: function(event) {
					console.log('a');
				}
			});

			hotkeys.add({
				combo: 'up',
				callback: function() {
					event.preventDefault();
					if (self.active - 1 < 1) {
						return;
					}
					self.active--;
					if (self.active === 1) {
						outAnimation();
					} else {
						inAnimation();
					}
				}
			});
		};
		keyboardInit();

		var init = function() {
			var featuredPromise = ProductService.getFeatured();
			var categoriesPromise = ProductService.getCategories();

			self.slides.length = 0;
			self.list.length = 0;

			var userInfoStr = localStorage.getItem('userInfo');
			console.log('localStorage: ' + userInfoStr);

			if (userInfoStr) {
				var userInfo = JSON.parse(userInfoStr);

				UserInfo.name = userInfo.name;
				UserInfo.lastname = userInfo.lastname;
				UserInfo.alias = userInfo.alias;
				UserInfo.mail = userInfo.mail;
				UserInfo.password = userInfo.password;
				UserInfo.session = userInfo.session;
				UserInfo.uid = userInfo.uid;
				UserInfo.isSubscription = userInfo.isSubscription;
				UserInfo.timeEnds = userInfo.timeEnds;

				console.log('userInfo: ', UserInfo);
			}

			featuredPromise.then(function(response) {
				var featuredArray = response.data.featured;

				for (var i in featuredArray) {
					self.slides.push({
						id: featuredArray[i].id,
						image: featuredArray[i].image_url,
						text: featuredArray[i].feature_text,
						rate: (featuredArray[i].rate / 2) / 10,
						name: featuredArray[i].name,
					});
				}
			});

			categoriesPromise.then(function(response) {
				var list = response.data.categories;
				var promise = {};
				var pos = 0;

				var promiseFunction = function(pos) {
					return function(res) {
						if (res.data.products && res.data.products.length > 0) {
							self.list.push({
								name: list[pos].name,
								products: res.data.products
							});
						}
					};
				};
				for (var i in list) {
					pos = i;
					if (list[i].id === '1') {
						self.getUserRecentlyWatched();
					} else {
						promise = ProductService.getListFromCategoryId(list[i].id);
						promise.then(promiseFunction(i));
					}
				}
			});

		};
		init();
	};

	app.controller('DashboardController', ['$scope', 'ProductService', 'UserInfo', 'hotkeys', '$state', 'PreviewDataService', 'DevInfo', DashboardController]);

}(angular.module("caracolplaylgtvapp.dashboard", [
	'ui.router',
	'cfp.hotkeys'
])));