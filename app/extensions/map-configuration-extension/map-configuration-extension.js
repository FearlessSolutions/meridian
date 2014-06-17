define([
  './map-configuration'
], function(mapConfiguration) {

	var exposed = {
		initialize: function(app) {
			app.sandbox.mapConfiguration = mapConfiguration;
		}
	};

	return exposed;

});