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
                var currentDatasetIds = [],
                suffix;

                context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(datasetId, dataset) {
                    currentDatasetIds.push(datasetId);
                });
        
                suffix = '?ids=' + currentDatasetIds.join();
                window.location.assign(context.sandbox.utils.getCurrentNodeJSEndpoint() + '/feature/' + suffix);

            };//end of export.geoJson
        }//end of initialize
	};//exposed

	return exposed;
});