(function(module) {
	module.config(function($stateProvider) {
		$stateProvider.state('videoModule', {
			url: '/videomodule/:chapterId/:productionId/:brightcoveId',
			views: {
				"main": {
					controller: 'VideoModuleController as model',
					templateUrl: 'videoModule/videoModule.tpl.html'
				}
			},
			resolve: {
				itemSelected: ['$stateParams', 'ProductService','UserInfo', function($stateParams, ProductService,UserInfo) {
					var uid = 0;
					if(UserInfo.uid !== undefined && UserInfo.uid !== ''){
						uid = UserInfo.uid;
					}
					var promiseProduct = ProductService.getProductWithID($stateParams.productionId,uid);

					return promiseProduct.then(function(response) {
						console.log(response);
						if (response.data.length !== 0) {
							response.data.products['0'][0].productId = $stateParams.productId;
							return response.data.products['0'][0];
						}
						return [];
					});
				}]
			},
			data: {
				pageTitle: 'VideoModule'
			}
		});
	});

	function VideoModuleController($scope, $timeout, ProductService, UserInfo, itemSelected, hotkeys, $state, AlertDialogService, DevInfo,$stateParams,$location) {
		var model = this;
		$scope.selected = itemSelected;
		$scope.productId = itemSelected.id;
		$scope.itemSelected = {};
		$scope.hasFinished=false;

		init();
		keyboardInit();

		$scope.isRecomendents = false;
		$scope.optionSelected = 0;
		$scope.recomendentsSelected = 0;

		$scope.keyboardInit = keyboardInit;

		function keyboardInit() {
			var redButtonCallback = function() {
				$state.reload();
			};

			hotkeys.add({
				combo: 'red',
				callback: redButtonCallback
			});

			if (DevInfo.isInDev) {
				hotkeys.add({
					combo: 'r',
					callback: redButtonCallback
				});
			}

			hotkeys.add({
				combo: 'up',
				callback: function(event) {
					event.preventDefault();

					if ($scope.isRecomendents) {
						$scope.isRecomendents = false;
					} else {
						if ($scope.optionSelected - 1 > -1) {
							$scope.options[$scope.optionSelected--].active = false;
							$scope.options[$scope.optionSelected].active = true;
						}
					}
				}
			});

			hotkeys.add({
				combo: 'down',
				callback: function(event) {
					event.preventDefault();

					if ($scope.optionSelected + 1 < 4) {
						$scope.options[$scope.optionSelected++].active = false;
						$scope.options[$scope.optionSelected].active = true;
					} else {
						$scope.options[$scope.optionSelected].active = false;
						$scope.isRecomendents = true;
					}
				},
			});

			hotkeys.add({
				combo: 'enter',
				callback: function(event) {
					if(!$scope.streamingComplete){
						if (model.video.isPlaying()) {
							model.handlePauseFunction(event);
						}else{
							model.handlePlayFunction(event);
						}
						return;
					}
					switch ($scope.options[$scope.optionSelected].label) {
						case 'Calificar':
							$state.go('rate', {
								'productId': $scope.selected.id,
								'rate': $scope.selected.rate,
								'type': $scope.selected.type
							});
							break;
						case 'Ver Tráiler':
							$state.go('videoModule', {
								productId: $scope.id
							});
							break;
						case 'Añadir a mi lista':
							AlertDialogService.show(
								'warning',
								'Add to list',
								'Aceptar',
								keyboardInit
							);
							break;
						case 'Volver al catálogo':
							$state.go('dashboard');
							break;
					}
				}
			});

			hotkeys.add({
				combo: 'right',
				callback: function() {

				}
			});

			hotkeys.add({
				combo: 'left',
				callback: function() {

				}
			});
		}

		$scope.$watch('isRecomendents', function(newValue) {
			if (newValue) {
				$scope.options[0].active = false;
				$scope.recomendents[0].active = true;
			} else {
				$scope.options[$scope.optionSelected].active = true;
				if ($scope.recomendents) {
					$scope.recomendents[0].active = false;
				}
				keyboardInit();
			}
		});

		function init() {
			$scope.streamingComplete = false;

			$scope.options = [{
				label: 'Calificar',
				active: true
			}, {
				label: 'Ver Tráiler',
				active: false
			}, {
				label: 'Añadir a mi lista',
				active: false
			}, {
				label: 'Volver al catálogo',
				active: false
			}, ];

			var promise = ProductService.getRecommendationsWithProductID($scope.productId);
			promise.then(function(response) {
				$scope.recomendents = response.data.recommended_products.map(function(data) {
					return data.product;
				});
			});


			//LOGICA PLAYER
            
            //funcio para mostrar los votones de el video
            model.showbuttons = function (){
                console.log("entro en el over ")
                model.displayControls();
                setTimeout(function () {
                        model.hideControls()
                }, 3000);
            };
            
			model.timeoutId=0;
			model.videoProgress = false;
			model.controls = {};
			model.body = $(document.body);
			model.player = $("#player");
			model.video = new VideoPlayer($("#bc-video"), null);
			model.controls.main = $("#bc-controls");
			model.controls.back = $("#bc-back");
			model.controls.background = $("#bc-controls-background");
			model.controls.progressHolder = $("#bc-progress-holder");
			model.controls.playProgress = $("#bc-play-progress");
			model.controls.loadProgress = $("#bc-load-progress");
			model.controls.timeControl = $("#bc-time-control");
			model.controls.playIndicator = $("#bc-play-indicator");
			model.controls.videoTitle = $("#bc-video-title");
			model.controls.buttons = $("#bc-buttons");
			model.controls.playControl = $("#bc-play-control");
			model.controls.infoControl = $("#bc-info-control");
			model.controls.rwControl = $("#bc-rw-control");
			model.controls.ffControl = $("#bc-ff-control");
			model.controls.browseControl = $("#bc-browse-control");
			model.controls.qmenuControl = $("#bc-qmenu-control");

			// update any localized copy
			model.controls.playIndicator.html(LG.copy['now_playing'][LG.config.lang]);
			model.controls.browseControl.html(LG.copy['browse_button'][LG.config.lang]);
			model.controls.qmenuControl.html(LG.copy['q_menu_button'][LG.config.lang]);


			//inicializa botones
			// fast forward button
			model.controls.ffControl.bind("click", function(event) {
				window.alert('ENTRO');
				event.stopPropagation();
				window.alert('ENTRO 1');
				clearTimeout(model.timeoutId);
				window.alert('ENTRO 2');
				model.video.fastForward();
				window.alert('ENTRO 3');
			});

			model.controls.rwControl.bind("click", function(event) {
				event.stopPropagation();
				clearTimeout(model.timeoutId);
				model.video.rewind();
			});

			// play button
			model.controls.playControl.bind("click", function(event) {
				event.stopPropagation();
				clearTimeout(model.timeoutId);
				model.controls.playControl.toggleClass("pause", !model.controls.playControl.hasClass("pause"));
				model.video[ model.video.isPlaying() ? "pause" : "play" ]();
			});

			// info button
			model.controls.infoControl.bind("click", function(event) {
				event.stopPropagation();
				//toggleInfo(true);
			});

			// preload images that won't appear immediately
			$("<img />")
				.attr("src", "assets/img/player/close-hover.png")
				.attr("src", "assets/img/player/back-hover.png")
				.attr("src", "assets/img/player/arrow-right-hover.png")
				.attr("src", "assets/img/player/arrow-left-hover.png")
				.attr("src", "assets/img/player/arrow-up-hover.png")
				.attr("src", "assets/img/player/arrow-down-hover.png")
				.attr("src", "assets/img/player/button-right-hover.png")
				.attr("src", "assets/img/player/button-left-hover.png")
				.attr("src", "assets/img/player/tab-active-background.png")
				.attr("src", "assets/img/player/tab-active-background-active.png")
				.attr("src", "assets/img/player/tab-active-background-right-active.png")
				.attr("src", "assets/img/player/tab-active-background-left-active.png")
				.attr("src", "assets/img/player/tab-inactive-hover.png")
				.attr("src", "assets/img/player/play.png")
				.attr("src", "assets/img/player/controls-browse-hover.png")
				.attr("src", "assets/img/player/controls-info-hover.png")
				.attr("src", "assets/img/player/controls-pause-hover.png")
				.attr("src", "assets/img/player/controls-play-hover.png")
				.attr("src", "assets/img/player/controls-qmenu-hover.png")
				.attr("src", "assets/img/player/controls-ff-hover.png")
				.attr("src", "assets/img/player/controls-rw-hover.png");


			model.hideControls=function() {
				clearTimeout(model.timeoutId);
				model.controls.background.hide();
				model.controls.main.hide();
				model.controls.back.hide();
			};

			model.hideControlsTimeout=function(){
				model.timeoutId = setTimeout(function(){
					model.hideControls();
					//LG.isNative && window.NetCastMouseOff(0);
				}, 8000);
			};



			model.displayControls= function (hideAfterDelay) {
				clearTimeout(model.timeoutId);
				if(state.get() === "video") {
					model.controls.main.show();
					model.controls.back.show();
					model.controls.background.show();

					if (hideAfterDelay) {
						//TEMPORAL SE QUTA PARA PODER PROBAR CONTROLES
						model.hideControlsTimeout();
					}
				}
			};

			model.updateVideoControls=function() {
				var position = model.video.getVideoPosition();
				var duration = model.video.getVideoDuration();
				var percent = Math.min(position/duration, 1);
				var width = Math.round(model.controls.progressHolder.width() * percent);
				model.controls.playProgress.width(width);
				model.controls.timeControl.html(convertTime(position) + " / " + convertTime(duration));
			};

			model.handleProgressFunction=function (event) {
				if( !model.videoProgress ) {
					model.displayControls(true);
					model.videoProgress = true;
					//spinner.hide();
					//spinner.removeClass("animate");
				}
				model.updateVideoControls();
			};

			model.hideNavOverVideo=function() {
				//model.overlay.hide();
				//main.hide();
				model.controls.main.removeClass("mini");
				model.controls.back.show();
				model.controls.background.show();
				model.updateVideoControls();
				model.displayControls(true);
				//$(":focus").blur();
			};

			model.handleCompleteFunction=function(){
				if(model.video.seekState != null ) {
					return;
				}
				model.hidePlayer();
                console.log("entro en el final del video");
                $location.path("/preview/dashboard");
				//state.change("main");
				$scope.streamingComplete=true;
				$scope.$apply();
				//$scope.videoCss = 'video-container-ended';
			};

			model.handleFastForwardFunction=function(){
				if(event.position === 0) {
					video.stop();
					model.updateVideoControls();
				}
			};

			model.handleRewindFunction=function(){
				if(event.position === 0) {
					video.stop();
					model.updateVideoControls();
				}
			};

			model.hidePlayer=function () {
				model.player.hide();
				model.hideControls();
				//overlay.hide();
				//main.show();
				//focusActiveSlide();
			};

			model.handleErrorFunction=function(event, data) {
				var currState = state.get();

				if( currState === "video" && state.previous(3) === "info" ) {
					//toggleInfo(true);
					video.play();
				} else {
					model.hidePlayer();
				}
				AlertDialogService.show('warning',
					LG.copy['video_error'][LG.config.lang],'Aceptar', function () {keyboardInit();});
			};

			model.handlePlayFunction=function(event) {
				model.controls.playControl.addClass("pause");
				model.displayControls(true);
			};

			model.handlePauseFunction=function(event) {
				model.controls.playControl.removeClass("pause");
				model.displayControls();
			};

			model.handleBeforeLoadFunction = function(event) {
				$('#mydiv').show();
			};

			model.handleLoadFunction = function(event, video) {
				$('#mydiv').hide();
				/*//var popup = infoWindows[ video.id ];
					updateVideoControls();
					controls.videoTitle.html(video.name);

				if(popup) {
				popup.show();
				} else {
				infoWindows[ video.id ] = new LG.Info( video );
				}*/
			};

			model.handleKeydown =function (event) {
				var currState = state.get();

				switch (event.keyCode) {
					case 38: // up
					case 40: //down
						if( currState === "video" ) {
							model.displayControls();
						}
						//handleKeyMovement( event.which );
						break;
					case 37: // left
                        console.log("entro en el izquierdo");
                        model.controls.ffControl = $("#bc-ff-control");
                        break
					case 39: // right
						if( currState === "video" ) {
							model.displayControls();
						}
						//handleKeyMovement( event.which );
						break;
					case 66: // b
					case 83: // s
					case 461: // back
					case 413: // stop
						if (currState === "video") {
							if(model.video.isAdPlaying()) {
								model.video.clearAd(); // clear the setting of current playing ad.
								model.video.handleComplete();
							}
							model.video.stop();
							model.hidePlayer();
							state.change("main");
						} /*else if(currState === "main") {
					LG.isNative && window.NetCastBack();
					} else if(currState === "error" ) {
					//model.handleBackButton();
					}*/
						break;
					case 13: // enter
						//handleEnter(event);
						break;
					case 412: // rewind
						if (model.video.isAdPlaying()) {
							return;
						}
						model.video.rewind();
						break;
					case 417: //fast forward
						if (model.video.isAdPlaying()){
							return;
						}
						model.video.fastForward();
						break;
					case 80: // p
						if (model.video.isAdPlaying()){
							return;
						}
						if (model.video.isPlaying()) {
							pause();
						} else {
							play();
						}
						break;
					case 79: // o
						clearTimeout(timeoutId);
						if( state.get() !== "video" ) {
							return;
						}
						if(model.controls.main.is(":visible") ) {
							model.hideControls();
						} else {
							model.displayControls();
						}
						break;
					case 415: // play
						play();
						break;
					case 19: // pause
						pause();
						break;
					case 73: // i
					case 457: // info
						if (video.isAdPlaying()){
							return;
						}
						if (player.is(":visible")) {
							//toggleInfo();
						}
						break;
				}
			};


			model.adjustPLayerSize=function(){
				$("#player, #media, #bc-video, #video-container, #bc-controls-background").css({"width": "100%", "height": "100%"});
				$("#bc-controls, #bc-load-progress, #bc-play-progress").css({"width": "100%"});
			};

			model.playVideo=function(pVideo) {
				model.adjustPLayerSize();
				// short circuit if there's already a video playing, and that video
				// is the same video the user is attempting to play.
				if (model.video.getCurrentVideo() && model.video.getCurrentVideo() !== undefined && model.video.isPlaying() && pVideo.id === video.getCurrentVideo().id) {
					return;
				}

				model.videoProgress = true;
				model.controls.main.hide();
				model.controls.playProgress.width(0);
				model.controls.timeControl.html("00:00 / 00:00");
				model.hideNavOverVideo();
				model.hideControls();
				model.controls.back.hide();
				model.player.show();
				state.change("video");
				console.log("PVIDEO ",pVideo);
				model.video.loadVideo(pVideo.id);
			};

			model.video.addEventListener("progress", model.handleProgressFunction);
			model.video.addEventListener("complete", model.handleCompleteFunction);
			model.video.addEventListener("fastForward", model.handleFastForwardFunction);
			model.video.addEventListener("rewind", model.handleRewindFunction);
			model.video.addEventListener("error", model.handleErrorFunction);
			model.video.addEventListener("play", model.handlePlayFunction);
			model.video.addEventListener("pause", model.handlePauseFunction);
			model.video.addEventListener("beforeload", model.handleBeforeLoadFunction);
			model.video.addEventListener("load", model.handleLoadFunction);

			$(window).keydown(model.handleKeydown);
			/*model.video.addEventListener("adStart", handleAdStart);
			model.video.addEventListener("adComplete", handleAdComplete);*/

			model.playVideo({id:$stateParams.brightcoveId});

			//END LOGICA PLAYER
		}
	}

	module.controller('VideoModuleController', [
		'$scope',
		'$timeout',
		'ProductService',
		'UserInfo',
		'itemSelected',
		'hotkeys',
		'$state',
		'AlertDialogService',
		'DevInfo',
		'$stateParams',
		'$location',
		VideoModuleController
	]);

}(angular.module("caracolplaylgtvapp.videoModule", [
	'ui.router'
])));