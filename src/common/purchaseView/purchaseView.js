(function(app) {
	var PurchaseViewController = function($scope, hotkeys, UserService, PurchaseService, UserInfo, $modalInstance) {
		var itemSelected = 0;

		var self = this;

		$scope.showOptions = true;
		$scope.loginVisible = false;
		$scope.boughtVisible = false;
		$scope.redeemVisible = false;

		$scope.isSubscription = false;
		$scope.isRent = false;

		$scope.subscribeStep = 0;
		$scope.defaultDocumentTypeIndex = 1;
		$scope.defaultCreditcardIndex = 0;

		$scope.loginData = {};

		$scope.months = [{
			name: 'Enero',
			id: 0
		}, {
			name: 'Febrero',
			id: 1
		}, {
			name: 'Marzo',
			id: 2
		}, {
			name: 'Abril',
			id: 3
		}, {
			name: 'Mayo',
			id: 4
		}, {
			name: 'Junio',
			id: 5
		}, {
			name: 'Julio',
			id: 6
		}, {
			name: 'Agosto',
			id: 7
		}, {
			name: 'Septiembre',
			id: 8
		}, {
			name: 'Octubre',
			id: 9
		}, {
			name: 'Noviembre',
			id: 10
		}, {
			name: 'Diciembre',
			id: 11
		}, ];

		$scope.years = [{
			name: '2014',
			id: 0
		}, {
			name: '2015',
			id: 1
		}, {
			name: '2016',
			id: 2
		}, {
			name: '2017',
			id: 3
		}, {
			name: '2018',
			id: 4
		}, {
			name: '2019',
			id: 5
		}, {
			name: '2020',
			id: 6
		}, {
			name: '2021',
			id: 7
		}, {
			name: '2022',
			id: 8
		}, ];

		$scope.parcels = [];

		$scope.subscribeParcels = [{
			name: '1 x $58.000'
		}, {
			name: '2 x $116.000'
		}, {
			name: '3 x $174.000'
		}, {
			name: '4 x $232.000'
		}, {
			name: '5 x $280.000'
		}, ];

		$scope.rentParcels = [{
			name: '1 x $34.800'
		}, {
			name: '2 x $69.600'
		}, {
			name: '3 x $104.400'
		}, {
			name: '4 x $139.200'
		}, {
			name: '5 x $174.000'
		}, ];

		$scope.creditcards = [{
			type: 'VISA',
			id: 1
		}, {
			type: 'Mastercard',
			id: 2
		}, ];

		$scope.documentTypes = [{
			type: 'Tarjeta de Identidad',
			id: 1
		}, {
			type: 'Cedula de ciudadania',
			id: 2
		}, ];

		$scope.documentType = $scope.documentTypes[$scope.defaultDocumentTypeIndex];

		$scope.isStepActive = function(item) {
			if (item <= $scope.subscribeStep) {
				return true;
			}
			return false;
		};

		$scope.menu = {
			title: 'Reproducir contenido',
			description: 'Para reproducir este contenido puedes usar una de las siguientes opciones',
			support: 'Si tienes problemas para ver este contenido contáctanos a soporte@caracolplay.com',
		};

		$scope.login = {
			title: 'Ingresar a la cuenta',
			description: 'Ingresa los datos si ya tienes un nombre de usuario y una contraseña ' +
				'en CaracolPlay o en nuestra red de portales',
			support: 'Si tienes problemas para ver este contenido contáctanos a soporte@caracolplay.com',
		};

		$scope.register = {
			title: 'Suscríbase por $58.000 el año',
			description: '',
			support: 'Si tienes problemas para ver este contenido contáctanos a soporte@caracolplay.com',
		};

		$scope.rent = {
			title: 'Alquiler por $34.800',
			description: '',
			support: 'Si tienes problemas para ver este contenido contáctanos a soporte@caracolplay.com',
		};

		$scope.redeem = {
			title: 'Redimir código',
			description: 'Ingresa el codigo para disfrutar el contenido',
			support: 'Si tienes problemas para ver este contenido contáctanos a soporte@caracolplay.com',
		};

		$scope.title = $scope.login.title;
		$scope.description = $scope.login.description;
		$scope.support = $scope.login.support;

		var configHotkeys = function() {
			hotkeys.add({
				combo: 'up',
				callback: function() {

				},
			});

			hotkeys.add({
				combo: 'down',
				callback: function() {

				},
			});

			hotkeys.add({
				combo: 'right',
				callback: function() {
					if (itemSelected + 1 >= $scope.options.length) {
						return;
					}

					$scope.options[itemSelected++].active = false;
					$scope.options[itemSelected].active = true;
				},
			});

			hotkeys.add({
				combo: 'left',
				callback: function() {
					if (itemSelected - 1 < 0) {
						return;
					}

					$scope.options[itemSelected--].active = false;
					$scope.options[itemSelected].active = true;
				},
			});

			hotkeys.add({
				combo: 'enter',
				callback: function() {
					switch (itemSelected) {
						case 0:
							$scope.showOptions = false;
							$scope.loginVisible = true;
							$scope.redeemVisible = false;
							break;
						case 1:
							$scope.isSubscription = true;
							$scope.isRent = false;
							$scope.showOptions = false;
							$scope.boughtVisible = true;
							$scope.redeemVisible = false;
							break;
						case 2:
							$scope.showOptions = false;
							$scope.isRent = true;
							$scope.isSubscription = false;
							$scope.boughtVisible = true;
							$scope.redeemVisible = false;
							break;
						case 3:
							$scope.showOptions = false;
							$scope.isRent = false;
							$scope.isSubscription = false;
							$scope.boughtVisible = false;
							$scope.redeemVisible = true;
							break;
					}
				},
			});
		};

		$scope.onRedeem = function() {
			// check if user is login
			if (!$scope.redeemCode) {
				alert('el codigo para redimir no puede estar vacio');
				return;
			}

			var redeemPromise = PurchaseService.validateCode($scope.redeemCode);

			redeemPromise.then(function(response) {
				console.log(response.data);
				response.data.status = true;
				if (response.data.status) {
					if (response.data.info_code) {
						if (response.data.info_code.type) {
							if (response.data.info_code.type === 'ev') {
								alert('Show video');
							}
						} else {
							$scope.showOptions = true;
							$scope.isRent = false;
							$scope.isSubscription = false;
							$scope.boughtVisible = false;
							$scope.redeemVisible = false;

							$scope.options.length = 2;
						}
					}
				} else {
					alert(response.data.response);
				}
			});
		};

		$scope.subscription = {
			email: '',
			user: '',
			password: '',
			confirmPassword: '',
			name: '',
			lastname: '',
			city: '',
			documentType: $scope.documentTypes[$scope.defaultDocumentTypeIndex],
			documentNumber: '',
			creditcard: $scope.creditcards[$scope.defaultCreditcardIndex],
			creditNumber: '',
			parcel: $scope.parcels[0],
			securityCode: '',
		};

		$scope.validateStepOne = function() {
			if ($scope.subscription.email === '') {
				alert('El campo de email no puede estar vacio');
				return false;
			}

			if ($scope.subscription.user === '') {
				alert('El campo de usuario no puede estar vacio');
				return false;
			}

			if ($scope.subscription.password === '') {
				alert('El campo de contraseña no puede estar vacio');
				return false;
			}

			if ($scope.subscription.confirmPassword === '') {
				alert('El campo de confirmar contraseña no puede estar vacio');
				return false;
			}

			if ($scope.subscription.password !== $scope.subscription.confirmPassword) {
				alert('Las contraseñas no coiciden');
				return false;
			}

			if (!$scope.subscription.terms) {
				alert('Debes aceptar los terminos y condiciones');
				return false;
			}

			if (!$scope.subscription.politics) {
				alert('Debes aceptar los politicas de privacidad');
				return false;
			}

			if (!$scope.subscription.requirements) {
				alert('Debes aceptar los requerimientos para reproducir video');
				return false;
			}

			return true;
		};

		$scope.validateStepTwo = function() {
			if (!$scope.subscription.name) {
				alert('El campo de nombres no puede estar vacio');
				return false;
			}

			if (!$scope.subscription.lastname) {
				alert('El campo de apellidos no puede estar vacio');
				return false;
			}

			if (!$scope.subscription.city) {
				alert('El campo de ciudad no puede estar vacio');
				return false;
			}

			if (!$scope.subscription.documentType) {
				alert('El campo de tipo de documento no puede estar vacio');
				return false;
			}

			if (!$scope.subscription.documentNumber) {
				alert('El campo de numero de documento no puede estar vacio');
				return false;
			}
			return true;
		};

		$scope.validateStepThree = function() {
			if (!$scope.subscription.creditcard) {
				alert('El campo de tipo de tarjeta de credito no puede estar vacio');
				return false;
			}

			if (!$scope.subscription.creditNumber) {
				alert('El campo de numero de tarjeta de credito no puede estar vacio');
				return false;
			}

			if (!$scope.subscription.month) {
				alert('El campo de mes de expiracion no puede estar vacio');
				return false;
			}

			if (!$scope.subscription.year) {
				alert('El campo de año de expiracion no puede estar vacio');
				return false;
			}

			if (!$scope.subscription.securityCode) {
				alert('El campo de codigo de seguridad no puede estar vacio');
				return false;
			}

			if (!$scope.subscription.parcel) {
				alert('El campo de parcel no puede estar vacio');
				return false;
			}
			return true;
		};

		$scope.onNext = function() {
			switch ($scope.subscribeStep) {
				case 0:
					if (!$scope.validateStepOne()) {
						break;
					}

					var validatePromise = UserService.validateUser(
						$scope.subscription.email,
						$scope.subscription.user,
						$scope.subscription.password);

					validatePromise.then(function(response) {
						if (response.data.response) {
							$scope.subscribeStep++;
						} else {
							alert(response.data.error);
						}
					});
					break;

				case 1:
					if (!$scope.validateStepTwo()) {
						break;
					}
					$scope.subscribeStep++;
					break;

				case 2:
					if (!$scope.validateStepThree()) {
						break;
					}
					var purchasePromise = PurchaseService.getProduct(1, 1, 1);

					purchasePromise.then(function(res) {
						console.log('test get_product');
						alert(res.data);
					});
					break;
			}
		};

		$scope.onBackSuscription = function() {
			if ($scope.subscribeStep - 1 >= 0) {
				$scope.subscribeStep--;
				return;
			}
			$scope.onBack();
		};

		$scope.onBack = function() {
			$scope.loginVisible = false;
			$scope.boughtVisible = false;
			$scope.redeemVisible = false;
			$scope.showOptions = true;
		};

		$scope.onLogin = function() {
			console.log('name: ' + $scope.loginData.username);
			console.log('password: ' + $scope.loginData.password);

			var authPromise = UserService.authenticateUser($scope.loginData.username, $scope.loginData.password);

			authPromise.then(function(response) {
				var resObj = response.data;

				console.log(resObj);

				if (resObj.status) {
					UserInfo.name = resObj.user.data.nombres;
					UserInfo.lastname = resObj.user.data.apellidos;
					UserInfo.alias = resObj.user.data.alias;
					UserInfo.mail = resObj.user.data.mail;
					UserInfo.password = $scope.loginData.password;
					UserInfo.session = resObj.session;
					UserInfo.uid = resObj.uid;
					UserInfo.isSubscription = resObj.user.is_suscription;
					UserInfo.timeEnds = resObj.user.time_ends;

					localStorage.setItem('userInfo', JSON.stringify(UserInfo));

					/**
					 * DEVELOPER NOTES: ADD CODE TO SHOW VIDEO
					 */
					alert('Show Video');
					$modalInstance.dismiss('cancel');
				} else {
					alert(resObj.response);
				}
			});

		};

		var setEssentialData = function(object) {
			$scope.title = object.title;
			$scope.description = object.description;
			$scope.support = object.support;
		};

		var init = function() {
			configHotkeys();

			$scope.expireDate = new Date();
			$scope.expireDate.setFullYear($scope.expireDate.getFullYear() + 1);

			$scope.$watch('loginVisible', function(newValue, oldValue) {
				if (newValue) {
					setEssentialData($scope.login);
				}
			});

			$scope.$watch('showOptions', function(newValue, oldValue) {
				if (newValue) {
					configHotkeys();
					if (UserInfo.alias !== '' && UserInfo.password !== '' && UserInfo.session !== '' && !UserInfo.isSubscription) {
						$scope.options = $scope.loggedOptions;
					} else {
						$scope.options = $scope.noLoggedOptions;
					}

					if (itemSelected < $scope.options.length) {
						$scope.options[itemSelected].active = false;
					}
					itemSelected = 0;
					$scope.options[itemSelected].active = true;
					setEssentialData($scope.menu);
				}
			});

			$scope.$watch('redeemVisible', function(newValue, oldValue) {
				if (newValue) {
					setEssentialData($scope.redeem);
				}
			});

			$scope.$watch('boughtVisible', function(newValue, oldValue) {
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
		};

		init();

		PurchaseService.loginPaymentUserFlow('user_ws_iam_6', '123').then(function(response) {
			console.log(response.data);
		}, function(error) {
			console.log(error);
		});

		/*
				var createUserPromise = PurchaseService.createUser(
					'user_ws_iam_6',
					'123',
					'Dp1yTwumd6LY6@iam.com',
					true,
					true,
					true
				);

				createUserPromise.then(function(response) {
					console.log(response.data);
				});
		*/

		$scope.noLoggedOptions = [{
			'title': 'Ingresar como usuario',
			'image': 'assets/img/login-logo.png',
			active: true
		}, {
			'title': 'Suscribirse a CaracolPlay',
			'image': 'assets/img/subscribe-logo.png',
			active: false
		}, {
			'title': 'Alquilar este contenido',
			'image': 'assets/img/rent-logo.png',
			active: false
		}, {
			'title': 'Redimir codigo',
			'image': 'assets/img/redeem-logo.png',
			active: false
		}];

		$scope.loggedOptions = [{
			'title': 'Suscribirse a CaracolPlay',
			'image': 'assets/img/subscribe-logo.png',
			active: false
		}, {
			'title': 'Alquilar este contenido',
			'image': 'assets/img/rent-logo.png',
			active: false
		}, {
			'title': 'Redimir codigo',
			'image': 'assets/img/redeem-logo.png',
			active: false
		}];

	};

	app.controller('PurchaseViewController', [
		'$scope',
		'hotkeys',
		'UserService',
		'PurchaseService',
		'UserInfo',
		'$modalInstance',
		PurchaseViewController
	]);

}(angular.module("caracolplaylgtvapp.purchaseView", [
	'ui.router'
])));