define([
    'text!./splash-screen.hbs'
], function(splashTemplate) {
    /**
     * @exports splash-screen-extension
     */
    var exposed = {
        /**
         * All Meridian extensions require an 'initialize' function to begin the loading process of the extension.
         * This extension exposes {@link Sandbox.splashScreen} and {@link Sandbox.splashScreen.template}
         * to the {@link Sandbox} namespace.
         * @function
         * @instance
         * @param  {Object} app Instance of the Meridian application.
         * @memberof module:splash-screen-extension
         */
        initialize: function(app) {
            /**
             * @namespace Sandbox.splashScreen
             * @memberof Sandbox
             */
			if (!app.sandbox.splashScreen) {
				app.sandbox.splashScreen = {};
			}
            /**
             * Exposes the splash screen template.
             * @namespace Sandbox.splashScreen.template
             * @memberof Sandbox.splashScreen
             */
            app.sandbox.splashScreen.template = splashTemplate;
        }
    };

    return exposed;

});