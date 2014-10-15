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
            converted;

        // Lazy check for large files to prevent blocking
        if (kml.length > kmlLengthCap){
            callback("KML exceeds max string size (" + kmlLengthCap + ")", null);
            return;
        }

        // Attempt to parse kml string into a jsdom
        kmlDom = jsdom(kml);
        if (!kmlDom){
            callback("Failed to parse KML", null);
            return;
        }

        // Convert kml into GeoJSON
        converted = toGeoJson.kml(kmlDom);
        if (!converted){
            callback("Failed to convert KML into GeoJSON", null);
            return;
        }

        callback(null, converted);
    }
};

module.exports = exports;