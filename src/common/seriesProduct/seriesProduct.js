(function(app) {

	var SeriesProductController = function($scope, hotkeys) {
		var self = this;

		self.OPTIONS_SECTION = 0;
		self.SEASONS_SECTION = 1;
		self.EPISODES_SECTION = 2;

		self.seasonsButtons = [];
		self.episodesButtons = [];

		self.seasonSelected = 0;
		self.episodeSelected = -1;

		self.chapterSelected = {};

		self.sectionActive = self.OPTIONS_SECTION;

		$scope.getSeasonLabel = function() {
			if(!$scope.selected) {
				return '';
			}
			if(!$scope.selected.season_list) {
				return '';
			}
			if($scope.selected.type === 'Noticias') {
				return $scope.selected.season_list[self.seasonSelected].season_name;
			}
			return 'Season ' + (self.seasonSelected + 1) + ' - ' + (self.episodesButtons.length) + ' Chapters';
		};

		$scope.getSeasonButtonLabel = function() {
			if(!$scope.selected) {
				return '';
			}
			if(!$scope.selected.season_list) {
				return '';
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
			if($scope.selected.type === 'Noticias') {
				return self.chapterSelected.episode_name + ' - ' + self.chapterSelected.duration;
			}
			return 'Chapter ' + (self.episodeSelected + 1) + ' - ' + self.chapterSelected.duration;
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
				callback: function() {
					var buttons = [];

					switch(self.sectionActive) {
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

							if(self.sectionActive === self.SEASONS_SECTION) {
								setSeasonSelected($scope.selected, parseInt(i) - 1);
							} else if(self.sectionActive === self.EPISODES_SECTION) {
								self.episodeSelected = parseInt(i) - 1;
								self.chapterSelected = $scope.selected.season_list[self.seasonSelected].episodes[parseInt(i) - 1];
							}
							return;
						}
					}

					buttons[0].active = true;
				},
			});

			hotkeys.add({
				combo: 'down',
				callback: function() {
					var buttons = [];

					switch(self.sectionActive) {
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

							if(self.sectionActive === self.SEASONS_SECTION) {
								setSeasonSelected($scope.selected, parseInt(i) + 1);
							} else if(self.sectionActive === self.EPISODES_SECTION) {
								self.episodeSelected = parseInt(i) + 1;
								self.chapterSelected = $scope.selected.season_list[self.seasonSelected].episodes[parseInt(i) + 1];
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
					switch(self.sectionActive) {
						case self.OPTIONS_SECTION:
							self.sectionActive = self.SEASONS_SECTION;
							break;
						case self.SEASONS_SECTION:
							self.episodesButtons[0].active = true;
							self.episodeSelected = 0;
							self.chapterSelected = $scope.selected.season_list[self.seasonSelected].episodes[0];
							self.sectionActive = self.EPISODES_SECTION;
							$('.chapters-season').animate({
								right: '25%',
							}, 1000, 'swing');
							break;
						case self.EPISODES_SECTION:
							break;
					}
				},
			});

			hotkeys.add({
				combo: 'left',
				callback: function() {
					switch(self.sectionActive) {
						case self.OPTIONS_SECTION:
							break;
						case self.SEASONS_SECTION:
							self.sectionActive = self.OPTIONS_SECTION;
							break;
						case self.EPISODES_SECTION:
							self.sectionActive = self.SEASONS_SECTION;
							$('.chapters-season').animate({
								right: '0',
							}, 1000, 'swing');
							self.episodesButtons[self.episodeSelected].active = false;
							break;
					}
				},
			});
		};

		var selectedWatcherMethod = function(newValue, oldValue) {
			if(!newValue) {
				return;
			}

			self.seasonsButtons.length = 0;
			var seasons = newValue.season_list;
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

			setSeasonSelected(newValue, 0);

			if(seasons) {
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
				options: '=displayOptions'
			}
		};
	};

	app.controller('SeriesProductController', ['$scope', 'hotkeys', SeriesProductController]);
	app.directive('seriesProduct', SeriesProductDirective);

}(angular.module("caracolplaylgtvapp.seriesProduct", [
	'ui.router'
])));