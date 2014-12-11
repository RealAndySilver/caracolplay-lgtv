(function(app) {

	var module = this;
	var ssl = {};

	module.END_POINT = 'http://appsbetadev.caracolplay.com/';
	module.TEST_END_POINT = 'http://192.168.1.127:1414/';

	ssl.END_POINT = 'http://operacionesplay.icck.net/api/';
	ssl.user = 'icck';
	ssl.password = 'K1qf(w#:';

	module.jsonTransform = function(obj) {
		var str = [];
		for (var p in obj) {
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		}
		return str.join("&");
	};

	module.encode = function(param1, param2, param3) {
		var headers = {};

		var sslHeaders = false;
		var user = '',
			password = '',
			session = '';

		if (typeof param1 === 'boolean') {
			sslHeaders = param1;

		} else {
			user = param1;
			password = param2;
			session = param3;
		}

		if (sslHeaders) {
			var sslAuth = btoa(unescape(encodeURIComponent(ssl.user + ':' + ssl.password)));
			headers.Authorization = 'Basic ' + sslAuth;
		} else {
			var time = new Date();
			var encodeKey = 'aREwKMVVmjA81aea0mVNFh';

			var utc = time.getTime();
			var auth = btoa(unescape(encodeURIComponent(btoa(unescape(encodeURIComponent(user + ':' + password + (session === '' ? '' : ':' + session)))))));
			var token = btoa(unescape(encodeURIComponent(utc + encodeKey)));

			var encodeStr = user + ':' + password + (session === '' ? '' : ':' + session);

			headers.auth = auth;
			headers.TS70 = '' + utc;
			headers.token = token;
		}

		return headers;
	};

	var ProductService = function($http, UserInfo) {
		var self = this;

		self.getFeatured = function() {
			return $http.get(module.END_POINT + 'GetFeatured?provider=aim');
			//return $http.get('assets/dummy/featured.json');
		};

		self.getCategories = function() {
			return $http.get(module.END_POINT + 'GetCategories?provider=aim');
			//return $http.get('assets/dummy/categories.json');
		};

		self.getListFromCategoryId = function(id, filter) {
			var url = module.END_POINT;
			if (filter) {
				filter = 1;
			}

			return $http.get(module.END_POINT + 'GetListFromCategoryId/' + id + '/' + filter + '?provider=aim');
			//return $http.get('assets/dummy/telenovelas.json');
		};

		self.getUserRecentlyWatched = function() {
			return $http({
				crossDomain: true,
				headers: module.encode(UserInfo.alias, UserInfo.password, UserInfo.session),
				method: 'GET',
				url: module.END_POINT + 'GetUserRecentlyWatched?provider=aim',
			});
		};

		self.getListFromSearchWithKey = function(keyword) {
			return $http.get(module.END_POINT + 'GetListFromSearchWithKey/' + keyword + '?provider=aim');
		};

		self.getProductWithID = function(id, uid) {
			if (!uid || uid === '') {
				uid = '0';
			}

			return $http({
				crossDomain: true,
				headers: module.encode(UserInfo.alias, UserInfo.password, UserInfo.session),
				method: 'GET',
				url: module.END_POINT + 'GetProductWithID/' + id + '/' + uid + '?provider=aim',
			});
		};
	};

	var UserService = function($http, UserInfo) {
		var self = this;

		self.videoWatched = function(productId, time) {
			return $http({
				crossDomain: true,
				headers: module.encode(UserInfo.alias, UserInfo.password, UserInfo.session),
				method: 'GET',
				url: module.END_POINT + 'VideoWatched/' + productId + '/' + time + '?provider=aim',
			});
		};

		self.isContentAvailableForUser = function(episodeId) {
			return $http({
				crossDomain: true,
				headers: module.encode(UserInfo.alias, UserInfo.password, UserInfo.session),
				method: 'GET',
				url: module.END_POINT + 'IsContentAvailableForUser/' + episodeId + '?provider=aim',
			});
		};

		self.authenticateUser = function(username, password) {
			return $http({
				crossDomain: true,
				headers: module.encode(username, password, ''),
				method: 'GET',
				url: module.END_POINT + 'AuthenticateUser?provider=aim',
			});
		};

		self.validateUser = function(mail, alias, password) {
			var json = {
				email: mail,
				alias: alias,
				password: password,
			};
			var encodedJson = btoa(unescape(encodeURIComponent(JSON.stringify(json).trim()))).trim();

			return $http({
				//crossDomain: true,
				headers: {
					'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				method: 'POST',
				transformRequest: module.jsonTransform,
				data: {
					user_info: encodedJson
				},
				url: module.END_POINT + "ValidateUser"
			});
		};
	};

	var PurchaseService = function($http, UserInfo) {
		var self = this;

		self.createUser = function(name, password, mail, privacyPolicity, termsAndConditions, bussinessInfo) {
			return $http({
				headers: encode(true),
				method: 'POST',
				url: ssl.END_POINT + 'common/commerce/user.json',
				data: JSON.stringify({
					'name': name,
					'pass': password,
					'mail': mail,
					'privacy_policy': privacyPolicity ? 1 : 0,
					'terms_and_conditions': termsAndConditions ? 1 : 0,
					'business_inf': bussinessInfo ? 1 : 0,
				})
			});
		};

		self.getProduct = function(id, type, action) {
			return $http({
				crossDomain: true,
				headers: module.encode(UserInfo.alias, UserInfo.password, UserInfo.session),
				method: 'POST',
				data: {
					'Id': id,
					'Type': type,
					'Action': action,
				},
				url: module.END_POINT + 'Get_Product?provider=aim',
			});
		};

		self.createOrder = function(productId, userId) {
			return $http({
				crossDomain: true,
				method: 'POST',
				headers: module.encode(UserInfo.alias, UserInfo.password, UserInfo.session),
				data: {
					'Id_Producto': productId,
					'Id_user': userId,
				},
				url: module.END_POINT + 'Create_Order?provider=aim',
			});
		};

		self.payment = function(orderId, userId, tokenCard, expirationDate, cvv, recurrence) {
			return $http({
				crossDomain: true,
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
				url: module.END_POINT + 'Payment?provider=aim',
			});
		};

		self.validateCode = function(code) {
			return $http({
				crossDomain: true,
				method: 'GET',
				url: module.END_POINT + 'ValidateCode/' + code + '?provider=aim',
			});
		};

		self.test = function() {
			return $http({
				crossDomain: true,
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