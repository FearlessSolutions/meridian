define([
], function () {

    var context,
        currentIcons = {};
    /**
     * @namespace Sandbox.icons
     * @memberof Sandbox
     */
    /**
     * @exports icons-extension
     */
    var exposed = {
        /**
         * All Meridian extensions require an 'initialize' function to begin the loading process of the extension.
         * This extension exposes {@link Sandbox.icons} to the {@link Sandbox} namespace.
         * @function
         * @instance
         * @param {Object} app Instance of the Meridian application.
         */
        initialize: function(app) {
            context = app;
            app.sandbox.icons = {
                /**
                 * Returns the icon style object and stores it internally
                 * in the {@link module:icons-extension icons-extension}.
                 * @function
                 * @instance
                 * @param  {Object} feature - The feature provided.
                 * @return {Object} Icon data of the feature provided.
                 * @memberof Sandbox.icons
                 */
                getIconForFeature: function(feature) {
                    var iconData = calculateIcon(feature);
                    if (!currentIcons[iconData.icon]){
                        currentIcons[iconData.icon] = iconData;
                    }
                    return iconData;
                },
                /**
                 * Gets all current icon styles stored in the {@link module:icons-extension icons-extension}.
                 * @function
                 * @instance
                 * @return {Object} - Internal object of all icon styles.
                 * @memberof Sandbox.icons
                 */
                getCurrentIcons: function() {
                    return currentIcons;
                },
                /**
                 * Clears the interal object of icon styles found in the 
                 * {@link module:icons-extension icons-extension}.
                 * @function
                 * @instance
                 * @memberof Sandbox.icons
                 */
                clearCurrentIcons: function() {
                    currentIcons = {};
                }
            };
        }
    };

    /**
     * Checks if the feature provided has a custom style for its markers.
     * @function
     * @instance
     * @param  {Object} feature - The feature provided.
     * @return {Object} Custom style if provided, if not, it uses the default markerIcon configuration found
     * in {@link Sandbox.mapConfiguration}
     * @memberof module:icons-extension
     */
    function calculateIcon(feature) {
        if(feature.style) {
            // If a style is provided on the feature, use it
            return feature.style;
        } else {
            // Otherwise use a default configuration
            return context.sandbox.mapConfiguration.markerIcons.default;
        }
    }

    return exposed;

});