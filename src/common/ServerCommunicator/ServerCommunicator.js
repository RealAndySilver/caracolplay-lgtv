(function(app) {

	var module = this;

	module.END_POINT = 'http://apps.caracolplay.com/';

	module.encode = function(user, password, session) {
		var time = new Date();
		var utcTime = new Date(time.getUTCFullYear(), time.getUTCMonth(), time.getUTCDate(),  time.getUTCHours(), time.getUTCMinutes(), time.getUTCSeconds(), time.getUTCMilliseconds());
		var encodeKey = 'aREwKMVVmjA81aea0mVNFh';

		var utc = time.getTime();
		var auth = window.btoa(window.btoa(user + ':' + password + ':' + session));
		var token = window.btoa(utc + encodeKey);

		console.log('utc:' + utcTime);
		console.log('time: ' + time.getTime());
		console.log('utc: ' + utc);
		console.log(auth);
		console.log(token);

		return {
			auth: auth,
			TS70: utc,
			token: token,
		};
	};
	
	var ProductService =  function($http) {
		var self = this;

		self.getFeatured = function() {
			return $http.get(module.END_POINT + 'GetFeatured');
		};

		self.getCategories = function() {
			return $http.get(module.END_POINT + 'GetCategories');
		};

		self.getListFromCategoryId = function(id, filter) {
			var url = module.END_POINT;
			if(filter) {
				filter = 1;
			}
			
			return $http.get(module.END_POINT + 'GetListFromCategoryId/' + id + '/' + filter);
		};

		self.getListFromSearchWithKey = function(keyword) {
			return $http.get(module.END_POINT + 'GetListFromSearchWithKey/' + keyword);
		};

		self.getProductWithID = function(id, uid) {
			if(!uid || uid === '') {
				uid = '0';
			}

			return $http({
				headers: module.encode('', '', ''),
				method: 'GET',
				url: module.END_POINT + 'GetProductWithID/' + id + '/' + uid,
			});
		};
	};

	var UserService = function($http) {
		var self = this;

		self.authenticateUser = function(username, password) {
			return $http({
				headers: module.encode(username, password, ''),
				method: 'GET',
				url: module.END_POINT + 'AuthenticateUser',
			});
		};

		self.validateUser = function(mail, alias, password) {
			var json = {
				email: mail,
				alias: alias,
				password: password,
			};
			console.log(JSON.stringify(json));
			var encodedJson = window.btoa(JSON.stringify(json).trim()).trim();
			console.log(encodedJson);

			return $http({
				//headers: module.encode('', '', ''),
				method: 'POST',
				data: { 'user_info': encodedJson },
				url: module.END_POINT + "ValidateUser"
			});
		};
	};

	var PurchaseService = function($http) {
		var self = this;

		self.getProduct = function(id, type, action) {
			return $http({
				headers: encode('', '', ''),
				method: 'POST',
				data: {
					'Id': id,
					'Type': type,
					'Action': action,
				},
				url: module.END_POINT + 'Get_Product',
			});
		};

		self.createOrder = function(productId, userId) {
			return $http({
				method: 'POST',
				headers: encode('', '', ''),
				data: {
					'Id_Producto': productId,
					'Id_user': userId,
				},
				url: module.END_POINT + 'Create_Order',
			});
		};

		self.payment = function(orderId, userId, tokenCard, expirationDate, cvv, recurrence) {
			return $http({
				method: 'POST',
				headers: encode('', '', ''),
				data: {
					'Id_Order': orderId,
					'Id_User': userId,
					'Token_card': tokenCard,
					'Exp_Date': expirationDate,
					'CVV': cvv,
					'Recurrencia': recurrence,
				},
				url: module.END_POINT + 'Payment',
			});
		};

		self.validateCode = function(code) {
			return $http({
				method:'GET',
				url: module.END_POINT + 'ValidateCode/' + code,
			});
		};
	};

	app.service('ProductService',['$http', ProductService]);
	app.service('UserService', ['$http', UserService]);
	app.service('PurchaseService', ['$http', PurchaseService]);

} (angular.module("caracolplaylgtvapp.ServerCommunicator", [
	'ui.router'
])));