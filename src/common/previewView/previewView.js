(function(app) {
	var PreviewViewDirective = function() {
		return {
			restrict: 'E',
			templateUrl: 'previewView/previewView.tpl.html',
			controller: 'PreviewViewController',
			controllerAs: 'previewViewCtrl',
			scope: {
				show: '=onShow',
				selected: '=selectedItem',
			}
		};
	};

	var PreviewViewController = function($scope) {
		var self = this;

		self.moviesOptions = [
			{ label: 'Reproducir', active: true },
			{ label: 'Calificar', active: false },
			{ label: 'Trailer', active: false },
			{ label: 'Añadir a mi lista', active: false },
		];

		self.seriesOptions = [
			{ label: 'Capitulos', active: true },
			{ label: 'Calificar', active: false },
			{ label: 'Trailer', active: false },
			{ label: 'Añadir a mi lista', active: false },
		];

		self.telenovelasOptions = [
			{ label: 'Capitulos', active: true },
			{ label: 'Calificar', active: false },
			{ label: 'Trailer', active: false },
			{ label: 'Añadir a mi lista', active: false },
		];

		self.seasonsButtons = [];
		self.episodesButtons = [];

		self.seasonSelected = 0;
		self.episodeSelected = 0;

		self.isMovie = function() {
			console.log($scope.selected.type);
			return $scope.selected.type === 'Películas';
		};

		self.isNews = function() {
			console.log($scope.selected.type);
			return $scope.selected.type === 'Noticias';
		};

		self.isSeries = function() {
			console.log($scope.selected.type);
			return $scope.selected.type === 'Series';
		};

		self.isTelenovelas = function() {
			console.log($scope.selected.type);
			return $scope.selected.type === 'Telenovelas';
		};

		var setSeasonSelected = function(selected, position) {
			console.log('selected');
			console.log(selected);

			if(position) {
				if(self.seasonsButtons) {
					self.seasonsButtons[self.seasonSelected].active = false;
				}
				self.seasonSelected = position;
				if(self.seasonsButtons) {
					self.seasonsButtons[self.seasonSelected].active = true;
				}
			}

			self.episodesButtons = [];
			var episodes = [];
			if(selected) {
				episodes = selected.season_list[self.seasonSelected].episodes;
			}

			console.log(selected.season_list[self.seasonSelected]);

			for(var i in episodes) {
				self.episodesButtons.push({
					label: episodes[i].episode_number + ') ' + episodes[i].episode_name,
					active: true,
				});
			}
		};

		var init = function() {
			self.seasonSelected = 0;

			$scope.$watch('selected', function(newValue, oldValue) {
				self.seasonsButtons = [];
				var seasons = newValue.season_list;
				for(var i in seasons) {
					self.seasonsButtons.push({
						label: 'Season ' + (parseInt(i) + 1),
						active: false,
					});
				}

				setSeasonSelected(newValue, 5);
			});
		};

		init();
	};

	app.controller('PreviewViewController', ['$scope', PreviewViewController]);
	app.directive('previewView', PreviewViewDirective);

}(angular.module("caracolplaylgtvapp.previewView", [
	'ui.router'
])));