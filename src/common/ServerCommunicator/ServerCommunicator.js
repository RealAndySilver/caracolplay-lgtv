(function(app) {

	var module = this;
	var ssl = {};

	module.END_POINT = 'http://apps.caracolplay.com/';
	//module.END_POINT = 'http://appsbetadev.caracolplay.com/';
	module.TEST_END_POINT = 'http://192.168.1.129:1414/';

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
		var isWithToken = false, sslToken = '';
		var user = '',
			password = '',
			session = '';

		if (typeof param1 === 'boolean') {
			sslHeaders = param1;

			if(param2) {
				isWithToken = true;
				sslToken = param2;
			}
		} else {
			user = param1;
			password = param2;
			session = param3;
		}

		if (sslHeaders) {
			var sslAuth = btoa(unescape(encodeURIComponent(ssl.user + ':' + ssl.password)));
			headers.Authorization = 'Basic ' + sslAuth;
			headers['Content-Type'] = 'application/json; charset=UTF-8';

			if(isWithToken) {
				headers['X-CSRF-Token'] = sslToken;
			}
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
			//return $http.get(module.END_POINT + 'GetFeatured' /*+ '?player_br=aim'*/);
			return $http.get('assets/dummy/featured.json');
		};

		self.getCategories = function() {
			//return $http.get(module.END_POINT + 'GetCategories' /*+ '?player_br=aim'*/);
			return $http.get('assets/dummy/categories.json');
		};

		self.getListFromCategoryId = function(id, filter) {
			var url = module.END_POINT;
			if (filter) {
				filter = 1;
			}

			//return $http.get(module.END_POINT + 'GetListFromCategoryId/' + id + '/' + filter + '?player_br=aim');
			return $http.get('assets/dummy/telenovelas.json');
		};

		self.getUserRecentlyWatched = function() {
			return $http({
				crossDomain: true,
				headers: module.encode(UserInfo.alias, UserInfo.password, UserInfo.session),
				method: 'GET',
				url: module.END_POINT + 'GetUserRecentlyWatched?player_br=aim',
			});
		};

		self.getListFromSearchWithKey = function(keyword) {
			return $http.get(module.END_POINT + 'GetListFromSearchWithKey/' + keyword + '?player_br=aim');
		};

		self.getProductWithID = function(id, uid) {
			if (!uid || uid === '') {
				uid = '0';
			}

			return $http({
				crossDomain: true,
				headers: module.encode(UserInfo.alias, UserInfo.password, UserInfo.session),
				method: 'GET',
				url: module.END_POINT + 'GetProductWithID/' + id + '/' + uid + '?player_br=aim',
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
				url: module.END_POINT + 'VideoWatched/' + productId + '/' + time + '?player_br=aim',
			});
		};

		self.isContentAvailableForUser = function(episodeId) {
			return $http({
				crossDomain: true,
				headers: module.encode(UserInfo.alias, UserInfo.password, UserInfo.session),
				method: 'GET',
				url: module.END_POINT + 'IsContentAvailableForUser/' + episodeId + '?player_br=aim',
			});
		};

		self.authenticateUser = function(username, password) {
			return $http({
				crossDomain: true,
				headers: module.encode(username, password, ''),
				method: 'GET',
				url: module.END_POINT + 'AuthenticateUser?player_br=aim',
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
			console.log({
					'name': name,
					'pass': password,
					'mail': mail,
					'privacy_policy': privacyPolicity ? 1 : 0,
					'terms_and_conditions': termsAndConditions ? 1 : 0,
					'business_inf': bussinessInfo ? 1 : 0,
				});
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

		self.getToken = function() {
			return $http({
				headers: encode(true),
				method: 'POST',
				data: '',
				url: ssl.END_POINT + 'common/user/token.json',
			});
		};

		self.loginPaymentUser = function(username, password, token) {
			return $http({
				headers: encode(true, token),
				method: 'POST',
				url: ssl.END_POINT + 'common/user/login.json',
				data: JSON.stringify({
					'username': username,
					'password': password,
				}),
			});
		};

		self.loginPaymentUserFlow = function(username, password) {
			var asyncResponse = function(makeFunction) {
				this.then = function(success, error) {
					makeFunction(success, error);
				};

				return { then: this.then };
			};

			return asyncResponse(function(sucessCallback, errorCallback) {
				var tokenPromise = self.getToken();
				tokenPromise.then(function(response) {
					var token = response.data.token;

					self.loginPaymentUser(username, password, token).then(sucessCallback, errorCallback);
				}, errorCallback);
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
				url: module.END_POINT + 'Get_Product?player_br=aim',
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
				url: module.END_POINT + 'Create_Order?player_br=aim',
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
				url: module.END_POINT + 'Payment?player_br=aim',
			});
		};

		self.validateCode = function(code) {
			return $http({
				crossDomain: true,
				method: 'GET',
				url: module.END_POINT + 'ValidateCode/' + code + '?player_br=aim',
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