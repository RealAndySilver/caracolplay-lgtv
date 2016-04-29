
var caracolApp = angular.module("caracolplaylgtvapp");

caracolApp.factory('RegisterUserService',['$rootScope','UserInfo',function($rootScope,UserInfo){

    this.saveUserInfo = function(alias,password,mail,uid,name,lastname,birthDate,gender){
        birthDate = birthDate || null;
        gender = gender || null;

        UserInfo.alias = alias;
        UserInfo.password = password;
        UserInfo.mail = mail;
        UserInfo.uid = uid;
        UserInfo.name = name;
        UserInfo.lastname = lastname;
        UserInfo.birthDate = birthDate;
        UserInfo.gender = gender;
        localStorage.setItem('userInfo', JSON.stringify(UserInfo));
    };

    //this.register = function(user,password,email,name,lastname,politics,terms,information,options){
    //
    //};

    return this;
}]);