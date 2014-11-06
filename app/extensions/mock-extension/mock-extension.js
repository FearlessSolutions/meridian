define([
    'text!./mock-info-win.hbs',
    'text!./mock-info-win.css',
    'text!./mock-map-url.hbs',
    'handlebars'
], function(mockHbs, mockInfoWinCSS, mapUrlHBS) {
    var context,
        mapUrlTemplate;
    /**
     * Sets up mock as a 'dataService'.
     * @namespace Sandbox.dataServices.mock
     * @memberof Sandbox.dataServices
     */
    /**
     * Sets up mock as a 'dataService'.
     * @exports mock-extension
     */
    var exposed = {
        /**
         * All Meridian extensions require an 'initialize' function to begin the loading process of the extension.
         * This extension exposes {@link Sandbox.dataServices.mock} to the {@link Sandbox} namespace.
         * @function
         * @instance
         * @param {Object} app Instance of the Meridian application.
         */
        initialize: function(app) {
            context = app;
            mapUrlTemplate = Handlebars.compile(mapUrlHBS);

            app.sandbox.utils.addCSS(mockInfoWinCSS, 'mock-extension-style');

            if (!app.sandbox.dataServices) {
                app.sandbox.dataServices = {};
            }
            /**
             * Sets up mock as a 'dataService'.
             * @namespace Sandbox.dataServices.mock
             * @memberof Sandbox.dataServices
             */
            app.sandbox.dataServices.mock = {
                /**
                 * Encapsulates information window functions and properties.
                 * @namespace Sandbox.dataServices.mock.infoWinTemplate
                 * @memberof Sandbox.dataServices.mock
                 */
                "infoWinTemplate": {
                    /**
                     * Creates html template with the values provided to the function.
                     * @function
                     * @instance
                     * @param {Object} attributes
                     * @param {String} [attributes.classification=""] - Empty string will be used if not provided.
                     * @param {String} attributes.name
                     * @param {Object} fullFeature                    - Feature containting custom style for its markers.
                     * @param {Object} fullFeature.style              - Style settings of the feature.
                     * @param {String} fullFeature.style.iconLarge    - fullFeature.style.icon will be used if iconLarge is not provided.
                     * @return Handlebar template.
                     * @memberof Sandbox.dataServices.mock.infoWinTemplate
                     */
                    "buildInfoWinTemplate": function(attributes, fullFeature) {
                        var mockTemplate = Handlebars.compile(mockHbs);
                        var html;

                        //Add the url
                        attributes.mapUrl = processMapUrl(attributes);

                        html = mockTemplate({
                            "thumbnail": app.sandbox.icons.getIconForFeature(fullFeature).iconLarge || app.sandbox.icons.getIconForFeature(fullFeature).icon,
                            "classification": attributes.classification || "",
                            "name": attributes.name,
                            "attributes": attributes,
                            "namespace": "mock-extension"
                        });

                        return html;
                    },
                    /**
                     * NOT IMPLEMENTED. Developers can modify this function to execute any post-rendering
                     * action desired after the info window is loaded.
                     * @function
                     * @instance
                     * @param  {Object} feature   - Info needed.
                     * @param  {Object} overlayId - Info needed.
                     * @memberof Sandbox.dataServices.mock.infoWinTemplate
                     */
                    postRenderingAction: function(feature, layerId) {
                        return;
                    }
                },
                /**
                 * Used to match the key with the properties of the feature and uses the value as an alias for the column 
                 * header specifically for this datasource. 
                 * @namespace Sandbox.dataServices.mock.keys
                 * @property {String} percent - Property value: "%"
                 * @property {String} color   - Property value: "Color"
                 * @memberof Sandbox.dataServices.mock
                 */
                "keys": {
                    "percent": "%",
                    "color": "Color"
                },
                /**
                 * 
                 * @namespace Sandbox.dataServices.mock.processMapUrl
                 * @property {Function} processMapUrl -  Function found in {@link module:mock-extension#processMapUrl}
                 * @memberof Sandbox.dataServices.mock
                 */
                "processMapUrl": processMapUrl
            };
        }
    };
    /**
     * Enables access to the mapUrlTemplate found in this extension with the given lat/lon attributes.
     * @function
     * @instance
     * @param {Object} attributes     - 
     * @param {String} attributes.lat - Latitude.
     * @param {String} attributes.lon - Longitude.
     * @memberof module:mock-extension
     */
    function processMapUrl(attributes){
        return mapUrlTemplate({
            "lat": attributes.lat,
            "lon": attributes.lon
        });
    }

    return exposed;
});