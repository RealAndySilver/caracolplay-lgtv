(function(app) {
	var PurchaseViewController = function($scope, hotkeys) {
		var itemSelected = 0;

		$scope.showOptions = true;
		$scope.loginVisible = false;
		$scope.boughtVisible = false;
		$scope.redeemVisible = false;

		$scope.isSubscription = false;
		$scope.isRent = false;

		$scope.subscribeStep = 0;
		$scope.defaultDocumentTypeIndex = 1;
		$scope.defaultCreditcardIndex = 0;

		$scope.months = [
			{ name:'Enero', id: 0 },
			{ name:'Febrero', id: 1 },
			{ name:'Marzo', id: 2 },
			{ name:'Abril', id: 3 },
			{ name:'Mayo', id: 4 },
			{ name:'Junio', id: 5 },
			{ name:'Julio', id: 6 },
			{ name:'Agosto', id: 7 },
			{ name:'Septiembre', id: 8 },
			{ name:'Octubre', id: 9 },
			{ name:'Noviembre', id: 10 },
			{ name:'Diciembre', id: 11 },
		];

		$scope.years = [
			{ name: '2014', id: 0 },
			{ name: '2015', id: 1 },
			{ name: '2016', id: 2 },
			{ name: '2017', id: 3 },
			{ name: '2018', id: 4 },
			{ name: '2019', id: 5 },
			{ name: '2020', id: 6 },
			{ name: '2021', id: 7 },
			{ name: '2022', id: 8 },
		];

		$scope.parcels = [];

		$scope.subscribeParcels = [
			{ name: '1 x $58.000' },
			{ name: '2 x $116.000' },
			{ name: '3 x $174.000' },
			{ name: '4 x $232.000' },
			{ name: '5 x $280.000' },
		];

		$scope.rentParcels = [
			{ name: '1 x $34.800' },
			{ name: '2 x $69.600' },
			{ name: '3 x $104.400' },
			{ name: '4 x $139.200' },
			{ name: '5 x $174.000' },
		];

		$scope.creditcards = [
			{ type: 'VISA', id: 1 },
			{ type: 'Mastercard', id: 2 },
		];

		$scope.documentTypes = [
			{ type: 'Tarjeta de Identidad', id: 1 },
			{ type: 'Cedula de ciudadania', id: 2 },
		];

		$scope.documentType = $scope.documentTypes[$scope.defaultDocumentTypeIndex];

		$scope.isStepActive = function(item) {
			console.log(item);
			console.log($scope.subscribeStep);
			if(item <= $scope.subscribeStep) {
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
			description: 'Ingresa los datos si ya tienes un nombre de usuario y una contraseña en CaracolPlay o en nuestra red de portales',
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
					if(itemSelected + 1 >= $scope.options.length) {
						return;
					}

					$scope.options[itemSelected++].active = false;
					$scope.options[itemSelected].active = true;
				},
			});

			hotkeys.add({
				combo: 'left',
				callback: function() {
					if(itemSelected - 1 < 0) {
						return;
					}

					$scope.options[itemSelected--].active = false;
					$scope.options[itemSelected].active = true;
				},
			});

			hotkeys.add({
				combo: 'enter',
				callback: function() {
					switch(itemSelected) {
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

			$scope.showOptions = true;
			$scope.isRent = false;
			$scope.isSubscription = false;
			$scope.boughtVisible = false;
			$scope.redeemVisible = false;

			$scope.options.length = 2;
		};

		$scope.onNext = function() {
			$scope.subscribeStep++;
		};

		$scope.onBackSuscription = function() {
			if($scope.subscribeStep - 1 >= 0) {
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
				if(newValue) {
					setEssentialData($scope.login);
				}
			});

			$scope.$watch('showOptions', function(newValue, oldValue) {
				if(newValue) {
					configHotkeys();
					$scope.options = $scope.noLoggedOptions;
					if(itemSelected < $scope.options.length) {
						$scope.options[itemSelected].active = false;
					}
					itemSelected = 0;
					$scope.options[itemSelected].active = true;
					setEssentialData($scope.menu);
				}
			});

			$scope.$watch('redeemVisible', function(newValue, oldValue) {
				if(newValue) {
					setEssentialData($scope.redeem);
				}
			});

			$scope.$watch('boughtVisible', function(newValue, oldValue) {
				if(newValue) {
					if($scope.isSubscription) {
						setEssentialData($scope.register);
						$scope.parcels = $scope.subscribeParcels;
					} else {
						setEssentialData($scope.rent);
						$scope.parcels = $scope.rentParcels;
					}
					$scope.parcel = $scope.parcels[0];
				}
			});
		};

		init();

		$scope.noLoggedOptions = [
			{ 'title': 'Ingresar como usuario', 'image': 'assets/img/login-icon.png', active: true },
			{ 'title': 'Suscribirse a CaracolPlay', 'image': 'assets/img/subscribe-icon.png', active: false },
			{ 'title': 'Alquilar este contenido', 'image': 'assets/img/rent-icon.png', active: false },
			{ 'title': 'Redimir codigo', 'image': 'assets/img/redeem-icon.png', active: false }
		];
		
	};

	app.controller('PurchaseViewController', ['$scope', 'hotkeys', PurchaseViewController]);

}(angular.module("caracolplaylgtvapp.purchaseView", [
	'ui.router'
])));