define([
    'text!./fake-info-win.hbs',
    'text!./fake-info-win.css',
    'handlebars'
], function(fakeHbs, fakeInfoWinCSS) {
    /**
     * Sets up fake as a 'dataService'.
     * @namespace Sandbox.dataServices.fake
     * @memberof Sandbox.dataServices
     */
    /**
     * Sets up fake as a 'dataService'.
     * @exports fake-extension
     */
    var exposed = {
        /**
         * All Meridian extensions require an 'initialize' function to begin the loading process of the extension.
         * This extension exposes {@link Sandbox.dataServices.fake} to the {@link Sandbox} namespace.
         * @function
         * @instance
         * @param {Object} app Instance of the Meridian application.
         */
        initialize: function(app) {
            app.sandbox.utils.addCSS(fakeInfoWinCSS, 'fake-extension-style');

            if (!app.sandbox.dataServices) {
                app.sandbox.dataServices = {};
            }
            
            app.sandbox.dataServices.fake = {
                /**
                 * Encapsulates information window functions and properties.
                 * @namespace Sandbox.dataServices.fake.infoWinTemplate
                 * @memberof Sandbox.dataServices.fake
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
                     * @param {String} [fullFeature.style.iconLarge]  - fullFeature.style.icon will be used if iconLarge is not provided.
                     * @return Handlebar template.
                     * @memberof Sandbox.dataServices.fake.infoWinTemplate
                     */
                    buildInfoWinTemplate: function(attributes, fullFeature) {
                        var fakeTemplate = Handlebars.compile(fakeHbs);
                        var html = fakeTemplate({
                            "thumbnail": app.sandbox.icons.getIconForFeature(fullFeature).iconLarge || app.sandbox.icons.getIconForFeature(fullFeature).icon,
                            "classification": attributes.classification || "",
                            "name": attributes.name,
                            "attributes": attributes,
                            "namespace": "fake-extension"
                        });
                        return html;
                    },
                    /**
                     * NOT IMPLEMENTED. Developers can modify function to execute any post rendering
                     * action desired after the info window is loaded.
                     * @function
                     * @instance
                     * @param  {Object} feature   - Info needed.
                     * @param  {Object} overlayId - Info needed.
                     * @memberof Sandbox.dataServices.fake.infoWinTemplate
                     */
                    postRenderingAction: function(feature, layerId) {
                        return;
                    }
                },
                /**
                 * Used to match the key with the properties of the feature and uses the value as an alias for the column 
                 * header in datagrid. This is specific for this datasource. 
                 * @namespace Sandbox.dataServices.fake.keys
                 * @property {String} valid - Property value: "Valid"
                 * @memberof Sandbox.dataServices.fake
                 */
                "keys": {
                    "valid": "Valid"
                }
            };
        }
    };

    return exposed;
});