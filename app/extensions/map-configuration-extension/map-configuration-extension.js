define([
  './map-configuration'
], function(mapConfiguration) {

	/**
	 * @exports mapConfiguration-extension
	 */
	var exposed = {
		/**
         * All Meridian extensions require an 'initialize' function to begin the loading process of the extension.
         * This extension exposes {@link Sandbox.mapConfiguration} to the {@link Sandbox} namespace.
         * @function
         * @instance
         * @param  {Object} app - Instance of the Meridian application.
         */
		initialize: function(app) {
			app.sandbox.mapConfiguration = mapConfiguration;
		}
	};

	return exposed;

});