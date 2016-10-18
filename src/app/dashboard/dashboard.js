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

    var DashboardController = function ($scope, ProductService, hotkeys, $state, PreviewDataService, DevInfo,
                                        UserService, AlertDialogService, TermsViewService, MyListItems,
                                        GeneralModalViewService, bestWatch,$rootScope,$timeout,$cookies) {
        var self = this;
        var keyboardInit;

        self.slides = [];
        self.list = [];

        self.totalCategoryResponse=0;

        self.active = 0;
        self.isPreviewActive = false;
        self.isShowInfo = false;

        self.selectedItem = {};
        self.isInSearch = false;

        $scope.mail = $rootScope.isUserLogged?$rootScope.getSessionInfo().mail:null;
        $scope.signOutSelected = false;
        $scope.termsSelected = false;
        $scope.whatIsSelected = false;

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

        $scope.showWhatIs = function(){
            $scope.animations.isOpenModal = true;
            TermsViewService.showWhatIs(function(){
                $scope.animations.isOpenModal = false;
            }, function(){
                $scope.animations.isOpenModal = false;
            }, false);
        };

        $scope.cambiobusqueda = function(){
            
            if ($scope.keywordToSearch !== undefined && $scope.keywordToSearch !== '') {
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
            } 
        };

        $scope.restartConfigKeyboard = {};

        $scope.onLogout = function () {
            var credentials=$rootScope.getLoginCredentials();
            var sessionInfo=$rootScope.getSessionInfo();
            var logoutPromise = UserService.logout(credentials.alias, credentials.password, sessionInfo.session);
            logoutPromise.then(function (response) {

                if (response.data.status) {
                    AlertDialogService.show(
                        'warning',
                        response.data.message,
                        'Aceptar',
                        function () {
                            keyboardInit();
                        }
                    );
                } else {
                    AlertDialogService.show(
                        'warning',
                        "Sesión cerrada exitosamente",
                        'Aceptar',
                        keyboardInit
                    );
                }
                $rootScope.clearAllCacheData();
                $state.reload();
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
                self.list.push({
                    name: 'Ultimos Vistos',
                    products: response.data
                });
                //orderContentDashboard(self.list,self.list.length-1);
            });
        };

        self.getList = function () {
            if (!$rootScope.isUserLogged()){
                return ;
            }
            var promiseGetList = ProductService.getList();
            promiseGetList.then(function (response) {
                if (response.data.status === false) {
                    return;
                }
                if (typeof response.data.user === "undefined" || typeof response.data.my_list === "undefined") {
                    $state.go("dashboard", {}, {reload: true});
                    return;
                }

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
                    //console.log(myFunction);
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

        var getProductsByCategoryPromise = function (responseArray,totalRequest,categoryName) {
            return function (res) {
                self.totalCategoryResponse++;
                if (res.data.products && res.data.products.length > 0) {
                    responseArray.push({
                        name: categoryName,
                        products: res.data.products.map(function (item) {
                            item.rate = item.rate * 5 / 100;
                            return item;
                        })
                    });
                }
                if (totalRequest === self.totalCategoryResponse) {
                    orderContentDashboard(responseArray, 0);
                    //orderContentDashboard(responseArray, 0);
                    self.list=self.list.concat(responseArray);
                    if(typeof $rootScope.selfDashboard !== "undefined"){
                        $timeout(function(){
                            self.active = $rootScope.selfDashboard.active;
                            inAnimation();
                        },60);
                    }
                }
            };
        };

        var init = function () {
            var featuredPromise = ProductService.getFeatured();
            var categoriesPromise = ProductService.getCategories();

            self.slides.length = 0;
            self.list.length = 0;

            var loginCredentialsStr = localStorage.getItem('loginCredentials');

            if (loginCredentialsStr) {
                var loginCredentials = JSON.parse(loginCredentialsStr);
                var authPromise = UserService.authenticateUser(loginCredentials.username, loginCredentials.password);
                authPromise.then(
                    function (response) {
                        $rootScope.saveSessionInfo(response);
                        $scope.mail = $rootScope.isUserLogged()?$rootScope.getSessionInfo().mail:null;
                        self.getUserRecentlyWatched();
                        self.getList();
                    });
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
                        year: featuredArray[i].year
                    });
                }
                //se eliminan los registros adicionales aunque NO estoy de acuerdo con esto
                //esto se debería hacer desde el server y no por aca
                self.slides.splice(8,4);
            });

            categoriesPromise.then(function (response) {
                logs.set("log1", response);
                var tempCategories = response.data.categories;
                var promise = {};
                var responseArray = [], totalRequest = tempCategories.length;
                self.totalCategoryResponse=0;

                //Primero revisamos si las categorias especiales vienen, 1 "Ultimos Vistos" 2 "Mi Lista"
                //estas se cargan solo despues de que el usuario se loguea, se eliminan del totalrequest
                for (var i=0; i<tempCategories.length; i++){
                    if (tempCategories[i].id === '1' || tempCategories[i].id === '2') {
                        totalRequest--;
                    }
                }

                for (i=0; i<tempCategories.length; i++) {
                    if (tempCategories[i].id !== '1' && tempCategories[i].id !== '2') {
                        promise = ProductService.getListFromCategoryId(tempCategories[i].id);
                        promise.then(getProductsByCategoryPromise(responseArray,totalRequest,tempCategories[i].name));
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
            self.selectedItem = newValue;
        });
    };

    app.controller('DashboardController', [
        '$scope', 'ProductService' , 'hotkeys', '$state',
        'PreviewDataService', 'DevInfo', 'UserService', 'AlertDialogService',
        'TermsViewService', 'MyListItems', 'GeneralModalViewService', 'bestWatch',
        '$rootScope','$timeout','$cookies',
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