define([
'./export-geojson-configuration'
], function(geojsonConfig) {


	var exposed = {
		initialize: function(app) {
            context = app;

            if(!app.sandbox.export.options){
            	app.sandbox.export.options=[];
            }

            app.sandbox.export.options.push = geojsonConfig;

            app.sandbox.export.validate.geoJSON = function(data){
            
            }
	}

	return exposed;





});