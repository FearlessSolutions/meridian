define([
], function() {

    var exposed = {
        initialize: function(app) {
            if (!app.sandbox.snapshot) {
                app.sandbox.snapshot = {};
            }
            app.sandbox.snapshot.thumbnailURL = exposed.generateThumnailURL;
        },
        generateThumnailURL: function(coords) {
            if(coords) {
                var centroidLat = coords.maxLat - (coords.maxLat - coords.minLat) / 2;
                var centroidLon = coords.maxLon - (coords.maxLon - coords.minLon) / 2;

                return "http://maps.googleapis.com/maps/api/staticmap?center=" + 
                    centroidLat +
                    "," +
                    centroidLon +
                    "&zoom=5&size=100x70&maptype=roadmap&sensor=false";
            } else {
                return "/extensions/snapshot-extension/default-snapshot.png";
            }
        }
    };

    return exposed;

});