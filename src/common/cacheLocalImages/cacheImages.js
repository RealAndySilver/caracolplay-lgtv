

var caracolApp = angular.module("caracolplaylgtvapp");

caracolApp.factory('cacheImage',['$rootScope','$http','$sce',function($rootScope,$http,$sce){

    var listImages = []; //listado de imagenes que seran almacenadas en cache
    var blobImages = []; //listado de rutas locales de las imagenes almacenadas
    var defaultImage = "http://premium.icck.net/sites/default/files/blur.jpg";
    var blobDefault = null;

    var findByUrl =function(url){
        for(var i=0; i<listImages.length; i++){
            if(listImages[i] === url){
                return blobImages[i];
            }
        }
        return null;
    };

    var assignProperty = function(obj,property,value){
        if(obj !==  null){
            if(typeof obj[property] === "undefined"){
                obj[property] = value;
            }else{
                obj[property] = value;
            }
        }
    };

    this.cache = function(url,localCache,object, nameProperty){
        object = object || null;
        nameProperty = nameProperty || 'src';
        localCache = localCache || true;

        var localUrl = null;
        if(localCache){
            localUrl = findByUrl(url);
        }
        if(localUrl ===  null){
            $http.get(url,{responseType:'blob'}).success(function(file){
                //alert(file);
                var fileURL = URL.createObjectURL(file);
                listImages.push(url);
                blobImages.push(fileURL);
                assignProperty(object,nameProperty,fileURL);
            }).error(function(error){
                listImages.push(url);
                blobImages.push(blobDefault);
                if(blobDefault ===  null){
                    loadDefaultImage(function(blob){
                        assignProperty(object,nameProperty,blob);
                    });
                }else{
                    assignProperty(object,nameProperty,blobDefault);
                }
            });
        }else{
            assignProperty(object,nameProperty,localUrl);
        }
    };


    var loadDefaultImage = function(callback){
        callback = callback || function(){};
        if(blobDefault === null){
            $http.get(defaultImage,{responseType:'blob'}).success(function(file){
                var fileURL = (URL.createObjectURL(file));
                blobDefault = fileURL;
                callback(blobDefault);
            });
        }
    };

    var init = function(){
        loadDefaultImage();
    };

    init();

    return this;
}]);