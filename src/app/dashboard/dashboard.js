(function (app) {

    app.config(['$stateProvider', function ($stateProvider) {
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

    var DashboardController = function ($scope, ProductService, UserInfo, hotkeys, $state, PreviewDataService, DevInfo, UserService, AlertDialogService, TermsViewService, MyListItems, GeneralModalViewService) {
        var self = this;
        var keyboardInit = angular.noop || {};

        self.slides = [];
        self.list = [];

        self.active = 0;
        self.isPreviewActive = false;
        self.isShowInfo = false;

        self.selectedItem = {};
        self.isInSearch = false;

        $scope.mail = UserInfo.mail;
        $scope.signOutSelected = false;
        $scope.termsSelected = false;
        $scope.whatIsSelected = false;

        self.beforeSearchIsPreviewActive = false;

        $scope.showTerms = function () {
            TermsViewService.showTerms(function () {
                if(self.active >= self.list.length +1 ){
                    activeEventsBottomOptions();
                }   
            }, undefined, false);
        };

        $scope.showWhatIs = function () {
            TermsViewService.ShowWhatIs(function () {
                if(self.active >= self.list.length +1 ){
                    activeEventsBottomOptions();
                }   
            }, undefined, false);
        };

        $scope.$watch('keywordToSearch', function (newValue, oldValue) {
            if (newValue !== undefined && newValue !== '') {
                self.isInSearch = true;

                if ($scope.restartConfigKeyboard.searchRestart) {
                    $scope.restartConfigKeyboard.searchRestart();
                }

                if (self.isPreviewActive) {
                    self.beforeSearchIsPreviewActive = true;
                    self.isPreviewActive = false;
                }

                $state.go('search', {
                    'keyword': $scope.keywordToSearch
                });
            } else {
                self.isInSearch = false;

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

        $scope.onLogout = function () {
            var logoutPromise = UserService.logout(UserInfo.alias, UserInfo.password, UserInfo.session);
            logoutPromise.then(function (response) {

                if (response.data.status) {
                    AlertDialogService.show(
                        'warning',
                        response.data.message,
                        'Aceptar',
                        keyboardInit
                    );

                    localStorage.removeItem('userInfo');
                    UserInfo.name = '';
                    UserInfo.lastname = '';
                    UserInfo.alias = '';
                    UserInfo.mail = '';
                    UserInfo.password = '';
                    UserInfo.session = '';
                    UserInfo.uid = '';
                    UserInfo.isSubscription = false;
                    UserInfo.timeEnds = '';
                    $scope.mail = '';
                } else {
                    AlertDialogService.show(
                        'warning',
                        response.data.response,
                        'Aceptar',
                        keyboardInit
                    );
                }
            }, function (response) {
                AlertDialogService.show(
                    'warning',
                    response.data.response,
                    'Aceptar',
                    keyboardInit
                );
            });
        };

        $scope.logout = function () {
            GeneralModalViewService.show('warning', '¿Seguro que desea cerrar su sesión?', 'Cerrar sesión', 'Cancelar', 'Aceptar', undefined,
                function () {
                    $scope.onLogout();
                });
        };

        self.isKeyboardActive = function (pos) {
            return pos === self.active;
        };

        self.showPreview = function () {
            return self.isPreviewActive;
        };

        self.showInfo = function () {
            return self.isShowInfo;
        };

        self.getUserRecentlyWatched = function () {
            var promiseRecentWatched = ProductService.getUserRecentlyWatched();
            promiseRecentWatched.then(function (response) {
                if (response.data.length === 0) {
                    for(var i=0,j = self.list.length; i<j; i++){
                        var listC = self.list[i];
                        if (listC.name === 'Ultimos vistos') {
                            listC.splice(i,1);
                            return;
                        }
                    }
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

        self.getList = function () {
            var promiseGetList = ProductService.getList();
            promiseGetList.then(function (response) {
                if(response.data.my_list.length === 0){
                    return;
                }
                MyListItems.list = response.data.my_list.map(function (item) {
                    item.inList = true;
                    item.feature_text = item.description;
                    return item;
                });

                self.list.push({
                    name: 'Mi Lista',
                    products: MyListItems.list,
                });
            });
        };

        self.showSearch = function (value) {
            self.isInSearch = value;

            if (!value) {
                keyboardInit();

                if ($scope.restartConfigKeyboard.restart) {
                    $scope.restartConfigKeyboard.restart();
                }
            }
        };

        self.activePreview = function (value, item) {
            var productPremise;

            if (item) {
                productPremise = ProductService.getProductWithID(item.id, '');
            } else {
                productPremise = ProductService.getProductWithID(self.selectedItem.id, '');
            }

            productPremise.then(function (res) {
                PreviewDataService.setItemSelected(res.data.products['0'][0]);
                $state.go('preview', {
                    from: 'dashboard'
                });
            });

            self.isShowInfo = value;
            self.isPreviewActive = value;
            if (!value) {
                keyboardInit();

                self.getUserRecentlyWatched();

                if ($scope.restartConfigKeyboard.restart) {
                    $scope.restartConfigKeyboard.restart();
                }
            } else {
                outAnimation();
            }
        };

        var inAnimation = function () {
            $('.preview-cover').css('right', '0%');
            /*
             $('.preview-cover').stop().animate({
             right: '0%',
             }, 500, 'swing', function() {
             self.isShowInfo = true;
             });
             */
            self.isShowInfo = true;
        };

        var outAnimation = function () {
            $('.preview-cover').css('right', '-30%');
            /*
             $('.preview-cover').stop().animate({
             right: '-25%',
             }, 500, 'swing', function() {
             self.isShowInfo = false;
             });
             */
            self.isShowInfo = false;
        };

        var activeEventsBottomOptions = function () {
            //if (self.active + 1 < self.list.length +1) {
                self.active++;
            //}

            self.quantityButtons = ($scope.mail) ? 3 : 2;

            self.downActive = 0; //variable que controla que funcion inferior esta activa
            var setFocusActive = function (value) {
                switch (value) {
                    case 0 :
                    {
                        $scope.signOutSelected = false;
                        $scope.termsSelected = true;
                        $scope.whatIsSelected = false;
                    }
                        break;
                    case 1:
                    {
                        $scope.signOutSelected = false;
                        $scope.termsSelected = false;
                        $scope.whatIsSelected = true;
                    }
                        break;
                    case 2:
                    {
                        $scope.signOutSelected = true;
                        $scope.termsSelected = false;
                        $scope.whatIsSelected = false;
                    }
                        break;
                }
            };

            var div = $('footer');

            //console.log('div', div, $(div).position().top);
            if ($(div).position()) {
                $('.scroll-area').scrollTop($(div).position().top - 134);
            }
            outAnimation();
            if ($scope.mail) {
                //$scope.signOutSelected = true;
                self.downActive = 2;

            }
            setFocusActive(self.downActive);

            hotkeys.add({
                combo: 'right',
                callback: function () {
                    self.downActive = ++self.downActive % self.quantityButtons;
                    setFocusActive(self.downActive);
                }
            });

            hotkeys.add({
                combo: 'left',
                callback: function () {
                    self.downActive = (self.downActive - 1 < 0 ) ? self.quantityButtons - 1 : --self.downActive;
                    setFocusActive(self.downActive);
                }
            });

            hotkeys.add({
                combo: 'enter',
                callback: function () {
                    var myFunction = angular.noop;
                    switch (self.downActive) {
                        case 0 :
                        {
                            myFunction = $scope.showTerms;
                        }
                            break;
                        case 1 :
                        {
                            myFunction = $scope.showWhatIs;
                        }
                            break;
                        case 2 :
                        {
                            myFunction = $scope.logout;
                        }
                    }
                    myFunction();
                }
            });

        };

        $('.preview-cover').css('right', '-30%');

        keyboardInit = function () {

            var redButtonCallback = function () {
                $state.reload();
            };

            hotkeys.add({
                combo: 'red',
                callback: redButtonCallback,
            });

            if (DevInfo.isInDev) {
                hotkeys.add({
                    combo: 'r',
                    callback: redButtonCallback,
                });
            }

            var yellowButtonCallback = function (event) {
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
                callback: function (event) {
                    event.preventDefault();
                    if (self.active + 1 > self.list.length + 1) {
                        activeEventsBottomOptions();
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
                combo: 'up',
                callback: function () {
                    event.preventDefault();
                    if ($scope.signOutSelected || $scope.termsSelected || $scope.whatIsSelected) {
                        inAnimation();
                        self.active = self.list.length + 1;
                        $scope.signOutSelected = false;
                        $scope.termsSelected = false;
                        $scope.whatIsSelected = false;
                        return;
                    }
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

        var init = function () {
            var featuredPromise = ProductService.getFeatured();
            var categoriesPromise = ProductService.getCategories();

            self.slides.length = 0;
            self.list.length = 0;

            var userInfoStr = localStorage.getItem('userInfo');

            if (userInfoStr) {
                var userInfo = JSON.parse(userInfoStr);

                var authPromise = UserService.authenticateUser(userInfo.alias, userInfo.password);

                authPromise.then(function (response) {
                    var resObj = response.data;

                    if (resObj.status) {
                        UserInfo.name = resObj.user.data.nombres;
                        UserInfo.lastname = resObj.user.data.apellidos;
                        UserInfo.alias = resObj.user.data.alias;
                        UserInfo.mail = resObj.user.data.mail;
                        UserInfo.password = userInfo.password;
                        UserInfo.session = resObj.session;
                        UserInfo.uid = resObj.uid;
                        UserInfo.isSubscription = resObj.user.is_suscription;
                        UserInfo.timeEnds = resObj.user.time_ends;

                        $scope.mail = UserInfo.mail;

                        localStorage.setItem('userInfo', JSON.stringify(UserInfo));

                        self.getList();
                    }
                });

                /*
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

                 $scope.mail = userInfo.mail;
                 */
            }

            featuredPromise.then(function (response) {
                var featuredArray = response.data.featured;

                for (var i in featuredArray) {
                    self.slides.push({
                        id: featuredArray[i].id,
                        image: featuredArray[i].image_smarttv,
                        text: featuredArray[i].feature_text,
                        rate: (featuredArray[i].rate * 5) / 100,
                        name: featuredArray[i].name,
                    });
                }
            });

            categoriesPromise.then(function (response) {
                var list = response.data.categories;
                var promise = {};
                var pos = 0;
                var promiseFunction = function (pos) {
                    return function (res) {
                        if (res.data.products && res.data.products.length > 0) {
                            self.list.push({
                                name: list[pos].name,
                                products: res.data.products.map(function (item) {
                                    item.rate = item.rate * 5 / 100;
                                    return item;
                                })
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

    app.controller('DashboardController', ['$scope', 'ProductService', 'UserInfo', 'hotkeys', '$state', 'PreviewDataService', 'DevInfo', 'UserService', 'AlertDialogService', 'TermsViewService', 'MyListItems', 'GeneralModalViewService', DashboardController]);

}(angular.module("caracolplaylgtvapp.dashboard", [
    'ui.router',
    'cfp.hotkeys'
])));