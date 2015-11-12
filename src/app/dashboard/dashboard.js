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

    var DashboardController = function ($scope, ProductService, UserInfo, hotkeys, $state, PreviewDataService, DevInfo,
                                        UserService, AlertDialogService, TermsViewService, MyListItems,
                                        GeneralModalViewService, bestWatch,$rootScope,$timeout) {
        var self = this;
        var keyboardInit;

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
        $scope.animations = {};
        self.beforeSearchIsPreviewActive = false;

        $scope.$on("$stateChangeStart", function (event, toState,toParams,fromState,fromParams) {
            if(fromState.name === "dashboard"){
                var objSaved = {};
                objSaved.active = self.active;
                $rootScope.selfDashboard = objSaved;
            }
        });

        $scope.showTerms = function () {
            $scope.animations.isOpenModal = true;
            TermsViewService.showTerms(function(){
                $scope.animations.isOpenModal = false;
            }, function(){
                $scope.animations.isOpenModal = false;
            }, false);
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
            console.log(
                UserInfo.alias,
                UserInfo.password,
                UserInfo.session
            );
            var logoutPromise = UserService.logout(UserInfo.alias, UserInfo.password, UserInfo.session);
            logoutPromise.then(function (response) {
                console.log('response', response);

                if (response.data.status) {
                    AlertDialogService.show(
                        'warning',
                        response.data.message,
                        'Aceptar',
                        function () {
                            keyboardInit();
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


                            window.location = window.location.pathname;
                        }
                    );


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
            var previous = self.active;
            var boolean1 = $scope.signOutSelected;
            var boolean2 = $scope.termsSelected;
            $scope.signOutSelected = false;
            $scope.termsSelected = false;
            self.active = 9999;
            $scope.animations.isOpenModal = true;
            GeneralModalViewService.show('warning', '¿Seguro que desea cerrar su sesión?',
                'Cerrar sesión', 'Cancelar', 'Aceptar', function(){

                    self.active = previous;
                    $scope.signOutSelected =  boolean1;
                    $scope.termsSelected =  boolean2;
                    $scope.animations.isOpenModal = false;
                },
                function () {
                    $scope.onLogout();
                },'positive'
            );
        };

        $scope.blurInput = function (event) {
            if (event.keyCode === 40) {
                event.target.blur();
                self.shouldBeFocus = false;
                self.active = 1;
            }
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
            if(UserInfo.alias === '' || UserInfo.password === '' ||  UserInfo.session === ''){
                console.log("no debería estar nulo se supone");
                return;
            }
            var promiseGetList = ProductService.getList();
            promiseGetList.then(function (response) {
                if (response.data.status === false) {
                    console.log("no debería dar esto",response);
                    return;
                }
                if (typeof response.data.user === "undefined" || typeof response.data.my_list === "undefined") {
                    $state.go("dashboard", {}, {reload: true});
                    return;
                }
                console.log('list', response.data);

                if (response.data.my_list !== undefined) {
                    MyListItems.list = response.data.my_list.map(function (item) {
                        item.inList = true;
                        item.feature_text = item.description;
                        return item;
                    });
                }
                if (MyListItems.list.length > 0) {
                    self.list.push({
                        name: 'Mi Lista',
                        products: MyListItems.list
                    });
                }
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
            self.isShowInfo = true;
        };

        var outAnimation = function () {
            $('.preview-cover').css('right', '-30%');
            self.isShowInfo = false;
        };

        $('.preview-cover').css('right', '-30%');

        keyboardInit = function () {
            var redButtonCallback = function () {
                $state.reload();
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
                        self.active++;
                        var div = $('footer');
                        if ($(div).position()) {
                            $('.scroll-area').scrollTop($(div).position().top - 134);
                        }
                        outAnimation();
                        if ($scope.mail) {
                            $scope.signOutSelected = true;

                        } else {
                            $scope.termsSelected = true;
                        }

                        hotkeys.add({
                            combo: 'right',
                            callback: function () {
                                $scope.termsSelected = true;
                                $scope.signOutSelected = false;
                            }
                        });

                        hotkeys.add({
                            combo: 'left',
                            callback: function () {
                                $scope.termsSelected = false;
                                $scope.signOutSelected = true;
                            }
                        });

                        hotkeys.add({
                            combo: 'enter',
                            callback: function () {
                                if ($scope.termsSelected) {
                                    if(!$scope.animations.isOpenModal){
                                        $scope.showTerms();
                                    }
                                } else {
                                    if(!$scope.animations.isOpenModal){
                                        $scope.logout();
                                    }
                                }
                            }
                        });
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
                    if ($scope.signOutSelected || $scope.termsSelected) {
                        inAnimation();
                        self.active = self.list.length + 1;
                        $scope.signOutSelected = false;
                        $scope.termsSelected = false;
                        return;
                    }
                    if (self.active - 1 < 1) {
                        self.active = 0;
                        self.shouldBeFocus = true;
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
                    console.log(response.data);
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
                    }
                });


            }

            featuredPromise.then(function (response) {
                var featuredArray = response.data.featured;
                //console.log(response);
                for (var i in featuredArray) {
                    self.slides.push({
                        id: featuredArray[i].id,
                        image: featuredArray[i].image_smarttv,
                        text: featuredArray[i].feature_text,
                        rate: (featuredArray[i].rate * 5) / 100,
                        name: featuredArray[i].name,
                        year: featuredArray[i].year
                    });
                }
            });

            categoriesPromise.then(function (response) {
                console.log("listado de categorías", response);
                var list = response.data.categories;
                var promise = {};
                var pos = 0;
                var responseArray = [], totalRequest = 0;

                var promiseFunction = function (pos) {
                    return function (res) {
                        //console.log(res);
                        if (res.data.products && res.data.products.length > 0) {
                            //self.list.push({
                            //	name: list[pos].name,
                            //	products: res.data.products.map(function(item) {
                            //		item.rate = item.rate * 5 / 100;
                            //		return item;
                            //	})
                            //});
                            responseArray.push({
                                name: list[pos].name,
                                products: res.data.products.map(function (item) {
                                    item.rate = item.rate * 5 / 100;
                                    return item;
                                })
                            });

                            if (totalRequest == responseArray.length) {
                                orderContentDashboard(responseArray, 0);
                                orderContentDashboard(responseArray, 0);
                                self.list = responseArray;
                                self.getList();
                                if(typeof $rootScope.selfDashboard !== "undefined"){
                                    $timeout(function(){
                                        self.active = $rootScope.selfDashboard.active;
                                        inAnimation();
                                    },60);
                                }
                            }
                        }
                    };
                };
                for (var i in list) {
                    pos = i;
                    if (list[i].id === '1') {
                        self.getUserRecentlyWatched();
                    } else {
                        totalRequest++;
                        promise = ProductService.getListFromCategoryId(list[i].id);
                        promise.then(promiseFunction(i));
                    }
                }
            });
        };
        init();

        var orderContentDashboard = function (array, position) {
            if (position >= array.length) {
                return;
            }

            var findPosition = function (id) {
                switch (id) {
                    case "336" :{return 0;}
                    case "274" :{return 1;}
                    case "258" :{return 2;}
                    case "252" :{return 3;}
                    case "445" :{return 4;}
                    default : return self.list.length;
                }
            };

            var changePosition = function (currentArray, indexA, indexB) {
                var tmp = currentArray[indexA];
                currentArray[indexA] = currentArray[indexB];
                currentArray[indexB] = tmp;

            };

            var c = array[position];
            var cid = c.products[0].category_id;
            if ( (c.id === "336" && position === 0) ||
                 (c.id === "274" && position === 1) ||
                 (c.id === "258" && position === 2) ||
                 (c.id === "252" && position === 3) ||
                 (c.id === "445" && position === 4) ) {
                orderContentDashboard(array, ++position);
            } else {
                var fPosition = findPosition(cid);
                changePosition(array, fPosition, position);
                orderContentDashboard(array, ++position);
            }
        };

        $scope.$on("updatedSelectItem", function (event, newValue, oldValue) {
            //console.log(newValue);
            self.selectedItem = newValue;
        });
    };


    app.controller('DashboardController', [
        '$scope', 'ProductService', 'UserInfo', 'hotkeys', '$state',
        'PreviewDataService', 'DevInfo', 'UserService', 'AlertDialogService',
        'TermsViewService', 'MyListItems', 'GeneralModalViewService', 'bestWatch',
        '$rootScope','$timeout',
        DashboardController
    ]);

    app.directive('ngValidateLength', function () {
        return {
            link: function (scope, element, attrs) {
                var length = scope.$eval(attrs.ngValidateLength);
                if (length === 0) {
                    $(element[0]).addClass("remove-item-empty");
                }
                if (scope.$last === true) {
                    $(".remove-item-empty").remove();
                }
            }
        };
    });

}(angular.module("caracolplaylgtvapp.dashboard", [
    'ui.router',
    'cfp.hotkeys'
])));