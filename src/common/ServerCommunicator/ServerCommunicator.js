(function(app) {
	
	var ProductService =  function($http) {
		var self = this;
		self.END_POINT = 'http://apps.caracolplay.com/';

		self.getFeatured = function() {
			return $http.get(self.END_POINT + 'GetFeatured');
		};

		self.getCategories = function() {
			return $http.get(self.END_POINT + 'GetCategories');
		};

		self.getListFromCategoryId = function(id, filter) {
			var url = self.END_POINT;
			if(filter) {
				filter = 1;
			}
			
			return $http.get(self.END_POINT + 'GetListFromCategoryId/' + id + '/' + filter);
		};

		self.getProductWithID = function(id, uid) {
			if(!uid || uid === '') {
				uid = '0';
			}

			var encode = function() {
				var user = '', password = '', session = '';
				var time = new Date().getTime();
				var encodeKey = 'aREwKMVVmjA81aea0mVNFh';

				var auth = window.btoa(window.btoa(user + ':' + password + ':' + session));

				var token = window.btoa(time + encodeKey);

				return {
					auth: auth,
					TS70: time,
					token: token,
				};
			};

			return $http({
				headers: encode(),
				method: 'GET',
				url: self.END_POINT + 'GetProductWithID/' + id + '/' + uid,
			});
		};
	};

	app.service('ProductService',['$http', ProductService]);

} (angular.module("caracolplaylgtvapp.ServerCommunicator", [
	'ui.router'
])));