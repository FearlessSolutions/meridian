define([
  './map-configuration'
], function(mapConfiguration) {

	/**
	 * @exports MapConfigurationExtension
	 */
	var exposed = {
		/**
		 * Funciton utilized by Aura to init all extensions. 
		 * This extentions exposes {@link Sandbox.mapConfiguration} to the {@link Sandbox} namespace.
		 * @param  {Object} app Instance of the Aura application.
		 * @return {Object} Exposes the extension to the Aura application.
		 */
		initialize: function(app) {
			app.sandbox.mapConfiguration = mapConfiguration;
		}
	};

	return exposed;

});