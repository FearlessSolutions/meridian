define([
    './support-configuration'
], function(supportConfiguration) {
    /**
     * @exports support-configuration-extension
     */
    var exposed = {
        /**
         * All Meridian extensions require an 'initialize' function to begin the loading process of the extension.
         * This extension exposes {@link Sandbox.supportConfiguration} to the {@link Sandbox} namespace.
         * @function
         * @instance
         * @param  {Object} app Instance of the Meridian application.
         * @memberof module:support-configuration-extension
         */
        initialize: function(app) {
            //defined in the config file, so that all properties can be viewed together.
            app.sandbox.supportConfiguration = supportConfiguration;
        }
    };

    return exposed;

});