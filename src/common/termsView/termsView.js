(function(module) {
  var TermsViewService = function($modal) {
		var self = this;
		self.modalInstance = {};

		self.show = function(title, message) {
			self.modalInstance = $modal.open({
				controller: 'TermsViewDialogController',
				templateUrl: 'termsView/termsView.tpl.html',
				size: 'lg',
				resolve: {
					termsInfo: function() {
						return {
							'title': title,
							'message': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam repellendus ut ab neque, voluptatem assumenda omnis, explicabo voluptatum quas repellat odit eum veniam minus, excepturi itaque, ea nemo rerum. Rerum similique eius non velit a quibusdam laboriosam odit saepe incidunt mollitia praesentium animi exercitationem iusto dolor placeat beatae cupiditate, fuga nobis nisi ullam, quam excepturi eos maxime eveniet tenetur. Impedit repudiandae magni, natus cum tempora corporis, dolorem velit molestias distinctio nobis. Tempora, enim rerum harum architecto dolores dolorem est nobis tempore natus, adipisci numquam delectus, tenetur esse. Aperiam quia, illum quibusdam odit sint fuga, temporibus cupiditate incidunt vitae quo beatae delectus! Accusamus ad in, error fuga nulla facere recusandae inventore, quod nemo a sequi eaque quos temporibus. Maxime, porro. Modi minima sed totam suscipit provident explicabo, dicta alias aspernatur vitae non ratione vero molestiae veritatis tempore voluptate. Autem voluptates tempore fugit consectetur accusamus odit reiciendis consequatur commodi repellendus, amet praesentium assumenda? Possimus pariatur ducimus repudiandae deserunt facere, accusantium culpa eum inventore. Exercitationem sapiente esse, a, consequatur, ipsam quas dolorem alias enim quisquam saepe molestiae accusantium, nihil numquam doloremque minus inventore quibusdam totam. Ex, eaque officiis magnam illo incidunt quibusdam temporibus nulla ducimus! Dolore, sunt, sit. Nesciunt possimus dolores magni consectetur ipsam similique adipisci optio. Enim vel animi unde itaque quae nostrum quos, explicabo dolor commodi laboriosam voluptatibus dolorum voluptates aut ipsa pariatur temporibus rem est et quia nesciunt molestiae, numquam? Animi inventore, fugiat nam explicabo impedit, obcaecati, culpa harum sunt perspiciatis maiores, eligendi. Rem impedit, ipsam aspernatur reiciendis molestias velit similique dolorum totam dolore, porro aliquid ad eius assumenda? Repellat quo neque possimus ullam vitae fugiat eligendi, impedit quaerat blanditiis illum culpa doloremque cupiditate, necessitatibus earum nulla perspiciatis ipsa similique qui ab enim tempora eum maxime minima a. Nesciunt deserunt impedit itaque beatae porro tempore veniam tenetur, voluptates numquam. Itaque maxime vero minima et autem quos omnis qui. Perspiciatis assumenda esse cupiditate inventore dolore magnam, repellendus doloribus velit minus consequuntur aliquid error dignissimos corrupti sint iusto reprehenderit praesentium a! Possimus totam fuga, eveniet magnam veritatis exercitationem natus placeat aspernatur, sed cumque accusamus quasi a odio excepturi tempora sapiente unde dicta explicabo. Dolorem culpa dolores officiis laudantium quas ut sunt dolor, et incidunt voluptas debitis laboriosam, cum, delectus magni repellendus facere autem doloremque nostrum accusantium ipsam eveniet dignissimos natus eum fugit? Sunt totam voluptas ipsam tempora placeat libero numquam, culpa nulla obcaecati quis ratione unde distinctio nam mollitia! Sequi debitis, rerum illum, corporis mollitia, quo sint neque minus fugiat qui maxime esse earum et. Voluptate animi a autem perferendis eius sint error eveniet optio suscipit, harum earum, quasi. Sit ad molestiae quae iusto harum illo reiciendis hic suscipit, repudiandae, consequatur blanditiis aliquid eligendi alias maxime eum officiis, adipisci expedita ea unde voluptatibus voluptas cumque. Minus debitis rerum quod porro odit quisquam soluta tenetur, magni, dolorem repellendus rem quaerat provident, ipsa distinctio maiores excepturi a amet eum. Maiores delectus laborum asperiores natus quam fugit iusto nesciunt fuga deleniti, modi, eum saepe libero eligendi ut accusamus ipsa amet necessitatibus reiciendis corporis quod iure quibusdam. Debitis ipsa ratione voluptas quibusdam consectetur laboriosam voluptatum fugiat iste incidunt, officiis expedita laborum, nihil pariatur ex dicta veritatis. Amet dolorem nostrum eligendi facere nesciunt quae placeat vitae at sint rem, veritatis ratione eveniet doloremque facilis odio quos, hic itaque voluptatum illo ut molestiae. Facere labore ad enim veniam earum tempore et. Minima cumque eos quod illum incidunt commodi iure deleniti quaerat, odio natus doloribus sed provident aliquam sequi inventore ab voluptate, pariatur, optio itaque assumenda ullam quibusdam sint nemo corrupti beatae. Illo nemo iusto aspernatur magnam. Dicta facere est dolorum quaerat unde, omnis quae mollitia quisquam quos ullam nihil nisi veniam laudantium consectetur eaque, consequatur obcaecati amet alias porro. Incidunt laboriosam possimus consectetur quas quo necessitatibus, facere rerum minus, officiis laudantium, earum. Consequatur quibusdam culpa accusantium, ipsa dolorem et, deleniti, voluptas nisi in fugiat a omnis. Obcaecati odit, harum possimus temporibus accusantium ducimus maxime minima blanditiis. Aliquam, animi corporis temporibus aperiam itaque, tenetur fugiat ullam tempora aliquid architecto sint consequuntur veniam? Dicta facere ut, quasi cumque amet adipisci. Aliquid officia eaque est magni culpa quidem sit illo quia illum libero id cupiditate, at tempora aspernatur fugiat dolore ab tempore repellendus dicta labore quibusdam quo voluptatibus. Animi debitis sit, temporibus inventore totam alias. Quos esse corporis, ullam mollitia earum perferendis minima, nemo quidem praesentium perspiciatis doloribus ipsam distinctio eius unde itaque vitae fugiat molestiae sit, soluta reprehenderit omnis sint facere. Voluptatibus, pariatur, earum tempore unde laudantium aperiam. Neque aliquid alias atque eius vitae saepe minima laboriosam, corporis voluptatibus esse, fuga excepturi quo fugit assumenda explicabo autem nostrum ipsa. Ratione aut neque harum quidem, deleniti cum hic velit dolor odit sit quis ipsa qui suscipit cumque ducimus, eum adipisci delectus. Possimus sit cum, debitis deleniti assumenda. Quasi nemo dolor consequuntur minus corporis modi laborum fugit vel harum, minima! Et sapiente voluptas id temporibus rem aliquam distinctio, magnam aspernatur quibusdam vero maxime esse, rerum voluptatem nisi obcaecati alias ab velit provident a possimus. In rem ipsa eveniet distinctio debitis, corporis, est neque, commodi vel maxime vitae quidem reiciendis! Assumenda autem ut labore cupiditate voluptatum magnam impedit, eum, beatae, officia eos maiores veritatis, consequuntur consequatur unde quia nobis veniam necessitatibus saepe earum. Aut, quos fuga sit asperiores! Architecto impedit eaque quis molestias quos nisi officia maxime tempora? Laborum, veritatis? Repellat facilis porro natus qui. Voluptas, dolor assumenda, saepe quaerat veritatis nisi doloremque voluptatem. Sequi ipsam, mollitia. Eligendi architecto adipisci, atque rerum deserunt sunt ab, dolor quaerat voluptatibus, itaque aut molestias consectetur vitae voluptatum laborum similique placeat libero! Corrupti, obcaecati, ut aspernatur a aliquam consequuntur veniam mollitia sit saepe hic, delectus nesciunt minima. Iusto repellendus dicta eveniet nihil vero modi. Harum maiores vero nam ipsam, animi qui veniam earum culpa blanditiis quidem eius eveniet ad aliquid dignissimos mollitia, sunt atque enim hic voluptas commodi perferendis, accusamus corrupti. Tempora inventore sint, hic, officia ab unde incidunt obcaecati sequi, eveniet eum doloremque. Error deserunt, explicabo dolorum, tempore excepturi cumque recusandae iusto saepe quas aspernatur beatae. Excepturi dolorum rem amet, qui architecto perspiciatis saepe fuga molestias!',
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
			TermsViewService.show('Lorem ipsum');
		}
	}]);

	module.service('TermsViewService', ['$modal', TermsViewService]);
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