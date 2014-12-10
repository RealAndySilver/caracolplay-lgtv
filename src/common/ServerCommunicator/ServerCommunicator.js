(function(app) {

	var module = this;

	module.END_POINT = 'http://appsbetadev.caracolplay.com/';
	module.TEST_END_POINT = 'http://192.168.1.123:1414/';

	module.encode = function(user, password, session) {
		var time = new Date();
		var encodeKey = 'aREwKMVVmjA81aea0mVNFh';

		var utc = /*1417716661130/*/time.getTime()/**/;
		var auth = btoa(unescape(encodeURIComponent(btoa(unescape(encodeURIComponent(user + ':' + password + (session === '' ? '' : ':' + session)))))));
		var token = btoa(unescape(encodeURIComponent(utc + encodeKey)));

		var encodeStr = user + ':' + password + (session === '' ? '' : ':' + session);
		console.log('auth: ' + encodeStr);

		var headers = {
			//'Content-Type': 'application/json',
			auth: auth,
			TS70: '' + utc,
			token: token,
		};

		console.log(headers);
		return headers;
	};

	var ProductService = function($http, UserInfo) {
		var self = this;

		self.getFeatured = function() {
			return $http.get(module.END_POINT + 'GetFeatured');
			//return $http.get('assets/dummy/featured.json');
		};

		self.getCategories = function() {
			return $http.get(module.END_POINT + 'GetCategories');
			//return $http.get('assets/dummy/categories.json');
		};

		self.getListFromCategoryId = function(id, filter) {
			var url = module.END_POINT;
			if (filter) {
				filter = 1;
			}

			return $http.get(module.END_POINT + 'GetListFromCategoryId/' + id + '/' + filter);
			//return $http.get('assets/dummy/telenovelas.json');
		};

		self.getUserRecentlyWatched = function() {
			return $http({
				headers: module.encode(UserInfo.alias, UserInfo.password, UserInfo.session),
				method: 'GET',
				url: module.END_POINT + 'GetUserRecentlyWatched',
			});
		};

		self.getListFromSearchWithKey = function(keyword) {
			return $http.get(module.END_POINT + 'GetListFromSearchWithKey/' + keyword);
		};

		self.getProductWithID = function(id, uid) {
			if (!uid || uid === '') {
				uid = '0';
			}

			return $http({
				headers: module.encode(UserInfo.alias, UserInfo.password, UserInfo.session),
				method: 'GET',
				url: module.END_POINT + 'GetProductWithID/' + id + '/' + uid,
			});
		};
	};

	var UserService = function($http, UserInfo) {
		var self = this;

		self.videoWatched = function(productId, time) {
			return $http({
				headers: module.encode(UserInfo.alias, UserInfo.password, UserInfo.session),
				method: 'GET',
				url: module.END_POINT + 'VideoWatched/' + productId + '/' + time,
			});
		};

		self.authenticateUser = function(username, password) {
			return $http({
				headers: module.encode(username, password, ''),
				method: 'GET',
				url: module.END_POINT + 'AuthenticateUser',
			});
		};

		self.validateUser = function(mail, alias, password) {
			var json = {
				'name': 'dazuku',
				'lastname': 'dazuku',
				'genero': 'Masculino',
				'fecha_de_nacimiento': 1417582800,
				'email': 'dazuku@dazuku.co',
				'alias': 'dazuku',
				'password': 'dazuku',
				//email: mail,
				//alias: alias,
				//password: password,
			};
			console.log(JSON.stringify(json));
			var encodedJson = btoa(unescape(encodeURIComponent(JSON.stringify(json).trim()))).trim();
			console.log(encodedJson);

			encodedJson = 'eyJuYW1lIjoiZGF6dWt1IiwibGFzdG5hbWUiOiJkYXp1a3UiLCJnZW5lcm8iOiJNYXNjdWxpbm8iLCJmZWNoYV9kZV9uYWNpbWllbnRvIjoxNDE3NTgyODAwLCJlbWFpbCI6ImRhenVrdUBkYXp1a3UuY28iLCJhbGlhcyI6ImRhenVrdSIsInBhc3N3b3JkIjoiZGF6dWt1In0=';

			$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

			return $http({
				headers: module.encode('', '', ''),
				method: 'POST',
				data: {
					'user_info': encodedJson
				},
				url: module.END_POINT + "ValidateUser"
			});
		};
	};

	var PurchaseService = function($http, UserInfo) {
		var self = this;

		self.getProduct = function(id, type, action) {
			return $http({
				headers: module.encode(UserInfo.alias, UserInfo.password, UserInfo.session),
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
				headers: module.encode(UserInfo.alias, UserInfo.password, UserInfo.session),
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
				headers: module.encode(UserInfo.alias, UserInfo.password, UserInfo.session),
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
				method: 'GET',
				url: module.END_POINT + 'ValidateCode/' + code,
			});
		};

		self.test = function() {
			return $http({
				method: 'POST',
				headers: module.encode('', '', ''),
				url: module.TEST_END_POINT + 'dazuku',
				data: {
					status: true,
					message: 'dazuku test'
				}
			});
		};
	};

	app.service('ProductService', ['$http', 'UserInfo', ProductService]);
	app.service('UserService', ['$http', 'UserInfo', UserService]);
	app.service('PurchaseService', ['$http', 'UserInfo', PurchaseService]);

}(angular.module("caracolplaylgtvapp.ServerCommunicator", [
	'ui.router'
])));