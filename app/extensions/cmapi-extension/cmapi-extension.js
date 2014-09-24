define([
    'text!./cmapi-info-win.hbs',
    'text!./cmapi-info-win.css',
    "handlebars"
], function(cmapiHBS, cmapiCSS) {   
    /**
     * CMAPI: Common Map API. Pub/sub messaging for geospacial mashups.
     * @namespace Sandbox.cmapi
     * @memberof Sandbox
     * @property {String} DATASOURCE_NAME - Default value is 'cmapi'
     * @property {String} defaultLayerId - Default value is 'cmapi'
     */
    /**
     * Sets up CMAPI as a 'dataService'
     * @namespace Sandbox.dataServices.cmapi
     * @memberof Sandbox.dataServices
     */
    /**
     * Sets up the CMAPI channels to listen for messages from the parent.
     * Also includes some utility functions to help parse geoJSON.
     * @exports CMAPI-extension
     */
    var exposed = {
        /**
         * All Meridian extensions require an 'initialize' function to begin the loading process of the extension.
         * This extension:
         * Exposes {@link Sandbox.cmapi} to the {@link Sandbox} namespace, 
         * Sets up the availible pub and sub postMessage channels,
         * Puts the helper functions in the sandbox,
         * Sets up a mock cmapi 'dataService'.
         * @function
         * @instance
         * @param {Object} app - Instance of the Meridian application.
         */
        "initialize": function(app) {
            app.sandbox.utils.addCSS(cmapiCSS, 'cmapi-extension-style');

            //Set up parent channels
            if(!app.sandbox.cmapi) {
               
                app.sandbox.cmapi = {};
            }

            //Put utility function in sandbox
            app.sandbox.cmapi.getMaxExtent = getMaxExtent;
            app.sandbox.cmapi.DATASOURCE_NAME = 'cmapi';
            app.sandbox.cmapi.defaultLayerId = 'cmapi';

            //Set up CMAPI as a 'dataService'
            if (!app.sandbox.dataServices) {
                app.sandbox.dataServices = {};
            }

            app.sandbox.dataServices.cmapi = {
                /**
                 * Info needed.
                 * @namespace Sandbox.dataServices.cmapi.infoWinTemplate
                 * @memberof Sandbox.dataServices.cmapi
                 */
                "infoWinTemplate": {
                    /**
                     * Creates html template with the values provided to the function.
                     * @function
                     * @instance
                     * @param {Object} attributes
                     * @param {String} [attributes.classification=""] Empty string will be used if not provided.
                     * @param {String} attributes.name - Description needed.
                     * @param {Object} fullFeature 
                     * @param {String} [fullFeature.style.iconLarge] - fullFeature.style.icon will be used if iconLarge is not provided.
                     * @return Handlebar template.
                     * @memberof Sandbox.dataServices.cmapi.infoWinTemplate
                     */
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
                    /**
                     * Info needed. 
                     * @function
                     * @instance
                     * @param  {Object} feature - Info needed.
                     * @param  {Object} overlayId - Info needed.
                     * @memberof Sandbox.dataServices.cmapi.infoWinTemplate
                     * @returns return;
                     */
                    "postRenderingAction": function(feature, overlayId){ return; }
                }
            };
        }
    };

    /**
     * Recursive function to find max extent of any geoJSON geometry.
     * Also, marks the center of the extent.
     * @function
     * @instance
     * @param {Array} currentCoords - The current point in the geometry; either coordinates, or an array leading to coordinates.
     * @param {Object} maxExtent - The current max extent; If null, is set to first found coordinate to start.
     * @param {Number} maxExtent.minLat - 90 when maxExtent is null.
     * @param {Number} maxExtent.minLon - 180 when maxExtent is null.
     * @param {Number} maxExtent.maxLat - -90 when maxExtent is null.
     * @param {Number} maxExtent.maxLon - -180 when maxExtent is null.
     * @returns {Object} maxExtent with added values in maxExtent.center.lat & maxExtent.center.lon
     * @memberof Sandbox.cmapi
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
            lon = parseFloat(currentCoords[0]);
            lat = parseFloat(currentCoords[1]);

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
