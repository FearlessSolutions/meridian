define([
  './map-configuration'
], function(mapConfiguration) {

	/**
	 * @exports MapConfigurationExtension
	 */
	var exposed = {
		/**
		 * Funciton utilized by Meridian to init all extensions. 
		 * This extentions exposes {@link Sandbox.mapConfiguration} to the {@link Sandbox} namespace.
		 * @instance
		 * @param  {Object} app Instance of the Meridian application.
		 */
		initialize: function(app) {
			app.sandbox.mapConfiguration = mapConfiguration;
		}
	};

	return exposed;

});