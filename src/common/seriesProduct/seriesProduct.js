(function(app) {

	var SeriesProductController = function($scope, hotkeys, $modal) {
		var self = this;

		self.OPTIONS_SECTION = 0;
		self.SEASONS_SECTION = 1;
		self.EPISODES_SECTION = 2;

		self.sections = [];

		self.seasonsButtons = [];
		self.episodesButtons = [];

		self.seasonSelected = 0;
		self.episodeSelected = 0;

		self.chapterSelected = {};

		self.sectionActive = 0;

		$scope.getSeasonLabel = function() {
			if(!$scope.selected) {
				return '';
			}
			if(!$scope.selected.season_list) {
				return '';
			}

			switch($scope.selected.type) {
				case 'Noticias':
					return $scope.selected.season_list[self.seasonSelected].season_name;
				case 'Telenovelas':
					return $scope.selected.name + ' - ' + (self.episodesButtons.length) + ' Chapters';
				default:
					return 'Season ' + (self.seasonSelected + 1) + ' - ' + (self.episodesButtons.length) + ' Chapters';
			}
		};

		$scope.getSeasonButtonLabel = function() {
			if(!$scope.selected) {
				return '';
			}
			if(!$scope.selected.season_list) {
				return '';
			}

			switch($scope.selected.type) {
				case 'Noticias':
					return $scope.selected.season_list[self.seasonSelected].season_name;
				case 'Telenovelas':
					return $scope.selected.name;
				default:
					return 'Season ' + (self.seasonSelected + 1);
			}

			if($scope.selected.type === 'Noticias') {
				return $scope.selected.season_list[self.seasonSelected].season_name;
			}
			return 'Season ' + (self.seasonSelected + 1);
		};

		$scope.getChapterName = function() {
			if(!$scope.selected) {
				return '';
			}
			if(!$scope.selected.season_list) {
				return '';
			}
			switch($scope.selected.type) {
				case 'Noticias':
					return self.chapterSelected.episode_name + ' - ' + self.chapterSelected.duration;
				default:
					return 'Chapter ' + (self.episodeSelected + 1) + ' - ' + self.chapterSelected.duration;
			}
		};

		$scope.open = function(size) {
			var modalInstance = $modal.open({
				templateUrl: 'purchaseView/purchaseView.tpl.html',
				controller: 'PurchaseViewController',
				size: size,
				resolve: {
					items: function () {
						return $scope.items;
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
			});
		};

		var setSeasonSelected = function(selected, position) {
			if(position >= 0) {
				if(self.seasonsButtons && self.seasonsButtons.length !== 0) {
					self.seasonsButtons[self.seasonSelected].active = false;
				}
				self.seasonSelected = position;
				if(self.seasonsButtons && self.seasonsButtons.length !== 0) {
					self.seasonsButtons[self.seasonSelected].active = true;
				}
			}

			self.episodesButtons.length = 0;
			var episodes = [];
			if(selected && selected.season_list) {
				episodes = selected.season_list[self.seasonSelected].episodes;
			}

			for(var i in episodes) {
				var label = '';
				if(selected.type === 'Noticias') {
					label = episodes[i].episode_name;
				} else {
					label = episodes[i].episode_number + '. ' + episodes[i].episode_name;
				}

				self.episodesButtons.push({
					label: label,
					active: false,
				});
			}
		};

		var configHotkeys = function() {
			hotkeys.add({
				combo: 'up',
				callback: function(event) {
					var buttons = [];

					event.preventDefault();

					switch(self.sections[self.sectionActive]) {
						case self.OPTIONS_SECTION:
							buttons = $scope.options;
							break;
						case self.SEASONS_SECTION:
							buttons = self.seasonsButtons;
							break;
						case self.EPISODES_SECTION:
							buttons =  self.episodesButtons;
							break;
					}

					for(var i in buttons) {
						if(buttons[i].active && buttons[parseInt(i) - 1]) {
							buttons[i].active = false;
							buttons[parseInt(i) - 1].active = true;

							switch(self.sections[self.sectionActive]) {
								case self.SEASONS_SECTION:
									setSeasonSelected($scope.selected, parseInt(i) - 1);
									break;
								case self.EPISODES_SECTION:
									self.episodeSelected = parseInt(i) - 1;
									self.chapterSelected = $scope.selected.season_list[self.seasonSelected].episodes[parseInt(i) - 1];
									break;
							}
							return;
						}
					}

					buttons[0].active = true;
				},
			});

			hotkeys.add({
				combo: 'down',
				callback: function(event) {
					var buttons = [];

					event.preventDefault();

					switch(self.sections[self.sectionActive]) {
						case self.OPTIONS_SECTION:
							buttons = $scope.options;
							break;
						case self.SEASONS_SECTION:
							buttons = self.seasonsButtons;
							break;
						case self.EPISODES_SECTION:
							buttons =  self.episodesButtons;
							break;
					}

					for(var i in buttons) {
						if(buttons[i].active && buttons[parseInt(i) + 1]) {
							buttons[i].active = false;
							buttons[parseInt(i) + 1].active = true;

							switch(self.sections[self.sectionActive]) {
								case self.SEASONS_SECTION:
									setSeasonSelected($scope.selected, parseInt(i) + 1);
									break;
								case self.EPISODES_SECTION:
									self.episodeSelected = parseInt(i) + 1;
									self.chapterSelected = $scope.selected.season_list[self.seasonSelected].episodes[parseInt(i) + 1];
									break;
							}
							return;
						}
					}

					buttons[buttons.length - 1].active = true;
				},
			});

			hotkeys.add({
				combo: 'right',
				callback: function() {
					if(self.sectionActive + 1 >= self.sections.length) {
						return;
					}

					self.sectionActive++;

					switch(self.sections[self.sectionActive]) {
						case self.EPISODES_SECTION:
							self.episodesButtons[0].active = true;
							self.episodeSelected = 0;
							self.chapterSelected = $scope.selected.season_list[self.seasonSelected].episodes[0];
							$('.chapters-season').animate({
								right: '25%',
							}, 1000, 'swing');
							break;
					}
				},
			});

			hotkeys.add({
				combo: 'left',
				callback: function() {

					if(self.sectionActive - 1 < 0) {
						return;
					}

					self.sectionActive--;

					switch(self.sections[self.sectionActive]) {
						case self.SEASONS_SECTION:
							$('.chapters-season').animate({
								right: '0',
							}, 1000, 'swing');
							self.episodesButtons[self.episodeSelected].active = false;
							break;
					}
				},
			});

			hotkeys.add({
				combo: 'enter',
				callback: function() {
					$scope.open('lg');
				}
			});
		};

		var selectedWatcherMethod = function(newValue, oldValue) {
			if(!newValue) {
				return;
			}

			self.seasonsButtons.length = 0;
			var seasons = newValue.season_list;

			if(seasons) {
				if(seasons.length) {
					if(seasons.length === 1) {
						$('.chapters-season').css("right", '25%');
						self.sections.length = 0;
						self.sections.push(self.OPTIONS_SECTION);
						self.sections.push(self.EPISODES_SECTION);
					} else {
						self.sections.length = 0;
						self.sections.push(self.OPTIONS_SECTION);
						self.sections.push(self.SEASONS_SECTION);
						self.sections.push(self.EPISODES_SECTION);
					}
				}
			}

			if(newValue.type === 'Películas') {
				self.sections.length = 0;
				$('.preview-season').addClass('ng-hide');
				$('.chapters-season').addClass('ng-hide');
				$('.preview-chapter').addClass('ng-hide');
				$('.series-description').css("right", '25%');
				self.sections.push(self.OPTIONS_SECTION);
			} else {
				$('.preview-season').removeClass('ng-hide');
				$('.chapters-season').removeClass('ng-hide');
				$('.preview-chapter').removeClass('ng-hide');
				$('.series-description').css("right", '70%');
			}

			for(var i in seasons) {
				var label = '';
				if(newValue.type === 'Noticias') {
					label = seasons[i].season_name;
				} else {
					label = 'Season ' + (parseInt(i) + 1);
				}
				self.seasonsButtons.push({
					label: label,
					active: false,
				});
			}

			if(seasons) {
				if(seasons.length) {
					setSeasonSelected(newValue, 0);
					self.chapterSelected = seasons[self.seasonSelected].episodes[0];
				}
			}

			if(newValue.trailer) {
				configHotkeys();
			}
		};

		var init = function() {
			self.seasonSelected = 0;

			$scope.$watch('selected', selectedWatcherMethod);
		};

		

		init();
	};

	var SeriesProductDirective = function() {
		return {
			restrict: 'E',
			controller: 'SeriesProductController',
			controllerAs: 'seriesProductCtrl',
			templateUrl: 'seriesProduct/seriesProduct.tpl.html',
			scope: {
				selected: '=selectedItem',
				options: '=displayOptions',
			}
		};
	};

	app.controller('SeriesProductController', ['$scope', 'hotkeys', '$modal', SeriesProductController]);
	app.directive('seriesProduct', SeriesProductDirective);

	app.filter('unsafe', function($sce) {
		return function(val) {
				return $sce.trustAsHtml(val);
			};
	});

}(angular.module("caracolplaylgtvapp.seriesProduct", [
	'ui.router'
])));