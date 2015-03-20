(function(app) {

	var module = this;
	var ssl = {};

	var test = {};

	test.withoutInternet = false;

	//module.END_POINT = 'http://apps.caracolplay.com/';
	module.END_POINT = 'http://appsbetadev.caracolplay.com/';
	module.TEST_END_POINT = 'http://192.168.1.129:1414/';

	ssl.END_POINT = 'https://premium.icck.net/api/';
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
		var isWithToken = false,
			sslToken = '';
		var user = '',
			password = '',
			session = '';

		if (typeof param1 === 'boolean') {
			sslHeaders = param1;

			if (param2) {
				isWithToken = true;
				sslToken = param2;
			}
		} else {
			user = param1;
			password = param2;
			session = param3;
		}

		//headers['Origin'] = 'http://iamstudio.co';

		if (sslHeaders) {
			var sslAuth = btoa(unescape(encodeURIComponent(ssl.user + ':' + ssl.password)));
			headers.Authorization = 'Basic ' + sslAuth;
			headers['Content-Type'] = 'application/json; charset=UTF-8';

			if (isWithToken) {
				headers['X-CSRF-Token'] = sslToken;
			}
		} else {
			var time = new Date();
			var encodeKey = 'aREwKMVVmjA81aea0mVNFh';

			var utc = time.getTime();
			var authWithoutEncode = user + ':' + password + (session === '' ? '' : ':' + session);
			console.log('auth', authWithoutEncode);
			var auth = btoa(unescape(encodeURIComponent(btoa(unescape(encodeURIComponent(authWithoutEncode))))));
			var token = btoa(unescape(encodeURIComponent(utc + encodeKey)));

			var encodeStr = user + ':' + password + (session === '' ? '' : ':' + session);

			headers.auth = auth;
			headers.TS70 = '' + utc;
			headers.token = token;
		}

		return headers;
	};

	var ProductService = function($http, UserInfo, $q) {
		var self = this;

		self.getRecommendationsWithProductID = function(productId) {
			if (test.withoutInternet) {
				return $http.get('assets/dummy/recommended.json');
			} else {
				return $http({
					crossDomain: true,
					headers: module.encode(UserInfo.alias, UserInfo.password, UserInfo.session),
					method: 'GET',
					url: module.END_POINT + 'GetRecommendationsWithProductID/' + productId + '/?player_br=iam',
				});
			}
		};

		self.updateUserFeedbackForProduct = function(productId, rate) {
			return $http({
				crossDomain: true,
				headers: module.encode(UserInfo.alias, UserInfo.password, UserInfo.session),
				method: 'GET',
				url: module.END_POINT + 'UpdateUserFeedbackForProduct?player_br=aim/produccion/' + productId + '/' + (rate * 100.0 / 5.0),
			});
		};

		self.getFeatured = function() {
			if (test.withoutInternet) {
				return $http.get('assets/dummy/featured.json');
			} else {
				return $http.get(module.END_POINT + 'GetFeatured' + '?player_br=aim');
			}
		};

		self.getCategories = function() {
			if (test.withoutInternet) {
				return $http.get('assets/dummy/categories.json');
			} else {
				return $http.get(module.END_POINT + 'GetCategories' + '?player_br=aim');
			}
		};

		self.getListFromCategoryId = function(id, filter) {
			var url = module.END_POINT;
			if (filter) {
				filter = 1;
			}

			if (test.withoutInternet) {
				return $http.get('assets/dummy/telenovelas.json');
			} else {
				return $http.get(module.END_POINT + 'GetListFromCategoryId/' + id + '/' + filter + '?player_br=aim');
			}
		};

		self.getUserRecentlyWatched = function() {
			return $http({
				crossDomain: true,
				headers: module.encode(UserInfo.alias, UserInfo.password, UserInfo.session),
				method: 'GET',
				url: module.END_POINT + 'GetUserRecentlyWatched?player_br=aim',
			});
		};

		self.canceler = {};
		self.cancel = function() {
			if(self.canceler.resolve) {
				return self.canceler.resolve();
			}
			return null;
		};

		self.getListFromSearchWithKey = function(keyword) {
			self.canceler = $q.defer;
			console.log('self.canceler', self.canceler);
			return $http.get(module.END_POINT + 'GetListFromSearchWithKey/' + keyword + '?player_br=aim', { timeout: self.canceler });
		};

		self.getProductWithID = function(id, uid) {
			if (!uid || uid === '') {
				uid = '0';
			}

			if (test.withoutInternet) {
				return $http.get('assets/dummy/product.json');
			} else {
				return $http({
					crossDomain: true,
					headers: module.encode(UserInfo.alias, UserInfo.password, UserInfo.session),
					method: 'GET',
					url: module.END_POINT + 'GetProductWithID/' + id + '/' + uid + '?player_br=aim',
				});
			}
		};

		self.addItemToList = function(type, id) {

			if(type === 'Películas') {
				type = 'pelicula';
			} else {
				type = 'produccion';
			}
			return $http({
				crossDomain: true,
				headers: module.encode(UserInfo.alias, UserInfo.password, UserInfo.session),
				method: 'POST',
				url: module.END_POINT + 'my_list/add/' + type + '/' + id,
			});
		};

		self.removeItemToList = function(type, id) {
			return $http({
				crossDomain: true,
				headers: module(UserInfo.alias, UserInfo.password, UserInfo.session),
				method: 'POST',
				url: module.END_POINT + 'my_list/remove/' + type + '/' + id,
			});
		};

		self.getList = function() {
			return $http({
				crossDomain: true,
				headers: module.encode(UserInfo.alias, UserInfo.password, UserInfo.session),
				method: 'GET',
				url: module.END_POINT + 'my_list/get',
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
			if (test.withoutInternet) {
				return $http.get('assets/dummy/validateUserReponse.json');
			} else {
				return $http({
					crossDomain: true,
					headers: module.encode(UserInfo.alias, UserInfo.password, UserInfo.session),
					method: 'GET',
					url: module.END_POINT + 'IsContentAvailableForUser/' + episodeId + '?player_br=aim',
				});
			}
		};

		self.logout = function(username, password, session) {
			return $http({
				crossDomain: true,
				headers: module.encode(username, password, session),
				method: 'GET',
				url: module.END_POINT + 'LogOut?player_br=aim',
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

		self.getVideoRequeriments = function() {
			return $http({
				headers: module.encode(UserInfo.alias, UserInfo.password, UserInfo.session),
				method: 'GET',
				url: module.END_POINT + 'smart-tv/video-requirements'
			});
		};

		self.getHabeasData = function() {
			return $http({
				headers: module.encode(UserInfo.alias, UserInfo.password, UserInfo.session),
				method: 'GET',
				url: module.END_POINT + 'smart-tv/habeas-data'
			});
		};

		self.getTerms = function() {
			return $http({
				headers: module.encode(UserInfo.alias, UserInfo.password, UserInfo.session),
				method: 'GET',
				url: module.END_POINT + 'GetTerms'
			});
		};

		self.createUser = function(name, password, mail, privacyPolicity, termsAndConditions, bussinessInfo) {
			return $http({
				headers: module.encode(true),
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
				headers: module.encode(true),
				method: 'POST',
				data: '',
				url: ssl.END_POINT + 'common/user/token.json',
			});
		};

		self.loginPaymentUser = function(username, password, token) {
			return $http({
				headers: module.encode(true, token),
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

				return {
					then: this.then
				};
			};

			return asyncResponse(function(sucessCallback, errorCallback) {
				var tokenPromise = self.getToken();
				tokenPromise.then(function(response) {
					var token = response.data.token;

					self.loginPaymentUser(username, password, token).then(sucessCallback, errorCallback);
				}, errorCallback);
			});
		};

		self.searchCity = function(city, token) {
			return $http({
				headers: module.encode(true, token),
				method: 'POST',
				url: ssl.END_POINT + 'commerce/payment/cities.json',
				data: JSON.stringify({
					'city': city,
				}),
			});
		};

		self.searchCityFlow = function(city) {
			var asyncResponse = function(makeFunction) {
				this.then = function(success, error) {
					return makeFunction(success, error);
				};

				return {
					then: this.then
				};
			};

			return asyncResponse(function(sucessCallback, errorCallback) {
				var tokenPromise = self.getToken();
				return tokenPromise.then(function(response) {
					var token = response.data.token;

					return self.searchCity(city, token).then(sucessCallback, errorCallback);
				}, errorCallback);
			});
		};

		self.executeTransactionWithCard = function(paymentInfo, token) {
			var encryptedJson = btoa(unescape(encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(paymentInfo)))))));
			return $http({
				headers: module.encode(true, token),
				method: 'POST',
				url: ssl.END_POINT + 'commerce/payment/transaction.json',
				data: JSON.stringify({
					'info_tx': encryptedJson,
				}),
			});
		};

		self.createSubscriptionOrder = function(token) {
			return $http({
				headers: module.encode(true, token),
				method: 'POST',
				data: "",
				url: ssl.END_POINT + 'commerce/payment/order_subscription.json',
			});
		};

		self.createSubscriptionOrderFlow = function() {
			var asyncResponse = function(makeFunction) {
				this.then = function(success, error) {
					return makeFunction(success, error);
				};

				return {
					then: this.then
				};
			};

			return asyncResponse(function(sucessCallback, errorCallback) {
				var tokenPromise = self.getToken();
				return tokenPromise.then(function(response) {
					var token = response.data.token;
					var promise = self.createSubscriptionOrder(token);
					return promise.then(sucessCallback, errorCallback);
				}, errorCallback);
			});
		};

		self.createRentOrder = function(token, nid) {
			return $http({
				headers: module.encode(true, token),
				method: 'POST',
				data: JSON.stringify({
					nid: nid
				}),
				url: ssl.END_POINT + 'commerce/payment/order_rent.json',
			});
		};

		self.createRentOrderFlow = function(nid) {
			var asyncResponse = function(makeFunction) {
				this.then = function(success, error) {
					return makeFunction(success, error);
				};

				return {
					then: this.then
				};
			};

			return asyncResponse(function(sucessCallback, errorCallback) {
				var tokenPromise = self.getToken();
				return tokenPromise.then(function(response) {
					var token = response.data.token;
					var promise = self.createRentOrder(token, nid);
					return promise.then(sucessCallback, errorCallback);
				}, errorCallback);
			});
		};

		self.executeTransactionWithCardFlow = function(paymentInfo) {
			var asyncResponse = function(makeFunction) {
				this.then = function(success, error) {
					return makeFunction(success, error);
				};

				return {
					then: this.then
				};
			};

			return asyncResponse(function(sucessCallback, errorCallback) {
				var tokenPromise = self.getToken();
				return tokenPromise.then(function(response) {
					var token = response.data.token;
					var promise = self.executeTransactionWithCard(paymentInfo, token);
					return promise.then(sucessCallback, errorCallback);
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

	app.service('ProductService', ['$http', 'UserInfo', '$q', ProductService]);
	app.service('UserService', ['$http', 'UserInfo', UserService]);
	app.service('PurchaseService', ['$http', 'UserInfo', PurchaseService]);

}(angular.module("caracolplaylgtvapp.ServerCommunicator", [
	'ui.router'
])));