(function(module) {
		module.config(function ($stateProvider) {
        $stateProvider.state('videoModule', {
            url: '/videomodule',
            views: {
                "main": {
                    controller: 'VideoModuleController as model',
                    templateUrl: 'videoModule/videoModule.tpl.html'
                }
            },
            data:{ pageTitle: 'VideoModule' }
        });
    });

    module.controller('VideoModuleController', function () {
        var model = this;

        init();

        function init() {

        }
    });

}(angular.module("caracolplaylgtvapp.videoModule", [
    'ui.router'
])));