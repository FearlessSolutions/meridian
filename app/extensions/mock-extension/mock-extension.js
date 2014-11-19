define([
    'text!./mock-info-win.hbs',
    'text!./mock-info-win.css',
    'text!./mock-map-url.hbs',
    './mock-configuration',
    'jquery',
    'bootstrap',
    'handlebars'
], function(mockHbs, mockInfoWinCSS, mapUrlHBS, mockConfig, $) {
    var context,
        mapUrlTemplate;
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
                infoWinTemplate: {
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
                    buildInfoWinTemplate: function(attributes, fullFeature) {
                        var mockTemplate = Handlebars.compile(mockHbs);
                        var html;

                        //Add the url
                        attributes.mapUrl = processMapUrl(attributes);

                        html = mockTemplate({
                            thumbnail: app.sandbox.icons.getIconForFeature(fullFeature).iconLarge || app.sandbox.icons.getIconForFeature(fullFeature).icon,
                            classification: attributes.classification || "",
                            name: attributes.name,
                            attributes: attributes,
                            namespace: 'mock-extension',
                            exports: mockConfig.exports
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
                        $('.mock-extension .infoDiv .exportFeature .btn').on('click', function(){
                            var channelName = $('.mock-extension .infoDiv .exportFeature select').find(':selected').val();
                            switch(channelName){
                                case "export.download.geojson":
                                    context.sandbox.emit(channelName, {featureId: feature.featureId});
                                    break;
                                case "export.google.maps":
                                    context.sandbox.dataStorage.getFeatureById({featureId: feature.featureId}, function(feature){
                                        context.sandbox.emit(channelName, {lat: feature.geometry.coordinates[1],
                                            lon: feature.geometry.coordinates[0]});
                                    });
                                    break;
                                default:
                                    console.log("ERROR: Unknown channel -- " + channelName);
                            }
                        });
                    }
                },
                 /**
                 * Array of objects with information about the name and location of each property of a feature.
                 * @namespace Sandbox.dataServices.mock.keys
                 * @property {String} property    - Name of the property of the feature
                 * @property {String} displayName - Name used in the datagrid.
                 * @property {String} weigth      - Number used to specify the location in the datagrid. Higher weight means more to the left.
                 * @memberof Sandbox.dataServices.mock
                 */
                keys: [
                    {
                        property: 'percent',
                        displayName: '%',
                        weight: 76
                    },
                    {
                        property: 'color',
                        displayName: 'Color',
                        weight: 69
                    }
                ],
                /**
                 * @namespace Sandbox.dataServices.mock.processMapUrl
                 * @property {Function} processMapUrl -  Function found in {@link module:mock-extension#processMapUrl}
                 * @memberof Sandbox.dataServices.mock
                 */
                processMapUrl: processMapUrl
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
            lat: attributes.lat,
            lon: attributes.lon
        });
    }

    return exposed;
});