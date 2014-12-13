define([
], function(){

    var context;

    var exposed = {
        init: function(app) {
            context = app;
        },
        //TODO: Expand this to allow for an array of featureIds
        /**
         * Expected params
         *
         * lat:Float - Latitude
         * lon:Float - Longitude
         * zoom:Integer (optional) - Zoom level
         *
         * @param params
         */
        openGoogleMaps: function(params){
            var url = 'https://www.google.com/maps/@{{lat}},{{lon}},{{zoom}}z';
            url = url.replace('{{lat}}', params.lat)
                .replace('{{lon}}', params.lon)
                .replace('{{zoom}}', params.zoom || 13);
            window.open(url);
        }
    };

    return exposed;

});
