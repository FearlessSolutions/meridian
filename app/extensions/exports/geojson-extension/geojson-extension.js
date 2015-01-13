define([
'./geojson-configuration'
], function(geojsonConfig) {

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

            app.sandbox.export.options.push(geojsonConfig);

            app.sandbox.export.geoJSON = function (data) {

            };
        }
	};

	return exposed;





});