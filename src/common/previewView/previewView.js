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

		$scope.telenovelasOptions = [
			{ label: 'Capitulos', active: true },
			{ label: 'Calificar', active: false },
			{ label: 'Trailer', active: false },
			{ label: 'Añadir a mi lista', active: false },
		];

		$scope.seriesOptions = [
			{ label: 'Capitulos', active: true },
			{ label: 'Calificar', active: false },
			{ label: 'Trailer', active: false },
			{ label: 'Añadir a mi lista', active: false },
		];

		$scope.newsOptions = [
			{ label: 'Ultimas Noticias', active: true },
			{ label: 'Trailer', active: false },
			{ label: 'Añadir a mi lista', active: false },
		];

		self.getSelected = function(type) {
			if($scope.selected.type === type) {
				return $scope.selected;
			}
			return null;
		};

		self.isMovie = function() {
			return $scope.selected.type === 'Películas';
		};

		self.isNews = function() {
			return $scope.selected.type === 'Noticias';
		};

		self.isSeries = function() {
			return $scope.selected.type === 'Series';
		};

		self.isTelenovelas = function() {
			return $scope.selected.type === 'Telenovelas';
		};

		var init = function() {
		};

		init();
	};

	app.controller('PreviewViewController', ['$scope', PreviewViewController]);
	app.directive('previewView', PreviewViewDirective);

}(angular.module("caracolplaylgtvapp.previewView", [
	'ui.router'
])));