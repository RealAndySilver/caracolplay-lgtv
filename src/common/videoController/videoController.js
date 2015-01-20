(function(module) {

    module.config(function ($stateProvider) {
        $stateProvider.state('videoController', {
            url: '/videocontroller',
            views: {
                "main": {
                    controller: 'VideoController',
                    controllerAs: 'model',
                    templateUrl: 'videoController/videoController.tpl.html'
                }
            },
            data:{ pageTitle: 'VideoController' }
        });
    });

    module.controller('VideoController', function () {
        var model = this;

        init();

        function init() {
          console.log('SMD');
          videojs("myPlayerID").ready(function() {
            var myPlayer = this;
            myPlayer.play();
            myPlayer.overlay({
              overlays: [{
                content: 'This event-triggered overlay message appears when the video is playing',
                start: 'play',
                end: 'pause'
              }]
            });
          });
        }
    });

}(angular.module("caracolplaylgtvapp.videoController", [
    'ui.router'
])));