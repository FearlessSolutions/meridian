/**
 * Sets up the CMAPI channels to listen for from the parent
 * Some utility functions to help parse geoJSON
 */
define([
    'text!./cmapi-info-win.hbs',
    'text!./cmapi-info-win.css',
    "handlebars"
], function(cmapiHBS, cmapiCSS) {   
    var exposed = {
        /**
         * Initialize the extension:
         * -Set up the availible pub and sub postMessage channels
         * -Put the helper functions in the sandbox
         * -Set up a mock cmapi "dataService'
         * @param app
         */
        initialize: function(app) {
            app.sandbox.utils.addCSS(cmapiCSS, 'cmapi-extension-style');

            //Set up parent channels
            if(!app.sandbox.cmapi) {
                app.sandbox.cmapi = {};
            }

            //Put utility function in sandbox
            app.sandbox.cmapi.getMaxExtent = getMaxExtent;
            app.sandbox.cmapi.thisName = "meridian";

            //Set up CMAPI as a 'dataService'
            if (!app.sandbox.dataServices) {
                app.sandbox.dataServices = {};
            }

            app.sandbox.dataServices.cmapi = {};
            app.sandbox.dataServices.cmapi.infoWinTemplate = {
                "buildInfoWinTemplate": function(attributes, fullFeature) {
                    var cmapiTemplate = Handlebars.compile(cmapiHBS);
                    var html = cmapiTemplate({
                        "thumbnail": fullFeature.style.iconLarge || fullFeature.style.icon,
                        "classification": attributes.classification || "", //TODO make this dynamic?
                        "name": attributes.name,
                        "attributes": attributes,
                        "namespace": "cmapi-extension"
                    });
                    return html;
                },
                "postRenderingAction": function(feature, overlayId){ return; }
            };
        }
    };

    /**
     * Recursive function to find max extent of any geoJSON geometry.
     * Also,  marks the center of the extent
     * @param currentCoords The current point in the geometry; either coordinates, or an array leading to coordinates
     * @param maxExtent The current max extent; If null, is set to first found coordinate to start
     * @returns {*}
     */
    function getMaxExtent (currentCoords, maxExtent) {
        var lat,
            lon;

        if(!maxExtent) {
            maxExtent = { //Set so that first found coordinate will overwrite
                "minLat": 90,
                "minLon": 180,
                "maxLat": -90,
                "maxLon": -180
            };
        }

        if(Array.isArray(currentCoords[0])) {
            currentCoords.forEach(function(nextCoords){
                maxExtent = getMaxExtent(nextCoords, maxExtent);
            });
        } else { //Is at the lowest level
            lon = currentCoords[0];
            lat = currentCoords[1];

            if(lat < maxExtent.minLat) {
                maxExtent.minLat = lat;
            }
            if(lon < maxExtent.minLon) {
                maxExtent.minLon = lon;
            }
            if(lat > maxExtent.maxLat) {
                maxExtent.maxLat = lat;
            }
            if(lon > maxExtent.maxLon) {
                maxExtent.maxLon = lon;
            }
        }

        maxExtent.center = {
            "lat": ((maxExtent.minLat + maxExtent.maxLat) / 2.0),
            "lon": ((maxExtent.minLon + maxExtent.maxLon) / 2.0)
        };

        return maxExtent;
    }

    return exposed;
});
