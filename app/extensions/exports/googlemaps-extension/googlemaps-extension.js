define([
'./googlemaps-configuration'
], function(gMapsConfig) {

    var context;
	var exposed = {
		initialize: function(app) {
            context = app;

            if(!app.sandbox.export){
                app.sandbox.export = {};
            }

            if (!app.sandbox.export.options) {
                app.sandbox.export.options = [];
            }

            app.sandbox.export.options.push(gMapsConfig);

            app.sandbox.export.googleMaps = function (data) {

            };
        }
	};

	return exposed;





});