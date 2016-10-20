(function (app) {

    var module = this;
    var ssl = {};

    var test = {};

    test.withoutInternet = false;
    
    //module.END_POINT = 'http://apps.caracolplay.com/';
    module.END_POINT = 'http://smarttvdev.caracolplay.com/';
    module.TEST_END_POINT = 'http://192.168.1.129:1414/';

    //ssl.END_POINT = 'http://operacionesplay.icck.net/api/';
    ssl.END_POINT = ' http://dev.caracolplay.com/api/';
    ssl.user = 'icck';
    ssl.password = 'K1qf(w#:';

    module.jsonTransform = function (obj) {
        var str = [];
        for (var p in obj) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
        return str.join("&");
    };

    /**
     * Construye los headers para las peticiones SSL
     * añade el X-CSRF-Token y el Cookie
     * */
    module.getSSLHeaders=function(token,cookie){
        console.log("LOGIN INGO ",token,' ',cookie);
        var headers = {};
        var sslAuth = btoa(unescape(encodeURIComponent(ssl.user + ':' + ssl.password)));
        headers.Authorization = 'Basic ' + sslAuth;
        headers['Content-Type'] = 'application/json; charset=UTF-8';

            //headers['X-CSRF-Token'] = "pyqFTbUmILjJOqkqNOuwq2CjTYrZtxswj_7rmtJFHCg";
        headers['X-CSRF-Token'] = token;
        //headers['Cookie'] =cookie;
        return headers;
    };

    module.encode = function (param1, param2, param3) {
        var headers = {};

        var sslHeaders = false;
        var isWithToken = false,
                needTypeDevice = false,
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

            if (param3 === true) {
                needTypeDevice = true;
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
                //headers['X-CSRF-Token'] = "pyqFTbUmILjJOqkqNOuwq2CjTYrZtxswj_7rmtJFHCg";
                headers['X-CSRF-Token'] = sslToken;
            }
            if (needTypeDevice === true) {
                headers['X-Provider'] = 'Samsung';
            }

        } else {
            var time = new Date();
            var encodeKey = 'aREwKMVVmjA81aea0mVNFh';

            var utc = time.getTime();
            var authWithoutEncode = user + ':' + password + (session === '' ? '' : ':' + session);
            var auth = btoa(unescape(encodeURIComponent(btoa(unescape(encodeURIComponent(authWithoutEncode))))));
            var token = btoa(unescape(encodeURIComponent(utc + encodeKey)));
            var encodeStr = user + ':' + password + (session === '' ? '' : ':' + session);

            headers.auth = auth;
            headers.TS70 = '' + utc;
            headers.token = token;
        }
       // console.log("HEADERS SSL ",headers);
        return headers;
    };

    var ProductService = function ($http, $q,$rootScope) {
        var self = this;

        self.getRecommendationsWithProductID = function (productId) {
            var credentials=$rootScope.getLoginCredentials();
            var sessionInfo=$rootScope.getSessionInfo();
            if (test.withoutInternet) {
                return $http.get('assets/dummy/recommended.json');
            } else {
                return $http({
                    crossDomain: true,
                    headers: module.encode(credentials.username, credentials.password, sessionInfo.session),
                    method: 'GET',
                    url: module.END_POINT + 'GetRecommendationsWithProductID/' + productId + '/?player_br=iam'
                });
            }
        };

        self.updateUserFeedbackForProduct = function (productId, rate) {
            var credentials=$rootScope.getLoginCredentials();
            var sessionInfo=$rootScope.getSessionInfo();
            return $http({
                crossDomain: true,
                headers: module.encode(credentials.username, credentials.password, sessionInfo.session),
                method: 'GET',
                //url: module.END_POINT + 'UpdateUserFeedbackForProduct?player_br=aim/produccion/' + productId + '/' + (rate * 100.0 / 5.0),
                url: module.END_POINT + 'UpdateUserFeedbackForProduct/produccion/' + productId + '/' + (rate * 100.0 / 5.0)
            });
        };

        self.getFeatured = function () {
            if (test.withoutInternet) {
                return $http.get('assets/dummy/featured.json');
            } else {
                return $http.get(module.END_POINT + 'GetFeatured' + '?player_br=aim');
            }
        };

        self.getCategories = function () {
            if (test.withoutInternet) {
                return $http.get('assets/dummy/categories.json');
            } else {
                return $http.get(module.END_POINT + 'GetCategories' + '?player_br=aim');
            }
        };

        self.getListFromCategoryId = function (id, filter) {
            var url = module.END_POINT;
            if (!filter) {
                filter = 1;
            }

            if (test.withoutInternet) {
                return $http.get('assets/dummy/telenovelas.json');
            } else {
                return $http.get(module.END_POINT + 'GetListFromCategoryId/' + id + '/' + filter + '?player_br=aim');
            }
        };

        self.getUserRecentlyWatched = function () {
            var credentials=$rootScope.getLoginCredentials();
            var sessionInfo=$rootScope.getSessionInfo();
            return $http({
                crossDomain: true,
                headers: module.encode(credentials.username, credentials.password, sessionInfo.session),
                method: 'GET',
                url: module.END_POINT + 'GetUserRecentlyWatched?player_br=aim'
            });
        };

        self.canceler = {};
        self.cancel = function () {
            if (self.canceler.resolve) {
                return self.canceler.resolve();
            }
            return null;
        };

        self.getListFromSearchWithKey = function (keyword) {
            self.canceler = $q.defer;
            return $http.get(module.END_POINT + 'GetListFromSearchWithKey/' + keyword + '?player_br=aim', {timeout: self.canceler});
        };

        self.getProductWithID = function (id, uid) {
            var sessionInfo=$rootScope.getSessionInfo();
            var credentials=$rootScope.getLoginCredentials();
            //console.log(id);
            if (!uid || uid === '') {
                uid = '0';
            }

            if (test.withoutInternet) {
                return $http.get('assets/dummy/product.json');
            } else {
                return $http({
                    crossDomain: true,
                    headers: module.encode(credentials.username, credentials.password, sessionInfo.session),
                    method: 'GET',
                    url: module.END_POINT + 'GetProductWithID/' + id + '/' + uid + '?player_br=aim'
                });
            }
        };

        self.addItemToList = function (type, id) {
            var credentials=$rootScope.getLoginCredentials();
            var sessionInfo=$rootScope.getSessionInfo();
            if (type === 'Películas') {
                type = 'pelicula';
            } else {
                type = 'produccion';
            }
            console.log("id -->", id);
            return $http({
                crossDomain: true,
                headers: module.encode(credentials.username, credentials.password, sessionInfo.session),
                method: 'POST',
                url: module.END_POINT + 'my_list/add/' + type + '/' + id
            });
        };

        self.removeItemToList = function (type, id) {
            var credentials=$rootScope.getLoginCredentials();
            var sessionInfo=$rootScope.getSessionInfo();
            if (type === 'Películas') {
                type = 'pelicula';
            } else {
                type = 'produccion';
            }
            return $http({
                crossDomain: true,
                headers: module.encode(credentials.username, credentials.password, sessionInfo.session),
                method: 'POST',
                url: module.END_POINT + 'my_list/remove/' + type + '/' + id
            });
        };

        self.getList = function () {
            var credentials=$rootScope.getLoginCredentials();
            var sessionInfo=$rootScope.getSessionInfo();
            return $http({
                crossDomain: true,
                headers: module.encode(credentials.username, credentials.password, sessionInfo.session),
                method: 'GET',
                url: module.END_POINT + 'my_list/get'
            });
        };
    };

    var UserService = function ($http, AlertDialogService, $state,$rootScope) {
        var self = this;


        self.videoWatched = function (productId, time) {
            var credentials=$rootScope.getLoginCredentials();
            var sessionInfo=$rootScope.getSessionInfo();
            return $http({
                crossDomain: true,
                headers: module.encode(credentials.username, credentials.password, sessionInfo.session),
                method: 'GET',
                url: module.END_POINT + 'VideoWatched/' + productId + '/' + time + '?player_br=aim'
            });
        };

        self.validatePlayerVideo = function (chapterId, productionId, configHotkeys, successCallback, errorCallback) {
            var prom = self.isContentAvailableForUser(chapterId);
            errorCallback = errorCallback || null;
            successCallback = successCallback || null;

            prom.then(function (response) {
                try {
                    console.log("Respuesta del server ",response);
                    if (response.data.status){
                        if (successCallback !== null) {
                            successCallback(response);
                        }
                    }else{
                        if (errorCallback !== null) {
                            errorCallback(response);
                        }
                    }
                } catch (e) {
                    logs.set("videoMessage", e);
                }
            });
        };

        self.isContentAvailableForUser = function (episodeId) {
            var credentials=$rootScope.getLoginCredentials();
            var sessionInfo=$rootScope.getSessionInfo();
            console.log("CREDENTIALS ",credentials);
            console.log("SESSION ",sessionInfo);
            if (test.withoutInternet) {
                return $http.get('assets/dummy/validateUserReponse.json');
            } else {
                return $http({
                    crossDomain: true,
                    headers: module.encode(credentials.username, credentials.password, sessionInfo.session),
                    method: 'GET',
                    url: module.END_POINT + 'IsContentAvailableForUser/' + episodeId + '?player_br=aim'
                });
            }
        };

        self.logout = function (username, password, session) {
            return $http({
                crossDomain: true,
                headers: module.encode(username, password, session),
                method: 'GET',
                url: module.END_POINT + 'LogOut?player_br=aim'
            });
        };

        self.authenticateUser = function (username, password) {
            return $http({
                crossDomain: true,
                headers: module.encode(username, password, ''),
                method: 'GET',
                url: module.END_POINT + 'AuthenticateUser?player_br=aim'
            });
        };

        self.validateUser = function (mail, alias, password) {
            var json = {
                email: mail,
                alias: alias,
                password: password
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

    var PurchaseService = function ($http, $rootScope) {
        var self = this;

        self.getVideoRequeriments = function () {
            var credentials=$rootScope.getLoginCredentials();
            return $http({
                headers: module.encode(credentials.username, credentials.password, sessionInfo.session),
                method: 'GET',
                url: module.END_POINT + 'smart-tv/video-requirements'
            });
        };

        self.getHabeasData = function () {
            //var credentials=$rootScope.getLoginCredentials();
            return $http({
               // headers: module.encode(credentials.username, credentials.password, sessionInfo.session),
                method: 'GET',
                url: module.END_POINT + 'smart-tv/habeas-data'
            });
        };

        self.getTerms = function () {
            //var credentials=$rootScope.getLoginCredentials();
            return $http({
                //headers: module.encode(credentials.username, credentials.password, sessionInfo.session),
                method: 'GET',
                url: module.END_POINT + 'GetTerms'
            });
        };

        self.createUser = function (name, password, mail, first_name, last_name, privacyPolicity, termsAndConditions, bussinessInfo) {
            //console.log(first_name,last_name);
            return $http({
                headers: module.encode(true),
                method: 'POST',
                url: ssl.END_POINT + 'common/commerce/user.json',
                data: JSON.stringify({
                    'name': name,
                    'pass': password,
                    'mail': mail,
                    'first_name': first_name,
                    'last_name': last_name,
                    'privacy_policy': privacyPolicity ? 1 : 0,
                    'terms_and_conditions': termsAndConditions ? 1 : 0,
                    'business_inf': bussinessInfo ? 1 : 0
                })
            });
        };

        self.getToken = function () {
            var headers =module.encode(true);
            console.log("HEADERS GET TOKEN ",headers);
            return $http({
                headers: headers,
                method: 'POST',
                data: '',
                url: ssl.END_POINT + 'common/user/token.json'
            });
        };

        self.loginPaymentUser = function (username, password, token) {
            console.log("DATA USER ",JSON.stringify({
                'username': username,
                'password': password
            }));
            return $http({
                headers: module.encode(true, token),
                method: 'POST',
                url: ssl.END_POINT + 'common/user/login.json',
                data: JSON.stringify({
                    'username': username,
                    'password': password
                })
            });
        };

        self.loginPaymentUserFlow = function (username, password) {
            console.log("USERNAME ",username," PASWD ",password);
            var asyncResponse = function (makeFunction) {
                this.then = function (success, error) {
                    makeFunction(success, error);
                };

                return {
                    then: this.then
                };
            };

            return asyncResponse(function (sucessCallback, errorCallback) {
                var tokenPromise = self.getToken();
                tokenPromise.then(function (response) {
                    var token = response.data.token;

                    self.loginPaymentUser(username, password, token).then(sucessCallback, errorCallback);
                }, errorCallback);
            });
        };

        self.searchCity = function (city, token) {
            return $http({
                headers: module.encode(true, token),
                method: 'POST',
                url: ssl.END_POINT + 'commerce/payment/cities.json',
                data: JSON.stringify({
                    'city': city
                })
            });
        };

        self.searchCityFlow = function (city) {
            var asyncResponse = function (makeFunction) {
                this.then = function (success, error) {
                    return makeFunction(success, error);
                };

                return {
                    then: this.then
                };
            };

            return asyncResponse(function (sucessCallback, errorCallback) {
                var tokenPromise = self.getToken();
                return tokenPromise.then(function (response) {
                    var token = response.data.token;

                    return self.searchCity(city, token).then(sucessCallback, errorCallback);
                }, errorCallback);
            });
        };

        self.executeTransactionWithCard = function (paymentInfo, token) {

            console.log("EN EXECUTE ",paymentInfo);
            var tempHEaders=module.getSSLHeaders(token,null);
            console.log('HEADERS ',tempHEaders);
            var encryptedJson = btoa(unescape(encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(paymentInfo)))))));
            return $http({
                headers: tempHEaders,
                method: 'POST',
                url: ssl.END_POINT + 'commerce/payment/transaction.json',
                data: JSON.stringify({
                    'info_tx': encryptedJson
                })
            });
        };

        self.createSubscriptionOrder = function (token,cookie) {
            var headers = module.getSSLHeaders(token,cookie);
            console.log(headers.Authorization + " <--");
            //delete headers.Authorization;
            console.log(headers);
            console.log("");
            console.log(ssl.END_POINT);
            console.log("");
            return $http({
                headers: headers,
                method: 'POST',
                data: '',
                url: ssl.END_POINT + 'commerce/payment/order_subscription.json'
            });
        };

        self.createSubscriptionOrderFlow = function (cookie) {
            var asyncResponse = function (makeFunction) {
                this.then = function (success, error) {
                    return makeFunction(success, error);
                };

                return {
                    then: this.then
                };
            };

            return asyncResponse(function (sucessCallback, errorCallback) {
                var tokenPromise = self.getToken();
                return tokenPromise.then(function (response) {
                    console.log("ASYNCRESPONSE",response);
                    var token = response.data.token;
                    var promise = self.createSubscriptionOrder(token,cookie);
                    return promise.then(sucessCallback, errorCallback);
                }, errorCallback);
            });
        };

        self.createRentOrder = function (token, nid) {
            return $http({
                headers: module.encode(true, token, false),
                method: 'POST',
                data: JSON.stringify({
                    nid: nid
                }),
                url: ssl.END_POINT + 'commerce/payment/order_rent.json'
            });
        };

        self.createRentOrderFlow = function (nid) {
            var asyncResponse = function (makeFunction) {
                this.then = function (success, error) {
                    return makeFunction(success, error);
                };

                return {
                    then: this.then
                };
            };

            return asyncResponse(function (sucessCallback, errorCallback) {
                var tokenPromise = self.getToken();
                return tokenPromise.then(function (response) {
                    var token = response.data.token;
                    var promise = self.createRentOrder(token, nid);
                    return promise.then(sucessCallback, errorCallback);
                }, errorCallback);
            });
        };

        self.executeTransactionWithCardFlow = function (paymentInfo) {
            var asyncResponse = function (makeFunction) {
                this.then = function (success, error) {
                    return makeFunction(success, error);
                };

                return {
                    then: this.then
                };
            };

            return asyncResponse(function (sucessCallback, errorCallback) {
                var tokenPromise = self.getToken();
                return tokenPromise.then(function (response) {
                    var token = response.data.token;
                    console.log("RESPONSE DE CARD FLOW ",response);
                    var promise = self.executeTransactionWithCard(paymentInfo, token);
                    return promise.then(sucessCallback, errorCallback);
                }, errorCallback);
            });
        };

        self.getProduct = function (id, type, action) {
            var credentials=$rootScope.getLoginCredentials();
            return $http({
                crossDomain: true,
                headers: module.encode(credentials.username, credentials.password, sessionInfo.session),
                method: 'POST',
                data: {
                    'Id': id,
                    'Type': type,
                    'Action': action
                },
                url: module.END_POINT + 'Get_Product?player_br=aim'
            });
        };

        self.createOrder = function (productId, userId) {
            var credentials=$rootScope.getLoginCredentials();
            return $http({
                crossDomain: true,
                method: 'POST',
                headers: module.encode(credentials.username, credentials.password, sessionInfo.session),
                data: {
                    'Id_Producto': productId,
                    'Id_user': userId
                },
                url: module.END_POINT + 'Create_Order?player_br=aim'
            });
        };

        self.payment = function (orderId, userId, tokenCard, expirationDate, cvv, recurrence) {
            var credentials=$rootScope.getLoginCredentials();
            return $http({
                crossDomain: true,
                method: 'POST',
                headers: module.encode(credentials.username, credentials.password, sessionInfo.session),
                data: {
                    'Id_Order': orderId,
                    'Id_User': userId,
                    'Token_card': tokenCard,
                    'Exp_Date': expirationDate,
                    'CVV': cvv,
                    'Recurrencia': recurrence
                },
                url: module.END_POINT + 'Payment?player_br=aim'
            });
        };

        self.validateCode = function (code) {
            return $http({
                crossDomain: true,
                method: 'GET',
                url: module.END_POINT + 'ValidateCode/' + code + '?player_br=aim'
            });
        };

        self.redeemCode = function (code, userObj) {
            var obj = {
                name: userObj.name,
                lastname: userObj.lastname,
                alias: userObj.alias,
                email: userObj.email,
                password: userObj.password,
                genero: userObj.genero,
                fecha_de_nacimiento: userObj.fecha_de_nacimiento
            };
            var encodedJson = btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
            return $http({
                method: 'POST',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                transformRequest: module.jsonTransform,
                url: module.END_POINT + 'RedeemCode/' + code,
                data: {
                    user_info: encodedJson
                }
            });
        };

        self.test = function () {
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

    app.service('ProductService', ['$http','$q','$rootScope', ProductService]);
    app.service('UserService', ['$http', 'AlertDialogService', '$state','$rootScope', UserService]);
    app.service('PurchaseService', ['$http', '$rootScope', PurchaseService]);

}(angular.module("caracolplaylgtvapp.ServerCommunicator", [
    'ui.router'
])));