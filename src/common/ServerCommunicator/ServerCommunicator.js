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

	app.service('ProductService',['$http', ProductService]);
	app.service('UserService', ['$http', UserService]);

} (angular.module("caracolplaylgtvapp.ServerCommunicator", [
	'ui.router'
])));