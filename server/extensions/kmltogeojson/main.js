var toGeoJson = require('togeojson'),
    jsdom = require("jsdom").jsdom,
    thisContext,
    kmlLengthCap = 20000000; // Appx 20MB

var exports = {

    init: function(context){
        thisContext = context;
    },

    /**
     * Converts a string of KML to GeoJSON
     *
     * TODO: Change this over to utilize a Stream instead of a raw String
     * Keeping this as a raw string for now as we have no way to actually utilize the
     * stream internally and our file size cap is relatively low
     *
     * As we want to handle more custom KML it'll probably be best to fork the
     * togeojson library
     *
     * Example:
     *
     * var kmlString = require('fs').readFileSync('time-stamp-point.kml', 'utf8');
     *
     * exports.convertKmlToGeoJSON(kmlString, function(err, resp){
     *        console.log(err);
     *        console.log(resp.features[0]);
     *     });
     *
     * @param kml - string of KML
     * @param callback (err, resp)
     */
    convertKmlToGeoJSON: function(kml, callback){
        var kmlDom,
            payload = null,
            errorMessage = null;

        // Lazy check for large files to prevent blocking
        if (kml.length < kmlLengthCap) {
            // Attempt to parse kml string into a jsdom
            kmlDom = jsdom(kml);
            if (kmlDom) {
                // Convert kml into GeoJSON
                payload = toGeoJson.kml(kmlDom);
                if (!payload) {
                    payload = null;
                    errorMessage = "Failed to convert KML into GeoJSON";
                }
            } else {
                errorMessage = "Failed to parse KML";
            }
        } else {
            errorMessage = "KML exceeds max string size (" + kmlLengthCap + ")";
        }

        callback(errorMessage, payload);

    }
};

module.exports = exports;