LG.config = {

    // the language code which is used when localizing copy
    lang: 'en',

    // the application name which is reported in the analytics
    app_name: 'LG Reference App',

    // the google analytics token
    ga_token: '',

    // controls whether the media delivery is progressive or HTTP live streaming
    // 'http_ios' is used for HLS, otherwise use 'http'
    //media_delivery: 'http',
    media_delivery: 'http_ios',

    // Brightcove media API token, needs to the read token with URL access
    //Cplay
	token: 'vffI96jl1r625dzNemeKZWYI6TZGILd4nxiBhzMJfK4ekLimWDQY6A..',
	//Caracoltv
	//token: 'Ly7AEpQiKypr1uNkNAm4CX6npDpDsAxFmwpo4sfVGMFUxZtBnLXh-A..',

    // the playlists to display in the application
    playlist_ids: ['4568387335001','4090839511001'],

    // enable the continuous play of videos.
    // 'playlist' to play all videos within a playlist, and return to the menu once complete
    // 'all' to continue to the next playlist once all videos in the current playlist have finished.
    // false to disable
    continuous_play: "all",

    // ad server url
    ad_server_url: 'http://shadow01.yumenetworks.com/',

    // turns pre-rolls on or off
    preroll_ads: false,

    // YuMe domain ID
    yume_domain_id: '211jRhjtWMT',

    // YuMe additional query string params
    yume_qs_params: '',

    // YuMe pre-roll playlist URL
    yume_preroll_playlist: 'dynamic_preroll_playlist.json?',

    // interval at which pre-rolls should play
    title_ad_play_interval: 3

};

