(function(module) {
  var TermsViewService = function($modal, PurchaseService) {
		var self = this;
		self.modalInstance = {};

		self.showVideoRequeriments = function() {
			var purchasePromise = PurchaseService.getVideoRequeriments();
			purchasePromise.then(function(response) {
				self.show(response.data.titulo, response.data.text);
			}, function(response) {
				response.data = {"titulo":"Requerimientos Video","text":"<div id=\"tab5\"><h2>\u00a1A un paso de dar Play!<\/h2><p class=\"texto1\">Si ya tienes Suscripci\u00f3n, tan solo escoge el t\u00edtulo que te interesa, dale Play y \u00a1listo!<\/p><div class=\"col arriba col_izq\"><p class=\"texto2\">Si te interesa disfrutar de todas nuestras producciones de forma ilimitada durante un a\u00f1o, ent\u00e9rate de c\u00f3mo hacerlo. Para esto, puedes dirigirte a la pesta\u00f1a de \"\u00bfC\u00f3mo Suscribirse?\" de esta secci\u00f3n.<\/p><p>Si todav\u00eda no te decides por la Suscripci\u00f3n, recuerda que puedes <strong>ALQUILAR<\/strong> cada t\u00edtulo por separado. Para saber c\u00f3mo hacerlo puedes ir a la pesta\u00f1a de \"\u00bfC\u00f3mo Alquilar?\"<\/p><\/div><div class=\"col derecha col_der\"><img src=\"\/sites\/all\/themes\/play_theme\/images\/faqs\/dedo_faqs.png\" alt=\"\" \/><div id=\"requisitos\"><h3>Requisitos M\u00ednimos:<\/h3><div class=\"paso1\"><p>Internet de 1.5MB.<\/p><\/div><div class=\"paso2\"><p>Windows (XP, Vista, 7) \/ Mac OS (10.4.11 o superior).<\/p><\/div><div class=\"paso3\"><p>Internet Explorer (8 o superior), Firefox (3 o superior), Safari o Chrome.<\/p><\/div><div class=\"paso4\"><p>Registro en Caracol Play o en nuestra red de portales.<\/p><\/div><\/div><\/div><\/div>"};
				self.show(response.data.titulo, response.data.text);
			});
		};

		self.showHabeasData = function() {
			var purchasePromise = PurchaseService.getHabeasData();
			purchasePromise.then(function(response) {
				self.show(response.data.titulo, response.data.text);
			}, function(response) {
				response.data = {"titulo":"Habeas Data - Smart Tv","text":"<div class=\"habeasdata\"><p>Al hacer click en <strong>[ACEPTO]<\/strong>, usted manifiesta de manera expresa e inequ\u00edvoca que es el leg\u00edtimo Titular de la infomaci\u00f3n proporcionada y que la misma es veraz, completa, exacta, actualizada y verificable.<\/p><p>Del mismo modo, declara de manera libre, expresa, inequ\u00edvoca e informada, que AUTORIZA a ICCK NET S.A.S., sus autorizadas, cesionarias, licenciatarias, filiales y\/o subordinadas, para que, en los t\u00e9rminos de la Ley 1581 de 2012 y su Decreto Reglamentario 1377 de 2013, realice la recolecci\u00f3n, almacenamiento, depuraci\u00f3n, uso, circulaci\u00f3n, actualizaci\u00f3n, supresi\u00f3n, cruce con informaci\u00f3n propia y\/o de terceros autorizados y en general, el tratamiento de sus datos personales y de contacto, informaci\u00f3n sobre preferencias de consumo, y comportamiento en los canales de contacto, para que dicho tratamiento se realice con el prop\u00f3sito de lograr las siguientes finalidades:<\/p><ol><li>Facilitar la correcta ejecuci\u00f3n de las compras y prestaci\u00f3n de los servicios contratados.<\/li><li>Realizar estudios estad\u00edsticos que permitan dise\u00f1ar mejoras en los servicios prestados.<\/li><li>Gestionar tareas b\u00e1sicas de administraci\u00f3n.<\/li><li>Porporcionar y difundir informaci\u00f3n sobre promociones, novedades, productos y servicios actuales y futuros, eventos, concursos, actividades de promoci\u00f3n y otras finalidades comerciales directa o indirectamente relacionadas con el objeto social de CARACOL TELEVISI\u00d3N S.A, ICCK NET S.A.S., y\/o de los propietarios de los portales de internet que administra y\/o promociones, novedades, productos y servicios promovidos directamente por los aliados estrat\u00e9gicos de ICCK NET S.A.S. y CARACOL TELEVISI\u00d3N S.A que les generen valores agregados a los usuarios y\/o clientes<\/li><li>Env\u00edo de material publicitario relacionado con los productos y servicios de CARACOL TELEVISI\u00d3N S.A, ICCK NET S.A.S., y\/o de los propietarios de los portales de internet que administra, sus autorizadas, cesionarias, licenciatarias, filiailes y\/o subordinadas.<\/li><li>Darle cumplimiento a las obligaciones contractuales y\/o legales que CARACOL TELEVISI\u00d3N S.A, ICCK NET S.A.S. y\/o los propietarios de los portales de internet que administra, tengan con sus clientes, empleados, proveedores, autorizadas, cesionarias, licenciatarias,filiales y\/o subordinadas, as\u00ed como con las autoridades judiciales o administrativas.<\/li><li>Realizar estudios estad\u00edsticos, de mercadeo y consumo.<\/li><li>Utilizar la informaci\u00f3n para la preparaci\u00f3n, participaci\u00f3n y desarrollo de concursos.<\/li><li>Analizar y medir la calidad de los productos y servicios ofrecidos por CARACOL TELEVISI\u00d3N S.A, ICCK NET S.A.S. y\/o los propietarios de los portales de internet que administra, sus autorizadas, cesionarias, licenciatarias, filiales y\/o subordinadas.<\/li><li>Ser utilizados por ICCK NET S.A.S. y CARACOL TELEVISI\u00d3N S.A. en el giro ordinario de sus negocios.<\/li><li>Conocer de sus opiniones acerca de un producto o servicio.<\/li><li>Transferir a terceros pa\u00edses la informaci\u00f3n proporcionada.<\/li><\/ol><br \/><br \/><p>Usted declara que se le ha informado de manera clara y comprensible que tiene derecho a conocer, actualizar y rectificar los datos personales proporcionados, a solicitar prueba de \u00e9sta autorizaci\u00f3n, a solicitar informaci\u00f3n sobre el uso que se le ha dado a sus datos personales, a presentar quejas ante la Superintendencia de Industria y Comercio por el uso indebido de los mismos, a revocar \u00e9sta autorizaci\u00f3n o solicitar la supresi\u00f3n de los datos personales suministrados y a acceder de forma gratuita a los mismos.<\/p><p>El usuario declara que conoce y acepta las Pol\u00edticas de privacidad y Manejo de informaci\u00f3n, disponibles en las p\u00e1ginas web:<a href=\"http:\/\/www.caracolplay.com\">www.caracolplay.com<\/a>, <a href=\"http:\/\/www.caracoltv.com\">www.caracoltv.com<\/a>, <a href=\"http:\/\/www.noticiascaracol.com\">www.noticiascaracol.com<\/a>, <a href=\"http:\/\/www.golcaracol.com\">www.golcaracol.com<\/a> y <a href=\"http:\/\/www.bluradio.com\">www.bluradio.com<\/a> que administra ICCK NET S.A.S. Al hacer click en [Acepto], manifiesta que reconoce y acepta que cualquier consulta o reclamaci\u00f3n relacionada con el Tratamiento de sus datos personales podr\u00e1 ser elevada verbalmente o por escrito ante ICCK NET S.A.S., como Responsable del Tratamiento, al correo electr\u00f3nico <a href=\"mailto:info@icck.net\">info@icck.net<\/a>.<\/p><\/div>"};
				self.show(response.data.titulo, response.data.text);
			});
		};

		self.show = function(title, message) {
			self.modalInstance = $modal.open({
				controller: 'TermsViewDialogController',
				templateUrl: 'termsView/termsView.tpl.html',
				size: 'lg',
				resolve: {
					termsInfo: function() {
						return {
							'title': title,
							'message': message,
						};
					},
				},
			});
			
			self.modalInstance.result.then(function() {
				if(onDismiss) {
					onDismiss();
				}
			}, function() {
				if(onDismiss) {
					onDismiss();
				}
			});
		};

		self.dismiss = function() {
			self.dismiss('cancel');
		};
	};

	var TermsViewDialogController = function($scope, $modalInstance, termsInfo, hotkeys, $timeout) {
		init();

		function init() {
			$scope.message = termsInfo.message;
			$scope.title = termsInfo.title;

			$timeout(function() {
				hotkeys.add({
					combo: 'enter',
					callback: function(event) {
						event.preventDefault();

						$modalInstance.dismiss('cancel');
					},
				});
			}, 10);
		}
	};

	module.controller('TermsViewTempController', ['TermsViewService', function(TermsViewService) {
		init();

		function init() {
			TermsViewService.showHabeasData();
		}
	}]);

	module.service('TermsViewService', ['$modal', 'PurchaseService', TermsViewService]);
	module.controller('TermsViewDialogController', ['$scope', '$modalInstance', 'termsInfo', 'hotkeys', '$timeout', TermsViewDialogController]);

	module.config(function ($stateProvider) {
    $stateProvider.state('termsView', {
      url: '/termsview',
        views: {
          "main": {
            controller: 'TermsViewTempController',
            templateUrl: 'termsView/termsView.tpl.html'
          }
        },
      data:{ pageTitle: 'TermsView' }
    });
  });
}(angular.module("caracolplaylgtvapp.termsView", [
    'ui.router'
])));