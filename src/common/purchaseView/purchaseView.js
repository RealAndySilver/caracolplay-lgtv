    (function (app) {
    var ModalInstanceService = function () {
        var self = this;

        self.modalInstance = {};
        self.setModalInstance = function (modalInstance) {
            self.modalInstance = modalInstance;
        };

        self.getModalInstance = function () {
            return self.modalInstance;
        };
    };

    app.service('ModalInstanceService', [ModalInstanceService]);
    app.constant('ModalInstance', {});

    var PurchaseViewController = function ($scope, hotkeys, UserService, PurchaseService,
                                           $modalInstance, typeView, $state, AlertDialogService,
                                           productionId, chapterId, ProgressDialog, TermsViewService,
                                           DevInfo, name, $stateParams, $rootScope, RegisterUserService, $timeout) {
        var itemSelected = 0;
        var model = this;


        var LOGIN_OPTION_INFO = {
            'title': 'Ingresar como usuario',
            'image': 'assets/img/login-logo.png',
            id: 0,
            active: false
        };

        var RENT_OPTION_INFO = {
            'title': 'Alquilar este contenido',
            'image': 'assets/img/rent-logo.png',
            id: 1,
            active: false
        };

        var SUBSCRIPTION_OPTION_INFO = {
            'title': 'Suscribirse a CaracolPlay',
            'image': 'assets/img/subscribe-logo.png',
            id: 2,
            active: false
        };

        var REDEEM_OPTION_INFO= {
            'title': 'Redimir codigo',
            'image': 'assets/img/redeem-logo.png',
            id: 3,
            active: false
        };

        model.isVisibleMainOptionsScreen=true;
        $scope.name = name;

        $scope.loginVisible = false;
        $scope.boughtVisible = false;
        $scope.redeemVisible = false;
        $scope.isSubscription = false;
        $scope.isRent = false;
        $scope.subscribeStep = 0;
        $scope.defaultDocumentTypeIndex = 1;
        $scope.defaultCreditcardIndex = 0;

        /**
         * objeto donde se almacenarala información del objeto response una vez se ha validado
         * un código para redimir
         * @type {Object | null}
         */
            //$rootScope.objectRedeem;

        $scope.loginData = {};

        $scope.days_month = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
            11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
            21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
            31
        ];

        $scope.months = [
            {name: 'Enero', value: '01', id: 0},
            {name: 'Febrero', value: '02', id: 1},
            {name: 'Marzo', value: '03', id: 2},
            {name: 'Abril', value: '04', id: 3},
            {name: 'Mayo', value: '05', id: 4},
            {name: 'Junio', value: '06', id: 5},
            {name: 'Julio', value: '07', id: 6},
            {name: 'Agosto', value: '08', id: 7},
            {name: 'Septiembre', value: '09', id: 8},
            {name: 'Octubre', value: '10', id: 9},
            {name: 'Noviembre', value: '11', id: 10},
            {name: 'Diciembre', value: '12', id: 11}
        ];

        $scope.years = [
            {name: '2014', value: '14', id: 0},
            {name: '2015', value: '15', id: 1},
            {name: '2016', value: '16', id: 2},
            {name: '2017', value: '17', id: 3},
            {name: '2018', value: '18', id: 4},
            {name: '2019', value: '19', id: 5},
            {name: '2020', value: '20', id: 6},
            {name: '2021', value: '21', id: 7},
            {name: '2022', value: '22', id: 8}
        ];

        $scope.years_birth = [
            1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969,
            1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979,
            1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989,
            1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999,
            2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009,
            2010, 2011, 2012, 2013, 2014, 2015
        ];

        $scope.getMail = function () {
            return $rootScope.getSessionInfo().email;
        };

        $scope.$on("$stateChangeStart", function (event, toState,toParams,fromState,fromParams) {
            if(fromState.name === "purchase"){
                var objSaved = {};
                objSaved.susbscription = $scope.subscription;
                $rootScope.scopePurchase = objSaved;
            }
        });

        var clearSaved = function(){
            delete $rootScope.scopePurchase;
        };

        $scope.parcels = [];

        $scope.subscribeParcels = [{name: '1 x $58.000'}];
        $scope.genders = [{name: 'Masculino', acronym: 'M'}, {name: 'Femenino', acronym: 'F'}];
        $scope.rentParcels = [{name: '1 x $34.800'}];
        $scope.creditcards = [{type: 'VISA', id: 1}, {type: 'Mastercard', id: 2},{type:'Amex',id:3}];
        $scope.documentTypes = [
            {type: 'Tarjeta de Identidad', acronym: 'CC', id: 1},
            {type: 'Cedula de ciudadania', acronym: 'TI', id: 2},
            {type: 'Cedula de extranjeria', acronym: 'CE', id: 3},
            {type: 'NIT', acronym: 'NIT', id: 4},
            {type: 'Pasaporte', acronym: 'PPN', id: 5},
            {type: 'Registro civil', acronym: 'RC', id: 6},
            {type: 'Número de Seguridad Social', acronym: 'SSN', id: 7},
            {type: 'Licencia conducción', acronym: 'LIC', id: 8},
            {type: 'Identificación impositiva', acronym: 'TAX', id: 9}
        ];


        $scope.showTerms = function () {
            TermsViewService.showTerms(function () {
                $scope.subscription.terms = true;
                configHotkeys();
            }, function () {
                $scope.subscription.terms = false;
                configHotkeys();
            }, true);
        };

        $scope.showHabeasData = function () {
            TermsViewService.showHabeasData(function () {
                $scope.subscription.politics = true;
                configHotkeys();
            }, function () {
                $scope.subscription.politics = false;
                configHotkeys();
            }, true);
        };

        $scope.showVideoRequeriments = function () {
            TermsViewService.showVideoRequeriments(function () {
                $scope.subscription.requirements = true;
                configHotkeys();
            }, function () {
                $scope.subscription.requirements = false;
                configHotkeys();
            }, true);
        };

        $scope.playVideo = function () {
            //ProgressDialogService.start();
            var promiseIsContentAvaliable = UserService.isContentAvailableForUser($scope.getChapterId());

            promiseIsContentAvaliable.then(function (response) {
                console.log("isContentAvailable: ->:", response);
                console.log("response.data.video.status:", response.data.video.status);
                //ProgressDialogService.dismiss();
                if (response.data.status) {
                    if (response.data.video.status) {
                        $state.go('videoModule', {
                            chapterId: $scope.getChapterId(),
                            productionId: $scope.selected.id
                        });
                    } else {
                        AlertDialogService.show(
                            'alert',
                            response.data.video.message,
                            'Aceptar',
                            configHotkeys
                        );
                        $timeout(function () {
                            $state.go('dashboard');
                        }, 1000);
                        return;
                    }

                } else {
                    $state.reload();
                }
            });
        };

        $scope.documentType = $scope.documentTypes[$scope.defaultDocumentTypeIndex];
        $scope.isStepActive = function (item) {
            if (item <= $scope.subscribeStep) {
                return true;
            }
            return false;
        };

        $scope.menu = {
            title: 'Reproducir contenido',
            description: 'Para reproducir este contenido puedes usar una de las siguientes opciones',
            support: 'Si tienes problemas para ver este contenido contáctanos a soporte@caracolplay.com'
        };

        $scope.login = {
            title: 'Ingresar a la cuenta',
            description: 'Ingresa los datos si ya tienes un nombre de usuario y una contraseña ' +
            'en CaracolPlay o en nuestra red de portales',
            support: 'Si tienes problemas para ver este contenido contáctanos a soporte@caracolplay.com'
        };

        $scope.register = {
            title: 'Suscríbase por $58.000 el año',
            description: '',
            support: 'Si tienes problemas para ver este contenido contáctanos a soporte@caracolplay.com'
        };

        $scope.rent = {
            title: 'Alquiler por $34.800',
            description: '',
            support: 'Si tienes problemas para ver este contenido contáctanos a soporte@caracolplay.com'
        };

        $scope.redeem = {
            title: 'Redimir código',
            description: 'Si tienes un código hazlo efectivo aquí y empieza a disfrutar del contenido que tenemos para ti',
            //description: 'Ingresa el codigo para disfrutar el contenido',
            support: 'Si tienes problemas para ver este contenido contáctanos a soporte@caracolplay.com'
        };

        $scope.title = $scope.login.title;
        $scope.description = $scope.login.description;
        $scope.support = $scope.login.support;
        $scope.active = '';

        $scope.needFocus = function (field) {
            return $scope.active === field;
        };

        $scope.onSides = function (side) {
            switch (side) {
                case 'up':
                    if ($scope.active === 'city') {
                        break;
                    } else if ($scope.activeNumber - 1 >= 0) {
                        $scope.activeNumber--;
                    }
                    break;
                case 'down':
                    if ($scope.active === 'city') {
                        break;
                    } else if ($scope.activeNumber + 1 < $scope.activeQueue.length) {
                        $scope.activeNumber++;
                    }
                    break;
                case 'left':
                    if ($scope.active === 'next') {
                        $scope.activeNumber = $scope.loginQueue.indexOf('back');
                    } else if ($scope.activeNumber - 1 >= 0) {
                        $scope.activeNumber--;
                    }
                    break;
                case 'right':
                    if ($scope.active === 'back') {
                        $scope.activeNumber = $scope.loginQueue.indexOf('next');
                    } else if ($scope.activeNumber + 1 < $scope.activeQueue.length) {
                        $scope.activeNumber++;
                    }
                    break;
            }
            $scope.active = $scope.activeQueue[$scope.activeNumber];
        };

        $scope.loginQueue = [
            'username',
            'password',
            'next',
            'back',
        ];

        $scope.rentQueue = [
            'email',
            'user',
            'password',
            'confirmPassword',
            'terms',
            'politics',
            'requirements',
            'information',
            'backSuscription',
            'nextSubscription'
        ];

        $scope.rentQueueStep2 = [
            'name',
            'lastname',
            'documentType',
            'documentNumber',
            'city',
            'address',
            'gender',
            'birth_day',
            'birth_month',
            'birth_year',
            'phone',
            'backSuscription',
            'nextSubscription'
        ];

        $scope.rentQueueStep3 = [
            'creditcard',
            'creditNumber',
            'month',
            'year',
            'securityCode',
            'parcel',
            'renewal',
            'backSuscription',
            'nextSubscription'
        ];

        $scope.subscriptionQueueStep3 = [
            'creditcard',
            'creditNumber',
            'month',
            'year',
            'securityCode',
            'parcel',
            'renewal',
            'backSuscription',
            'nextSubscription'
        ];

        $scope.disableKeyEnter = false;

        $scope.activeNumber = 0;
        $scope.stateSelect = 'close';

        $scope.activeQueue = [];

        $scope.next = function () {
            $scope.disableKeyEnter = true;
            switch ($scope.active) {
                case 'next':
                    $scope.onLogin();
                    break;
                case 'nextSubscription':
                    $scope.onNext();
                    break;
                case 'back':
                    $scope.onBack();
                    break;
                case 'backSuscription':
                    $scope.onBackSuscription();
                    break;
                case 'terms':
                case 'politics':
                case 'requirements':
                case 'information':
                case 'renewal':
                    $scope.subscription[$scope.active] = !$scope.subscription[$scope.active];
                    break;
                case 'documentType':
                case 'gender':
                case 'birth_day':
                case 'birth_month':
                case 'birth_year':
                case 'creditcard':
                case 'year':
                case 'month':
                case 'parcel':
                    break;
                default:
                    $scope.active = $scope.activeQueue[++$scope.activeNumber];
                    break;
            }
        };

        var configHotkeys = function () {
            hotkeys.add({
                combo: 'up',
                callback: function () {

                }
            });

            hotkeys.add({
                combo: 'down',
                callback: function () {

                }
            });

            hotkeys.add({
                combo: 'right',
                callback: function () {
                    if (itemSelected + 1 >= model.optionsAvailable.length) {
                        return;
                    }

                    model.optionsAvailable[itemSelected++].active = false;
                    model.optionsAvailable[itemSelected].active = true;
                }
            });

            var redButtonCallback = function () {
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

            hotkeys.add({
                combo: 'left',
                callback: function () {
                    if (itemSelected - 1 < 0) {
                        return;
                    }
                    console.log('el item seleccionado es',itemSelected);
                    model.optionsAvailable[itemSelected--].active = false;
                    model.optionsAvailable[itemSelected].active = true;
                }
            });

            hotkeys.add({
                combo: 'enter',
                callback: function () {
                    if ($scope.disableKeyEnter) {
                        $scope.disableKeyEnter = false;
                        return;
                    }
                    switch (model.optionsAvailable[itemSelected].id) {
                        case 0:
                            $scope.activeQueue = $scope.loginQueue;
                            $scope.active = $scope.activeQueue[0];
                            $scope.activeNumber = 0;

                            model.isVisibleMainOptionsScreen = false;
                            $scope.loginVisible = true;
                            $scope.redeemVisible = false;
                            break;
                        case 1:
                            $scope.activeQueue = $scope.rentQueue;
                            $scope.active = $scope.activeQueue[0];
                            $scope.activeNumber = 0;

                            if ($rootScope.getSessionInfo().alias) {
                                $scope.subscribeStep = 1;
                                $scope.subscription.name = $rootScope.getSessionInfo().name;
                                $scope.subscription.lastname = $rootScope.getSessionInfo().lastname;
                                $scope.activeQueue = $scope.rentQueueStep2;
                                $scope.active = $scope.activeQueue[0];
                                $scope.activeNumber = 0;
                            } else {
                                $scope.subscribeStep = 1; // solo para pruebas
                                $scope.subscribeStep = 0;
                            }
                            console.log("caso 1", $scope.subscribeStep);
                            $scope.isSubscription = false;
                            $scope.isRent = true;
                            model.isVisibleMainOptionsScreen  = false;
                            $scope.boughtVisible = true;
                            $scope.redeemVisible = false;
                            break;
                        case 2:
                            model.isVisibleMainOptionsScreen = false;
                            $scope.isRent = false;
                            $scope.isSubscription = true;
                            $scope.redeemVisible = false;
                            $scope.boughtVisible = true;

                            $scope.activeQueue = $scope.rentQueue;
                            $scope.active = $scope.activeQueue[0];
                            $scope.activeNumber = 0;

                            console.log($scope.activeQueue,'::::::::');
                            $scope.$watch('activeNumber',function(newVal){
                                console.log('este es el new value: %s',newVal);
                            });

                            if ($rootScope.getSessionInfo().alias) {
                                $scope.subscribeStep = 1;
                            } else {
                                $scope.subscribeStep = 1; //solo para pruebas
                                $scope.subscribeStep = 0;
                            }

                            console.log("caso 2", $scope.subscribeStep);
                            /*
                            $scope.showOptions = false;
                            $scope.isRent = false;
                            $scope.isSubscription = true;
                            $scope.boughtVisible = true;
                            $scope.redeemVisible = false;
                            */
                            break;
                        case 3:
                            console.log("caso 3");
                            model.isVisibleMainOptionsScreen  = false;
                            $scope.isRent = false;
                            $scope.isSubscription = false;
                            $scope.boughtVisible = false;
                            $scope.redeemVisible = true;
                            break;
                    }
                }
            });

            $scope.active = $scope.activeQueue[0];
            $scope.activeNumber = 0;
        };

        $scope.onRedeem = function () {
            // check if user is login
            if (!$scope.redeemCode) {
                AlertDialogService.show(
                    'alert',
                    'El codigo para redimir no puede estar vacio',
                    'Aceptar',
                    configHotkeys
                );
                return;
            }
            console.log("$scope.redeemCode :" + 500, $scope.redeemCode);
            var redeemPromise = PurchaseService.validateCode($scope.redeemCode);

            redeemPromise.then(function (response) {
                console.log(response);

                if (response.data.status) {
                    if (response.data.info_code) {
                        if (response.data.info_code.type) {
                            if (response.data.info_code.type === 'ev') {
                                $scope.playVideo();
                            }
                        } else {
                            model.isVisibleMainOptionsScreen  = true;
                            $scope.isRent = false;
                            $scope.isSubscription = false;
                            $scope.boughtVisible = false;
                            $scope.redeemVisible = false;

                            $rootScope.objectRedeem = response;
                            $state.go('purchase', {
                                    typeView: 4,
                                    chapterId: $stateParams.productionId,
                                    productionId: $stateParams.chapterId,
                                    name: $stateParams.name
                                }
                            );
                            //model.optionsAvailable.length = 2;
                        }
                    }
                } else {
                    AlertDialogService.show(
                        'alert',
                        response.data.response,
                        'Aceptar',
                        configHotkeys
                    );
                }
            });
        };

        $scope.subscription = {
            email: '', user: '', password: '',
            confirmPassword: '', name: '', lastname: '', city: '',
            documentType: $scope.documentTypes[$scope.defaultDocumentTypeIndex],
            documentNumber: '',
            creditcard: $scope.creditcards[$scope.defaultCreditcardIndex],
            creditNumber: '', parcel: $scope.parcels[0], securityCode: '',
            gender: '', birth_day: '', birth_month: '', birth_year: ''
        };
        $scope.subscription.gender = $scope.genders[0];


        $scope.cities = [];
        $scope.citiesStrings = [];

        $scope.testLength = function () {
            console.log($scope.objectRedeem);
        };

        $scope.getCities = function (val) {
            return PurchaseService.searchCityFlow(val).then(function (response) {
                $scope.cities = response.data;
                $scope.citiesStrings = $scope.cities.map(function (item) {
                    return item.name;
                });
                return $scope.citiesStrings;
            });
        };

        $scope.validateStepOne = function () {
            if ($scope.subscription.email === '') {
                AlertDialogService.show(
                    'warning',
                    'El campo de email no puede estar vacio',
                    'Aceptar',
                    configHotkeys
                );
                return false;
            }

            if ($scope.subscription.user === '') {
                AlertDialogService.show(
                    'alert',
                    'El campo de usuario no puede estar vacio',
                    'Aceptar',
                    configHotkeys
                );
                return false;
            }

            if ($scope.subscription.password === '') {
                AlertDialogService.show(
                    'alert',
                    'El campo de contraseña no puede estar vacio',
                    'Aceptar',
                    configHotkeys
                );
                return false;
            }

            if ($scope.subscription.confirmPassword === '') {
                AlertDialogService.show(
                    'alert',
                    'El campo de confirmar no puede estar vacio',
                    'Aceptar',
                    configHotkeys
                );
                return false;
            }

            if ($scope.subscription.password !== $scope.subscription.confirmPassword) {
                AlertDialogService.show(
                    'alert',
                    'Las contraseñas no coiciden',
                    'Aceptar',
                    configHotkeys
                );
                return false;
            }

            if (!$scope.subscription.terms) {
                AlertDialogService.show(
                    'alert',
                    'Debes aceptar los términos y condiciones',
                    'Aceptar',
                    configHotkeys
                );
                return false;
            }

            if (!$scope.subscription.politics) {
                AlertDialogService.show(
                    'alert',
                    'Debes aceptar los politicas de privacidad',
                    'Aceptar',
                    configHotkeys
                );
                return false;
            }

            if (!$scope.subscription.requirements) {
                AlertDialogService.show(
                    'alert',
                    'Debes aceptar los requerimientos para reproducir video',
                    'Aceptar',
                    configHotkeys
                );
                return false;
            }

            return true;
        };

        $scope.validateStepTwo = function () {
            if (!$scope.subscription.name) {
                AlertDialogService.show(
                    'alert',
                    'El campo de nombres no puede estar vacio',
                    'Aceptar',
                    configHotkeys
                );
                return false;
            }

            if (!$scope.subscription.lastname) {
                AlertDialogService.show(
                    'alert',
                    'El campo de apellidos no puede estar vacio',
                    'Aceptar',
                    configHotkeys
                );
                return false;
            }

            if (!$scope.subscription.city) {
                AlertDialogService.show(
                    'alert',
                    'El campo de ciudad no puede estar vacio',
                    'Aceptar',
                    configHotkeys
                );
                return false;
            }

            var positionSelectedCity = $scope.citiesStrings.indexOf($scope.subscription.city);
            if(positionSelectedCity === -1 ){
                $scope.subscription.city = '';
                AlertDialogService.show(
                    'alert',
                    'Debe seleccionar la ciudad de nuevo, asegurese de seleccionar una de las opciones del autocompletado',
                    'Aceptar',
                    configHotkeys
                );
                return false;
            }

            if (!$scope.subscription.documentType) {
                AlertDialogService.show(
                    'alert',
                    'El campo de tipo de documento no puede estar vacio',
                    'Aceptar',
                    configHotkeys
                );
                return false;
            }

            if (!$scope.subscription.documentNumber) {
                AlertDialogService.show(
                    'alert',
                    'El campo de numero de documento no puede estar vacio',
                    'Aceptar',
                    configHotkeys
                );
                return false;
            }
            return true;
        };

        $scope.validateStepThree = function () {
            if (!$scope.subscription.creditcard) {
                AlertDialogService.show(
                    'alert',
                    'El campo de tipo de tarjeta de credito no puede estar vacio',
                    'Aceptar',
                    configHotkeys
                );
                return false;
            }

            if (!$scope.subscription.creditNumber) {
                AlertDialogService.show(
                    'alert',
                    'El campo de numero de tarjeta de credito no puede estar vacio',
                    'Aceptar',
                    configHotkeys
                );
                return false;
            }

            if (!$scope.subscription.month) {
                AlertDialogService.show(
                    'alert',
                    'El campo de mes de expiracion no puede estar vacio',
                    'Aceptar',
                    configHotkeys
                );
                return false;
            }

            if (!$scope.subscription.year) {
                AlertDialogService.show(
                    'alert',
                    'El campo de año de expiracion no puede estar vacio',
                    'Aceptar',
                    configHotkeys
                );
                return false;
            }

            if (!$scope.subscription.securityCode) {
                AlertDialogService.show(
                    'alert',
                    'El campo de codigo de seguridad no puede estar vacio',
                    'Aceptar',
                    configHotkeys
                );
                return false;
            }

            if (!$scope.subscription.parcel) {
                AlertDialogService.show(
                    'alert',
                    'El campo de parcel no puede estar vacio',
                    'Aceptar',
                    configHotkeys
                );
                return false;
            }
            return true;
        };

        $scope.onNext = function () {
            switch ($scope.subscribeStep) {
                case 0:
                    if (!$scope.validateStepOne()) {
                        break;
                    }
                    $scope.subscribeStep++;
                    $scope.activeQueue = $scope.rentQueueStep2;
                    $scope.active = $scope.activeQueue[0];
                    $scope.activeNumber = 0;
                    break;
                case 1:

                    if (!$scope.validateStepTwo()) {
                        break;
                    }

                    if ($stateParams.typeView === "4") {
                        registerUserRedeem();
                        return;
                    }

                    if($rootScope.getSessionInfo().alias){
                        $scope.activeQueue = $scope.rentQueueStep2;
                        $scope.subscribeStep++;

                        if ($scope.isRent) {
                            $scope.activeQueue = $scope.rentQueueStep2;
                            console.log("entro por aca 1");
                        } else {
                            $scope.activeQueue = $scope.subscriptionQueueStep3;
                            console.log("entro por aca 2");
                        }
                        $scope.active = $scope.activeQueue[0];

                        $scope.activeNumber = 0;
                        //ProgressDialog.dismiss();
                        return;
                    }

                    //ProgressDialog.start();
                    var createUserPromise = PurchaseService.createUser(
                        $scope.subscription.user,
                        $scope.subscription.password,
                        $scope.subscription.email,
                        $scope.subscription.name,
                        $scope.subscription.lastname,
                        $scope.subscription.politics,
                        $scope.subscription.terms,
                        $scope.subscription.information
                    );

                    var successCallbackCreateUser = function (response) {
                        console.log("response create user", response);

                        if (response.data.form_errors && response.data.form_errors.length > 0) {
                            failureCallbackCreateUser(response);
                            return;
                        }
                        RegisterUserService.saveUserInfo(
                            $scope.subscription.user,
                            $scope.subscription.password,
                            $scope.subscription.email,
                            response.data.uid,
                            $scope.subscription.name,
                            $scope.subscription.lastname
                        );
                        $scope.activeQueue = $scope.rentQueueStep3;
                        $scope.active = $scope.activeQueue[0];
                        $scope.activeNumber = 0;
                        //ProgressDialog.dismiss();
                    };

                    var failureCallbackCreateUser = function (response) {
                        console.log('error', response);
                        //ProgressDialog.dismiss();

                        AlertDialogService.show(
                            'alert',
                            response.data.form_errors[0],
                            'Aceptar',
                            function () {
                                configHotkeys();
                            }
                        );
                        $scope.subscribeStep = 0;
                    };

                    /********************************
                     * Paso 1 creación de usuario   *
                     * ******************************/
                    createUserPromise.then(successCallbackCreateUser, failureCallbackCreateUser);

                    var position = $scope.citiesStrings.indexOf($scope.subscription.city);

                    $scope.subscribeStep++;

                    if ($scope.isRent) {
                        $scope.activeQueue = $scope.rentQueueStep2;
                        console.log("entro por aca 1");
                    } else {
                        $scope.activeQueue = $scope.subscriptionQueueStep3;
                        console.log("entro por aca 2");
                    }
                    $scope.active = $scope.activeQueue[0];
                    $scope.activeNumber = 0;

                    break;

                case 2:
                    if (!$scope.validateStepThree()) {
                        break;
                    }

                    //ProgressDialog.start();
                    var successCallbackExecuteTransaction = function (response) {
                        console.log("resultado de crear orden", response);
                        //ProgressDialog.dismiss();
                        if (response.data.status === 'Aprobada') {
                            AlertDialogService.show(
                                'alert',
                                response.data.user + ': ' + response.data.result,
                                'Aceptar',
                                function () {
                                    configHotkeys();
                                    $state.go('videoModule', {
                                        'chapterId': chapterId,
                                        'productionId': productionId
                                    });
                                });
                        } else {
                            AlertDialogService.show(
                                'alert',
                                response.data.msg,
                                'Aceptar',
                                configHotkeys
                            );
                        }
                    };

                    var failureCallback = function (response) {
                        //ProgressDialog.dismiss();
                        console.log(response);
                        if(!response.data){
                            AlertDialogService.show(
                                'alert',
                                'En estos momentos no se pudo realizar la operacion. Inténtalo más tarde.',
                                'Aceptar',
                                configHotkeys
                            );
                            return;
                        }
                        AlertDialogService.show(
                            'alert',
                            response.data[0],
                            'Aceptar',
                            configHotkeys
                        );
                    };

                    var successCallbackCreateOrder = function (response) {
                        console.log(response);
                        if(response.data.length === 0){
                            AlertDialogService.show(
                                'alert',
                                'En estos momentos no se pudo realizar la operacion. Inténtalo más tarde.',
                                'Aceptar',
                                configHotkeys
                            );
                            //ProgressDialog  .dismiss();
                            return;
                        }
                        console.log("successCallbackCreateOrder", response);
                        var order = response.data;

                        var positionSelectedCity = $scope.citiesStrings.indexOf($scope.subscription.city);
                        console.log($scope.citiesStrings);
                        var transactionInfo = {
                            'order_id': order.order_id,
                            'card_info': {
                                'status': 'no',
                                'franchise': $scope.subscription.creditcard.type
                            },
                            'payment': {
                                'num_card': $scope.subscription.creditNumber,
                                'security_number': $scope.subscription.securityCode,
                                'expires_date': $scope.subscription.month.value + $scope.subscription.year.value
                            },
                            'customer': {
                                'document_type': $scope.subscription.documentType.acronym,
                                'document': $scope.subscription.documentNumber,
                                'lastname': $scope.subscription.lastname,
                                'name': $scope.subscription.name,
                                'phone': $scope.subscription.phone,
                                'address': $scope.subscription.address,
                                'renovation': '1',
                                'city': $scope.cities[positionSelectedCity].id
                            }
                        };
                        console.log(transactionInfo);
                        var promiseExecute = PurchaseService.executeTransactionWithCardFlow(transactionInfo);

                        promiseExecute.then(successCallbackExecuteTransaction, failureCallback);
                    };

                    var successCallbackLogin = function (response) {
                        console.log("succesCallbackLogin", response);
                        if (response.data.user !== null) {
                            $rootScope.saveSessionInfo(response,$scope.subscription.password);
                        }
                        var promiseCreateOrder;
                        if ($scope.isRent) {
                            console.log(chapterId);
                            promiseCreateOrder = PurchaseService.createRentOrderFlow(chapterId);
                        } else {
                            promiseCreateOrder = PurchaseService.createSubscriptionOrderFlow();
                        }
                        promiseCreateOrder.then(successCallbackCreateOrder, failureCallback);
                    };

                    var promiseLogin = UserService.authenticateUser($rootScope.getSessionInfo().alias, $rootScope.getSessionInfo().password);
                    promiseLogin.then(successCallbackLogin, failureCallback);
                    break;
            }
        };


        $scope.onBackSuscription = function () {
            if ($scope.subscribeStep - 1 >= 0) {
                $scope.subscribeStep--;

                if ($rootScope.getSessionInfo().alias && $scope.subscribeStep === 0) {
                    $scope.onBack();
                    return;
                }

                switch ($scope.subscribeStep) {
                    case 0:
                        $scope.activeQueue = $scope.rentQueue;
                        $scope.active = $scope.activeQueue[0];
                        $scope.activeNumber = 0;
                        break;
                    case 1:
                        $scope.activeQueue = $scope.rentQueueStep2;
                        $scope.active = $scope.activeQueue[0];
                        $scope.activeNumber = 0;
                        break;
                }
                return;
            }
            $scope.onBack();
        };

        $scope.onBack = function () {
            $scope.loginVisible = false;
            $scope.boughtVisible = false;
            $scope.redeemVisible = false;
            model.isVisibleMainOptionsScreen  = true;
            configHotkeys();
        };

        var registerUserRedeem = function () {
            var month = ($scope.subscription.birth_month !== '') ? $scope.subscription.birth_month.id : "null";
            var year =  ($scope.subscription.birth_year !== '' ) ? $scope.subscription.birth_year : "null";
            var validateDate = new Date( year, month, $scope.subscription.birth_day);
            console.log("validateDate :1047:", validateDate);

            if(isNaN( validateDate.getTime() )){
                AlertDialogService.show('alert','Debe seleccionar una fecha valida','Aceptar',
                    function () {
                        configHotkeys();
                    }
                );
                return;
            }
            var gender = ($scope.subscription.gender !== '') ? $scope.subscription.gender.name :null;
            if(gender === null){
                AlertDialogService.show('alert','Debe seleccionar el genero','Aceptar',
                    function () {
                        configHotkeys();
                    }
                );
                return;
            }

            var createUserPromise = PurchaseService.createUser(
                $scope.subscription.user,
                $scope.subscription.password,
                $scope.subscription.email,
                $scope.subscription.name,
                $scope.subscription.lastname,
                $scope.subscription.politics,
                $scope.subscription.terms,
                $scope.subscription.information
            );

            createUserPromise.then(function (response) {
                if (response.data.form_errors && response.data.form_errors.length > 0) {
                    AlertDialogService.show(
                        'alert',
                        response.data.form_errors[0],
                        'Aceptar',
                        function () {
                            configHotkeys();
                        }
                    );
                    return;
                }
                RegisterUserService.saveUserInfo(
                    $scope.subscription.user,
                    $scope.subscription.password,
                    $scope.subscription.email,
                    response.data.uid,
                    $scope.subscription.name,
                    $scope.subscription.lastname,
                    validateDate.getTime(),
                    gender
                );

                requestRedeemCode();
                //ProgressDialog.dismiss();
            }, function (error) {
                console.log('error', response);
                //ProgressDialog.dismiss();

                AlertDialogService.show(
                    'alert',
                    response.data.form_errors[0],
                    'Aceptar',
                    function () {
                        configHotkeys();
                    }
                );
                $scope.subscribeStep = 0;
            });
        };

        

        /**
         * función encargada de realizar la solicitud al servidor de redimir un código
         * una vez ha iniciado sesión el usuario
         */
        var requestRedeemCode = function () {
            console.log($rootScope.objectRedeem);
            if ($rootScope.objectRedeem != null) {
                //ProgressDialog.start();

                var infoCode = $rootScope.objectRedeem.data.info_code[0];
                var code = (infoCode.promo !== undefined) ? infoCode.promo : infoCode.codigo;

                var promise = PurchaseService.redeemCode(code, {
                    name: UserInfo.name, lastname: UserInfo.lastname, alias: UserInfo.alias,
                    email: UserInfo.mail, password: UserInfo.password, genero: UserInfo.gender,
                    fecha_de_nacimiento: UserInfo.birthDate
                });

                promise.then(function (response) {
                    console.log(response);

                    //ProgressDialog.dismiss();
                    if (response.data.code !== undefined && response.data.code != null) {
                        AlertDialogService.show(
                            'alert',
                            response.data.code.msg,
                            'Aceptar',
                            function(){
                                configHotkeys();
                                $state.go('dashboard');
                            }
                        );

                        if(response.data.session){
                            UserInfo.session = response.data.session;
                            UserInfo.uid = response.data.uid;
                        }
                    }

                }, function (error) {
                    console.log(error);
                    //ProgressDialog.dismiss();
                    $state.go('dashboard');
                    AlertDialogService.show(
                        'alert',
                        "Se produjo un error al redimir el código",
                        'Aceptar',
                        configHotkeys
                    );
                });
            }
        };

        /**
         * función encargada de retornar el callback que se ejecutara en caso que el login del usuario
         * sea realizado correctamente
         * @returns {Function}
         */
        var getCallbackLoginForView = function () {
            if ($stateParams.typeView == 4) {
                console.log("$stateParams.typeView :1204", $stateParams.typeView);
                return requestRedeemCode;
            }
            return function () {

            };
        };
        
        $scope.onLogin = function () {
            var promiseLogin = UserService.authenticateUser($scope.loginData.username, $scope.loginData.password);
            console.log("AUTENTICANDO ",$scope.loginData.username," ",$scope.loginData.password);
            promiseLogin.then(function (response) {
                console.log('login', response.data);
                if (response.data.status){
                    ////ProgressDialog.dismiss();
                    $rootScope.saveSessionInfo(response,$scope.loginData.password);
                    localStorage.setItem('loginCredentials',JSON.stringify($scope.loginData));
                    console.log('productId: ', productionId, 'chapterId', chapterId, " stateParam ",$stateParams.typeView);
                    if ($stateParams.typeView !== "4") {
                        if (response.data.user !== undefined) {
                            UserService.validatePlayerVideo(chapterId, productionId, configHotkeys, function(response){
                                if (response.data.video.status) {
                                    $state.go('videoModule', {
                                        chapterId: chapterId,
                                        productionId: productionId
                                    });
                                }else{
                                    console.log("POR EL BAD BUENO");
                                    AlertDialogService.show(
                                        'alert',
                                        response.data.video.message,
                                        'Aceptar',
                                        $state.reload
                                    );
                                }
                            }, function (response) {
                                console.log("POR EL BAD");
                                AlertDialogService.show(
                                    'alert',
                                    response.data.message,
                                    'Aceptar',
                                    $state.reload
                                );
                                //$state.reload();
                                //window.location = window.location.pathname;
                            });
                        }
                    }else{
                        requestRedeemCode();
                    }
                }else{
                    AlertDialogService.show(
                        'alert',
                        response.data.response,
                        'Aceptar',
                        configHotkeys
                    );
                }
            }, function (error) {
                console.log('login', error.data);
                ////ProgressDialog.dismiss();
                AlertDialogService.show(
                    'alert',
                    error.data[0],
                    'Aceptar',
                    configHotkeys
                );
            });
        };

        var setEssentialData = function (object) {
            $scope.title = object.title;
            $scope.description = object.description;
            $scope.support = object.support;
        };


        /**
         * Este metodo determina con base en el usuario y en el tipo de produccion las opciones
         * que estan disponibles para el usuario.
         * */
        model.getAvailableOptionsByView=function(pTypeView){
            console.log("Este es el pTypeView ",pTypeView);
            var tempOptions=[];
            //Si el usuario no esta logueado se agrega la opcion de LOGIN
            if (!$rootScope.isUserLogged()) {
                tempOptions.push(LOGIN_OPTION_INFO);
            }
            if ($rootScope.isUserLogged() && !$rootScope.getSessionInfo().isSubscription && (pTypeView==2 || pTypeView==3 || pTypeView==4)){
                tempOptions.push(SUBSCRIPTION_OPTION_INFO);
            }

            switch (pTypeView) {
                case 1:
                case 3:
                case 5:
                    tempOptions.push(RENT_OPTION_INFO);
                    tempOptions.push(REDEEM_OPTION_INFO);
                    break;
                case 2:
                    tempOptions.push(REDEEM_OPTION_INFO);
                    break;
                default:
                    break;
            }
            itemSelected=0;
            tempOptions[itemSelected].active=true;
            return tempOptions;
        };

        var init = function () {
            configHotkeys();

            model.optionsAvailable=model.getAvailableOptionsByView(typeView);

            $scope.expireDate = new Date();
            $scope.expireDate.setFullYear($scope.expireDate.getFullYear() + 1);

            $scope.$watch('loginVisible', function (newValue, oldValue) {
                if (newValue) {
                    setEssentialData($scope.login);
                }
            });

            $scope.$watch('model.isVisibleMainOptionsScreen', function (newValue, oldValue) {
                if (newValue) {
                    configHotkeys();
                    var sessionInfo = $rootScope.getSessionInfo();
                    model.optionsAvailable = model.getAvailableOptionsByView(typeView);

                    if (itemSelected < model.optionsAvailable.length) {
                        model.optionsAvailable[itemSelected].active = false;
                    }
                    itemSelected = 0;
                    model.optionsAvailable[itemSelected].active = true;
                    setEssentialData($scope.menu);
                }
            });

            $scope.$watch('redeemVisible', function (newValue, oldValue) {
                if (newValue) {
                    setEssentialData($scope.redeem);
                }
            });

            $scope.$watch('boughtVisible', function (newValue, oldValue) {
                if (newValue) {
                    if ($scope.isSubscription) {
                        setEssentialData($scope.register);
                        $scope.parcels = $scope.subscribeParcels;
                    } else {
                        setEssentialData($scope.rent);
                        $scope.parcels = $scope.rentParcels;
                    }
                    $scope.subscription.parcel = $scope.parcels[0];
                }
            });
            
            if($rootScope.scopePurchase && $rootScope.scopePurchase.susbscription){
                $scope.subscription = $rootScope.scopePurchase.susbscription;
                clearSaved();
            }
        };

        init();

        this.funciona=function(){
            console.log("ESTA MI");
            return "Esta mierda funciona";
        };

    };

    var DialogPurchaseController = function ($scope, $modal, $stateParams, $state) {
        var typeView = $stateParams.typeView;
        var productionId = $stateParams.productionId;
        var chapterId = $stateParams.chapterId;
        var name = $stateParams.name;

        var modalInstance = $modal.open({
            templateUrl: 'purchaseView/purchaseView.tpl.html',
            controller: 'PurchaseViewController as model',
            size: 'lg',
            resolve: {
                name: function () {
                    return name;
                },
                typeView: function () {
                    return parseInt(typeView);
                },
                productionId: function () {
                    return productionId;
                },
                chapterId: function () {
                    return chapterId;
                }
            }
        });

        $scope.$on('$stateChangeStart', function (event, newUrl, oldUrl) {
            if (modalInstance) {
                modalInstance.dismiss('cancel');
            }
        });

        modalInstance.result.then(function () {
            //configHotkeys();
        }, function () {
            //configHotkeys();
        });
    };

    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('purchase', {
            url: '/purchase/:typeView/:productionId/:chapterId/:name',
            views: {
                'main': {
                    controller: 'DialogPurchaseController',
                    templateUrl: 'generalitiesPage/header.tpl.html'
                }
            },
            data: {
                pageTitle: 'Purchase'
            }
        });
    }]);

    app.controller('DialogPurchaseController', ['$scope', '$modal', '$stateParams', '$state', DialogPurchaseController]);

    app.controller('PurchaseViewController', [
        '$scope',
        'hotkeys',
        'UserService',
        'PurchaseService',
        '$modalInstance',
        'typeView',
        '$state',
        'AlertDialogService',
        'productionId',
        'chapterId',
        'ProgressDialogService',
        'TermsViewService',
        'DevInfo',
        'name',
        '$stateParams',
        '$rootScope',
        'RegisterUserService',
        '$timeout',
        PurchaseViewController
    ]);

    app.directive('customScrollActive', function () {
        return {
            link: function (scope, element, attrs) {
                scope.$watch(attrs.customScrollActive, function ($newValue) {
                    if ($newValue === 1) {

                        var x = $('#scrollbar-purchase').tinyscrollbar();
                        setTimeout(function () {
                            $(window).resize();
                        }, 100);
                    }
                });

            }
        };
    });

    app.directive('onlyLetters',['AlertDialogService',function(AlertDialogService){
        return {
            link : function(scope,element,attrs){
                element.bind("keydown",function(event){
                    var key = event.keyCode || event.which;
                    if(key !== 13 && key !== 37 && key !== 38 && key !==39 && key !== 40){
                        if( key >= 48  && key <= 57){
                            AlertDialogService.show(
                                'alert',
                                'Solo puede incluir letras en esta casilla',
                                'Aceptar'
                            );
                        }
                    }
                });
            }
        };
    }]);
    app.directive('focusUpdatedScroll', function () {
        return {
            link: function (scope, element, attrs) {

                $(element[0]).focus(function () {
                    var x = $('#scrollbar-purchase');
                    var scrollbar = x.data("plugin_tinyscrollbar");
                    var value = parseInt(attrs.focusUpdatedScroll);
                    scrollbar.update(value);
                });
            }
        };
    });

}(angular.module("caracolplaylgtvapp.purchaseView", [
    'ui.router'
])));