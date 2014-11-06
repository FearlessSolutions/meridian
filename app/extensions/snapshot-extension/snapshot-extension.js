define([
], function() {
    /**
     * @namespace Sandbox.snapshot
     * @memberof Sandbox
     */
    /**
     * Exposes the thumbnail returned by {@link module:snapshot-extension#generateThumnailURL generateThumnailURL}.
     * @namespace Sandbox.snapshot.thumbnailURL
     * @memberof Sandbox.snapshot
     */
    /**
     * @exports snapshot-extension
     */
    var exposed = {
        /**
         * All Meridian extensions require an 'initialize' function to begin the loading process of the extension.
         * This extension exposes {@link Sandbox.snapshot} and {@link Sandbox.snapshot.thumbnailURL} to the {@link Sandbox} namespace.
         * @function
         * @instance
         * @param  {Object} app Instance of the Meridian application.
         */
        initialize: function(app) {
            if (!app.sandbox.snapshot) {
                app.sandbox.snapshot = {};
            }
            app.sandbox.snapshot.thumbnailURL = exposed.generateThumnailURL;
        },
        /**
         * Returns a centered snapshot of the coords provided. 
         * @function
         * @instance
         * @param {Object} coords        - The coordinates provided.
         * @param {String} coords.MinLat - Minimum Latitude used in the initial extent.
         * @param {String} coords.MinLon - Minimum Longitude used in the initial extent.
         * @param {String} coords.MaxLat - Maximum Latitude used in the initial extent.
         * @param {String} coords.MaxLon - Maximum Longitude used in the initial extent.
         * @memberof module:snapshot-extension
         */
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
                return "./extensions/snapshot-extension/default-snapshot.png";
            }
        }
    };

    return exposed;

});