(function(app) {
    var PreviewViewDirective = function() {
        return {
            restrict: 'E',
            templateUrl: 'previewView/previewView.tpl.html',
            controller: 'PreviewViewController',
            controllerAs: 'previewViewCtrl',
            scope: {
                show: '=onShow',
                selected: '=selectedItem'
            }
        };
    };

    var PreviewDataService = function() {
        var self = this;

        self.selected = {};

        self.setItemSelected = function(selected) {
            self.selected = selected;
        };

        self.getItemSelected = function(selected) {
            return self.selected;
        };
    };

    app.service('PreviewDataService', [PreviewDataService]);

    app.config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('preview', {
            url: '/preview/:from',
            views: {
                'main': {
                    controller: 'PreviewViewController',
                    templateUrl: 'previewView/previewView.tpl.html'
                }
            },
            data: {
                pageTitle: 'Preview'
            },
            resolve: {
                itemSelected: ['PreviewDataService', function(PreviewDataService) {
                    return PreviewDataService.getItemSelected();
                }]
            }
        });
    }]);

    var PreviewViewController = function($scope, $modal, itemSelected, $stateParams, hotkeys, DevInfo, $state, MyListItems, UserInfo) {
        var self = this;
        $scope.from = $stateParams.from;
        $scope.selected = itemSelected;

        $scope.user = UserInfo.alias;

        $scope.home = function() {
            $state.go('dashboard');
        };

        $scope.$watch('keywordToSearch', function (newValue, oldValue) {
            if (newValue && newValue !== '') {
                self.isInSearch = true;

                $state.go('search', {
                    'keyword': $scope.keywordToSearch
                });
            } else {
                self.isInSearch = false;
                //keyboardInit();
            }
        });

        $scope.blurInput = function (event) {
            if (event.keyCode === 40) {
                event.target.blur();
                self.shouldBeFocus = false;
                self.active = 1;
            }
        };

        var init = function() {
            $scope.items = ['item1', 'item2', 'item3'];

            var redButtonCallback = function() {
                $state.go('dashboard');
            };

            hotkeys.add({
                combo: 'red',
                callback: redButtonCallback
            });

            if (DevInfo.isInDev) {
                hotkeys.add({
                    combo: 'r',
                    callback: redButtonCallback
                });
            }

            var yellowButtonCallback = function(event) {
                if($scope.from === 'search') {
                    window.history.back();
                } else {
                    $state.go('search');
                }
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

            $scope.onRate = function() {
                var modalInstance = $modal.open({
                    templateUrl: 'rateAlert/rateAlert.tpl.html',
                    controller: 'RateAlertController',
                    size: 'sm',
                    resolve: {
                        items: function() {
                            return $scope.items;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    $scope.selected = selectedItem;
                }, function() {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            $scope.moviesOptions = [
                { label: 'Reproducir', active: true, verifyVisibility: false },
                { label: 'Calificar', active: false, verifyVisibility: true },
                { label: 'Ver tráiler', active: false, verifyVisibility: false },
                { label: 'Añadir a mi lista', active: false, verifyVisibility: true }
            ];

            $scope.otherOptions = [
                { label: 'Reproducir', active: true, verifyVisibility: false },
                { label: 'Calificar', active: false, verifyVisibility: true },
                { label: 'Ver tráiler', active: false, verifyVisibility: false },
                { label: 'Añadir a mi lista', active: false, verifyVisibility: true }
            ];

            $scope.telenovelasOptions = [
                { label: 'Reproducir Cap. ', verifyVisibility: false, active: true},
                { label: 'Capítulos', verifyVisibility: false, active: false},
                { label: 'Calificar', verifyVisibility: true, active: false},
                { label: 'Ver tráiler', verifyVisibility: false, active: false},
                { label: 'Añadir a mi lista', verifyVisibility: true, active: false}
            ];

            $scope.seriesOptions = [
                { label: 'Reproducir Cap. ', verifyVisibility: false, active: true	},
                { label: 'Capítulos', verifyVisibility: false, active: false	},
                { label: 'Calificar', verifyVisibility: true, active: false	},
                { label: 'Ver tráiler', verifyVisibility: false, active: false	},
                { label: 'Añadir a mi lista', verifyVisibility: true, active: false	}
            ];

            $scope.newsOptions = [
                { label: 'Ultimas Noticias', verifyVisibility: false, active: true },
                { label: 'Ver tráiler', verifyVisibility: false, active: false },
                { label: 'Añadir a mi lista', verifyVisibility: true, active: false }
            ];

            $scope.getSelected = function(type) {
                if($scope.selected.type !== 'Películas' &&
                    $scope.selected.type !== 'Noticias' &&
                    $scope.selected.type !== 'Series' &&
                    $scope.selected.type !== 'Telenovelas' && type === 'other'){
                    return $scope.selected;
                }
                if ($scope.selected.type === type) {
                    return $scope.selected;
                }
                return null;
            };

            $scope.isMovie = function() {
                return $scope.selected.type === 'Películas'  || $scope.selected.bundle === 'pelicula';
            };

            $scope.isNews = function() {
                //console.log($scope.selected.type);
                return $scope.selected.type === 'Noticias' ;
            };

            $scope.isSeries = function() {
                return $scope.selected.type === 'Series';
            };

            $scope.isTelenovelas = function() {
                return $scope.selected.type === 'Telenovelas';
            };

            $scope.isOther = function(){
                var type =$scope.selected.type;
                return (type !== 'Películas' && type !== 'Noticias' && type !== 'Series' && type !== 'Telenovelas');
            };

            $scope.$watch('selected', function(newValue, oldValue) {
                for(var k in MyListItems.list) {
                    if(MyListItems.list[k].id === newValue.id) {
                        if($scope.newsOptions[2].label === 'Añadir a mi lista') {
                            $scope.newsOptions[2].label = 'Remover de mi lista';
                        }
                        if($scope.seriesOptions[3].label === 'Añadir a mi lista') {
                            $scope.seriesOptions[3].label = 'Remover de mi lista';
                        }

                        if($scope.telenovelasOptions[3].label === 'Añadir a mi lista') {
                            $scope.telenovelasOptions[3].label = 'Remover de mi lista';
                        }

                        if($scope.moviesOptions[3].label === 'Añadir a mi lista') {
                            $scope.moviesOptions[3].label = 'Remover de mi lista';
                        }
                        break;
                    }
                }

                var foundLast = false;
                if(newValue.type === 'Series' || newValue.type === 'Telenovelas') {
                    for(var i in newValue.season_list) {
                        for(var j in newValue.season_list[i].episodes) {
                            //console.log('last_chapter', newValue.season_list[i].episodes[j].last_chapter);
                            if(newValue.season_list[i].episodes[j].last_chapter) {
                                if(newValue.season_list.length > 1) {
                                    $scope.seriesOptions[0].label = 'Reproducir ' + 'Temp. ' + (parseInt(j) + 1) + ' Cap. ' + (parseInt(j) + 1);
                                    $scope.seriesOptions[0].season = j;
                                    $scope.seriesOptions[0].chapter = i;
                                    $scope.telenovelasOptions[0].label = 'Reproducir ' + 'Temp. ' + (parseInt(j) + 1) + ' Cap. ' + (parseInt(j) + 1);
                                    $scope.telenovelasOptions[0].season = j;
                                    $scope.telenovelasOptions[0].chapter = i;
                                } else {
                                    $scope.seriesOptions[0].label = 'Reproducir ' + 'Cap. ' + (parseInt(j) + 1);
                                    $scope.seriesOptions[0].season = j;
                                    $scope.seriesOptions[0].chapter = i;
                                    $scope.telenovelasOptions[0].label = 'Reproducir ' + 'Cap. ' + (parseInt(j) + 1);
                                    $scope.telenovelasOptions[0].season = j;
                                    $scope.telenovelasOptions[0].chapter = i;
                                }

                                foundLast = true;
                                break;
                            }
                        }
                    }
                }

                if(!foundLast) {
                    if(newValue.season_list === undefined){ //validación temporal
                        $state.go('dashboard');
                        return;
                    }

                    if(newValue.season_list.length > 1) {
                        $scope.seriesOptions[0].label = 'Reproducir ' + 'Temp. ' + 1 + ' Cap. ' + 1;
                        $scope.seriesOptions[0].season = 0;
                        $scope.seriesOptions[0].chapter = 0;
                        $scope.telenovelasOptions[0].label = 'Reproducir ' + 'Temp. ' + 1 + ' Cap. ' + 1;
                        $scope.telenovelasOptions[0].season = 0;
                        $scope.telenovelasOptions[0].chapter = 0;
                    } else {
                        $scope.seriesOptions[0].label = 'Reproducir ' + 'Cap. ' + 1;
                        $scope.seriesOptions[0].season = 0;
                        $scope.seriesOptions[0].chapter = 0;
                        $scope.telenovelasOptions[0].label = 'Reproducir ' + 'Cap. ' + 1;
                        $scope.telenovelasOptions[0].season = 0;
                        $scope.telenovelasOptions[0].chapter = 0;
                    }
                }

                if (newValue.description) {
                    $scope.selected.feature_text = newValue.description;
                }
            });
        };

        init();
    };

    app.controller('PreviewViewController', ['$scope', '$modal', 'itemSelected', '$stateParams', 'hotkeys', 'DevInfo', '$state', 'MyListItems', 'UserInfo', PreviewViewController]);
    app.directive('previewView', PreviewViewDirective);

}(angular.module("caracolplaylgtvapp.previewView", [
    'ui.router'
])));