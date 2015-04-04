(function(app) {
	var ModalInstanceService = function() {
		var self = this;

		self.modalInstance = {};
		self.setModalInstance = function(modalInstance) {
			self.modalInstance = modalInstance;
		};

		self.getModalInstance = function() {
			return self.modalInstance;
		};
	};

	app.service('ModalInstanceService', [ModalInstanceService]);
	app.constant('ModalInstance', {});

	var PurchaseViewController = function($scope, hotkeys, UserService, PurchaseService, UserInfo, $modalInstance, typeView, $state, AlertDialogService, productionId, chapterId, ProgressDialog, TermsViewService, DevInfo) {
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
			value: '01',
			id: 0
		}, {
			name: 'Febrero',
			value: '02',
			id: 1
		}, {
			name: 'Marzo',
			value: '03',
			id: 2
		}, {
			name: 'Abril',
			value: '04',
			id: 3
		}, {
			name: 'Mayo',
			value: '05',
			id: 4
		}, {
			name: 'Junio',
			value: '06',
			id: 5
		}, {
			name: 'Julio',
			value: '07',
			id: 6
		}, {
			name: 'Agosto',
			value: '08',
			id: 7
		}, {
			name: 'Septiembre',
			value: '09',
			id: 8
		}, {
			name: 'Octubre',
			value: '10',
			id: 9
		}, {
			name: 'Noviembre',
			value: '11',
			id: 10
		}, {
			name: 'Diciembre',
			value: '12',
			id: 11
		}, ];

		$scope.years = [{
			name: '2014',
			value: '14',
			id: 0
		}, {
			name: '2015',
			value: '15',
			id: 1
		}, {
			name: '2016',
			value: '16',
			id: 2
		}, {
			name: '2017',
			value: '17',
			id: 3
		}, {
			name: '2018',
			value: '18',
			id: 4
		}, {
			name: '2019',
			value: '19',
			id: 5
		}, {
			name: '2020',
			value: '20',
			id: 6
		}, {
			name: '2021',
			value: '21',
			id: 7
		}, {
			name: '2022',
			value: '22',
			id: 8
		}, ];

		$scope.parcels = [];

		$scope.subscribeParcels = [{
			name: '1 x $58.000'
		}, ];

		$scope.rentParcels = [{
			name: '1 x $34.800'
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
			acronym: 'CC',
			id: 1
		}, {
			type: 'Cedula de ciudadania',
			acronym: 'TI',
			id: 2
		}, {
			type: 'Cedula de extranjeria',
			acronym: 'CE',
			id: 3
		}, {
			type: 'NIT',
			acronym: 'NIT',
			id: 4
		}, {
			type: 'Pasaporte',
			acronym: 'PPN',
			id: 5
		}, {
			type: 'Registro civil',
			acronym: 'RC',
			id: 6
		}, {
			type: 'Número de Seguridad Social',
			acronym: 'SSN',
			id: 7
		}, {
			type: 'Licencia conducción',
			acronym: 'LIC',
			id: 8
		}, {
			type: 'Identificación impositiva',
			acronym: 'TAX',
			id: 9
		}, ];

		$scope.showTerms = function() {
			TermsViewService.showTerms(function() {
				$scope.subscription.terms = true;
				configHotkeys();
			}, function() {
				$scope.subscription.terms = false;
				configHotkeys();
			}, true);
		};

		$scope.showHabeasData = function() {
			TermsViewService.showHabeasData(function() {
				$scope.subscription.politics = true;
				configHotkeys();
			}, function() {
				$scope.subscription.politics = false;
				configHotkeys();
			}, true);
		};

		$scope.showVideoRequeriments = function() {
			TermsViewService.showVideoRequeriments(function() {
				$scope.subscription.requirements = true;
				configHotkeys();
			}, function() {
				$scope.subscription.requirements = false;
				configHotkeys();
			}, true);
		};

		$scope.playVideo = function() {
			ProgressDialogService.start();
			var promiseIsContentAvaliable = UserService.isContentAvailableForUser($scope.getChapterId());

			promiseIsContentAvaliable.then(function(response) {
				ProgressDialogService.dismiss();
				if (response.data.status) {
					$state.go('videoModule', {
						chapterId: $scope.getChapterId(),
						productionId: $scope.selected.id,
					});
				} else {
					$state.reload();
				}
			});
		};

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
		$scope.active = '';

		$scope.needFocus = function(field) {
			return $scope.active === field;
		};

		$scope.onSides = function(side) {
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
			'city',
			'documentType',
			'documentNumber',
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
			//'renewal',
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

		$scope.next = function() {
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

			var redButtonCallback = function() {
				$state.go('dashboard');
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
					if ($scope.disableKeyEnter) {
						$scope.disableKeyEnter = false;
						return;
					}
					switch ($scope.options[itemSelected].id) {
						case 0:
							$scope.activeQueue = $scope.loginQueue;
							$scope.active = $scope.activeQueue[0];
							$scope.activeNumber = 0;

							$scope.showOptions = false;
							$scope.loginVisible = true;
							$scope.redeemVisible = false;
							break;
						case 1:
							$scope.activeQueue = $scope.rentQueue;
							$scope.active = $scope.activeQueue[0];
							$scope.activeNumber = 0;

							if (UserInfo.alias) {
								$scope.subscribeStep = 1;
							} else {
								$scope.subscribeStep = 0;
							}

							$scope.isSubscription = false;
							$scope.isRent = true;
							$scope.showOptions = false;
							$scope.boughtVisible = true;
							$scope.redeemVisible = false;
							break;
						case 2:
							$scope.activeQueue = $scope.rentQueue;
							$scope.active = $scope.activeQueue[0];
							$scope.activeNumber = 0;

							if (UserInfo.alias) {
								$scope.subscribeStep = 1;
							} else {
								$scope.subscribeStep = 0;
							}

							$scope.showOptions = false;
							$scope.isRent = false;
							$scope.isSubscription = true;
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

			$scope.active = $scope.activeQueue[0];
			$scope.activeNumber = 0;
		};

		$scope.onRedeem = function() {
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

			var redeemPromise = PurchaseService.validateCode($scope.redeemCode);

			redeemPromise.then(function(response) {
				response.data.status = true;
				if (response.data.status) {
					if (response.data.info_code) {
						if (response.data.info_code.type) {
							if (response.data.info_code.type === 'ev') {
								$scope.playVideo();
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

		$scope.cities = [];
		$scope.citiesStrings = [];

		$scope.getCities = function(val) {
			return PurchaseService.searchCityFlow(val).then(function(response) {
				$scope.cities = response.data;
				$scope.citiesStrings = $scope.cities.map(function(item) {
					return item.name;
				});
				return $scope.citiesStrings;
			});
		};

		$scope.validateStepOne = function() {
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
					'Debes aceptar los terminos y condiciones',
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

		$scope.validateStepTwo = function() {
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

		$scope.validateStepThree = function() {
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

		$scope.onNext = function() {
			switch ($scope.subscribeStep) {
				case 0:
					if (!$scope.validateStepOne()) {
						break;
					}

					var createUserPromise = PurchaseService.createUser(
						$scope.subscription.user,
						$scope.subscription.password,
						$scope.subscription.email,
						$scope.subscription.politics,
						$scope.subscription.terms,
						$scope.subscription.information);

					ProgressDialog.start();
					var successCallbackCreateUser = function(response) {
						ProgressDialog.dismiss();

						UserInfo.alias = $scope.subscription.user;
						UserInfo.password = $scope.subscription.password;
						UserInfo.mail = $scope.subscription.email;
						UserInfo.uid = response.data.uid;

						localStorage.setItem('userInfo', JSON.stringify(UserInfo));

						$scope.subscribeStep++;
						$scope.activeQueue = $scope.rentQueueStep2;
						$scope.active = $scope.activeQueue[0];
						$scope.activeNumber = 0;
					};

					var failureCallbackCreateUser = function(response) {
						console.log('error', response);
						ProgressDialog.dismiss();

						AlertDialogService.show(
							'alert',
							response.data.form_errors[0],
							'Aceptar',
							function() {
								configHotkeys();
							}
						);
					};

					createUserPromise.then(successCallbackCreateUser, failureCallbackCreateUser);

					break;

				case 1:
					if (!$scope.validateStepTwo()) {
						break;
					}
					var position = $scope.citiesStrings.indexOf($scope.subscription.city);

					$scope.subscribeStep++;

					if ($scope.isRent) {
						$scope.activeQueue = $scope.rentQueueStep3;
					} else {
						$scope.activeQueue = $scope.subscriptionQueueStep3;
					}
					$scope.active = $scope.activeQueue[0];
					$scope.activeNumber = 0;

					break;

				case 2:
					if (!$scope.validateStepThree()) {
						break;
					}

					var successCallbackExecuteTransaction = function(response) {
						console.log(response);
						if (response.data.status === 'Aprobada') {
							AlertDialogService.show(
								'alert',
								response.data.user + ': ' + response.data.result,
								'Aceptar',
								function() {
									configHotkeys();
									$state.go('videoModule', {
										'chapterId': chapterId,
										'productionId': productionId,
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

					var failureCallback = function(response) {
						AlertDialogService.show(
							'alert',
							response.data[0],
							'Aceptar',
							configHotkeys
						);
					};

					var successCallbackCreateOrder = function(response) {
						var order = response.data;

						var positionSelectedCity = $scope.citiesStrings.indexOf($scope.subscription.city);

						var transactionInfo = {
							'order_id': order.order_id,
							'card_info': {
								'status': 'no',
								'franchise': $scope.subscription.creditcard.type,
							},
							'payment': {
								'num_card': $scope.subscription.creditNumber,
								'security_number': $scope.subscription.securityCode,
								'expires_date': $scope.subscription.month.value + $scope.subscription.year.value,
							},
							'customer': {
								'document_type': $scope.subscription.documentType.acronym,
								'document': $scope.subscription.documentNumber,
								'lastname': $scope.subscription.lastname,
								'name': $scope.subscription.name,
								'phone': $scope.subscription.phone,
								//'phone': '1234567890',
								'address': $scope.subscription.address,
								//'address': 'dir 12 #34',
								'renovation': '1',
								'city': $scope.cities[positionSelectedCity].id,
							}
						};

						var promiseExecute = PurchaseService.executeTransactionWithCardFlow(transactionInfo);

						promiseExecute.then(successCallbackExecuteTransaction, failureCallback);
					};

					var successCallbackLogin = function(response) {
						var promiseCreateOrder;
						if ($scope.isRent) {
							promiseCreateOrder = PurchaseService.createRentOrderFlow(chapterId);
						} else {
							promiseCreateOrder = PurchaseService.createSubscriptionOrderFlow();
						}
						promiseCreateOrder.then(successCallbackCreateOrder, failureCallback);
					};

					console.log('UserInfo', UserInfo);
					console.log('alias', UserInfo.alias, 'password', UserInfo.password);
					var promiseLogin = PurchaseService.loginPaymentUserFlow(UserInfo.alias, UserInfo.password);
					promiseLogin.then(successCallbackLogin, failureCallback);
					/*
					var purchasePromise = PurchaseService.getProduct(1, 1, 1);

					purchasePromise.then(function(res) {
						alert(res.data);
					});
					*/

					break;
			}
		};

		$scope.onBackSuscription = function() {
			if ($scope.subscribeStep - 1 >= 0) {
				$scope.subscribeStep--;

				if (UserInfo.alias && $scope.subscribeStep === 0) {
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

		$scope.onBack = function() {
			$scope.loginVisible = false;
			$scope.boughtVisible = false;
			$scope.redeemVisible = false;
			$scope.showOptions = true;
		};

		$scope.onLogin = function() {
			ProgressDialog.start();

			console.log('username:', $scope.loginData.username, 'password', $scope.loginData.password);

			var promiseLogin = PurchaseService.loginPaymentUserFlow($scope.loginData.username, $scope.loginData.password);
			promiseLogin.then(function(response) {
				console.log('login', response.data);
				ProgressDialog.dismiss();

				var user = response.data.user;

				UserInfo.name = user.name;
				UserInfo.alias = $scope.loginData.username;
				UserInfo.mail = user.mail;
				UserInfo.password = $scope.loginData.password;
				UserInfo.session = response.data.sessid;
				UserInfo.uid = user.uid;
				if (user.field_tiene_suscripcion.und) {
					UserInfo.isSubscription = user.field_tiene_suscripcion.und[0].value == 1;
				}
				if (user.field_suscripcion_fecha_venc.und) {
					UserInfo.timeEnds = new Date(user.field_suscripcion_fecha_venc.und[0].value);
				}

				localStorage.setItem('userInfo', JSON.stringify(UserInfo));
				console.log('productId: ', productionId, 'chapterId', chapterId);
				$state.go('videoModule', {
					chapterId: chapterId,
					productionId: productionId
				});

				/*
				AlertDialogService.show(
						'alert',
						'Call method to show video',
						'Aceptar',
						function() {
							configHotkeys();
							window.history.back();
						}
					);
				*/

			}, function(error) {
				console.log('login', error.data);
				ProgressDialog.dismiss();
				AlertDialogService.show(
					'alert',
					error.data[0],
					'Aceptar',
					configHotkeys
				);
			});

			/*
			var authPromise = UserService.authenticateUser($scope.loginData.username, $scope.loginData.password);

			authPromise.then(function(response) {
				var resObj = response.data;

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

					//
					// DEVELOPER NOTES: ADD CODE TO SHOW VIDEO
					//
					AlertDialogService.show(
							'alert',
							'Show Video',
							'Aceptar',
						configHotkeys
						);
					$modalInstance.dismiss('cancel');
					//$state.go('dashboard');
				} else {
					AlertDialogService.show(
						'alert',
						resObj.response,
						'Aceptar',
						configHotkeys
					);
				}
			});
			*/

		};

		var setEssentialData = function(object) {
			$scope.title = object.title;
			$scope.description = object.description;
			$scope.support = object.support;
		};

		var setOptionsByTypeView = function() {
			switch (typeView) {
				case 1:
					$scope.options.push($scope.rentOptions);
					$scope.options.push($scope.redeemOptions);
					break;
				case 2:
					$scope.options.push($scope.subscriptionOption);
					$scope.options.push($scope.redeemOptions);
					break;
				case 3:
					$scope.options.push($scope.rentOptions);
					$scope.options.push($scope.subscriptionOption);
					$scope.options.push($scope.redeemOptions);
					break;
				default:
					break;
			}
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
						$scope.options = [];
						setOptionsByTypeView();
					} else {
						$scope.options = [];
						$scope.options.push($scope.loginOptions);
						setOptionsByTypeView();
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

		PurchaseService.loginPaymentUserFlow(UserInfo.alias, UserInfo.password).then(function(response) {
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
				});
		*/

		$scope.subscriptionOption = {
			'title': 'Suscribirse a CaracolPlay',
			'image': 'assets/img/subscribe-logo.png',
			id: 2,
			active: false
		};

		$scope.rentOptions = {
			'title': 'Alquilar este contenido',
			'image': 'assets/img/rent-logo.png',
			id: 1,
			active: false
		};

		$scope.redeemOptions = {
			'title': 'Redimir codigo',
			'image': 'assets/img/redeem-logo.png',
			id: 3,
			active: false
		};

		$scope.loginOptions = {
			'title': 'Ingresar como usuario',
			'image': 'assets/img/login-logo.png',
			id: 0,
			active: true
		};

	};

	var DialogPurchaseController = function($scope, $modal, $stateParams, UserInfo, $state) {
		var typeView = $stateParams.typeView;
		var productionId = $stateParams.productionId;
		var chapterId = $stateParams.chapterId;

		console.log('UserInfo', UserInfo);
		if (UserInfo.alias) {
			window.history.back();
			return;
		}

		var modalInstance = $modal.open({
			templateUrl: 'purchaseView/purchaseView.tpl.html',
			controller: 'PurchaseViewController',
			size: 'lg',
			resolve: {
				typeView: function() {
					return parseInt(typeView);
				},
				productionId: function() {
					return productionId;
				},
				chapterId: function() {
					return chapterId;
				}
			}
		});

		$scope.$on('$stateChangeStart', function(event, newUrl, oldUrl) {
			if (modalInstance) {
				modalInstance.dismiss('cancel');
			}
		});

		modalInstance.result.then(function() {
			//configHotkeys();
		}, function() {
			//configHotkeys();
		});
	};

	app.config(['$stateProvider', function($stateProvider) {
		$stateProvider.state('purchase', {
			url: '/purchase/:typeView/:productionId/:chapterId',
			views: {
				'main': {
					controller: 'DialogPurchaseController',
					templateUrl: 'generalitiesPage/header.tpl.html'
				}
			},
			data: {
				pageTitle: 'Purchase'
			},
		});
	}]);

	app.controller('DialogPurchaseController', ['$scope', '$modal', '$stateParams', 'UserInfo', '$state', DialogPurchaseController]);

	app.controller('PurchaseViewController', [
		'$scope',
		'hotkeys',
		'UserService',
		'PurchaseService',
		'UserInfo',
		'$modalInstance',
		'typeView',
		'$state',
		'AlertDialogService',
		'productionId',
		'chapterId',
		'ProgressDialogService',
		'TermsViewService',
		'DevInfo',
		PurchaseViewController
	]);

}(angular.module("caracolplaylgtvapp.purchaseView", [
	'ui.router'
])));