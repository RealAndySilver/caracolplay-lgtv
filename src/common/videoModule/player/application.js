// create application namespace
window.LG || (window.LG = {
    api: {
        api_url: 'http://api.brightcove.com/services/library',
        api_playlist_params: 'video_fields=id,name,shortDescription,thumbnailURL,videoStillURL',
        api_params: 'video_fields=id,name,length,shortDescription,thumbnailURL,videoStillURL,renditions,FLVURL,IOSrenditions&media_delivery=http_ios'
    },

    // utility fn to truncate a string with an ellipsis
    truncate: function( str, maxChars ) {
        if(str == undefined)  return "";
        maxChars = maxChars || 175;
        return str.length <= maxChars ?  str : str.substr(0, maxChars).replace(/\s$/, '') + '...';
    },

    isNative: /LG Browser/.test(navigator.userAgent)
});

var state = (function(){
    var STATES = "info main video browse error";
    var history = [ "main" ];

    function change( state ) {
        //body.removeClass(STATES);

        if(state && state.length) {
            //body.addClass(state);
            history.push(state);
        }
    }

    function restore() {
        var current = history.pop();
        change(history.pop());
    }

    function get( len ) {
        return history[ history.length - ( len || 1 ) ];
    }

    return {
        change: change,
        restore: restore,
        get: get,
        previous: function( num ) {
            return get( num );
        }
    }
})();

function formatTime(time) {
    if (time > 9) {
        return time;
    } else {
        return "0" + time;
    }
}

function convertTime(sec) {
    var min = Math.floor(sec/60);
    sec = sec % 60;

    var hr = Math.floor(min/60);
    min = min % 60;

    var time = [];
    if (hr !== 0) {
        time.push(formatTime(hr));
    }
    time.push(formatTime(min));
    time.push(formatTime(sec));

    return time.join(":");
};