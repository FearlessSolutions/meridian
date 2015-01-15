define([
'./geojson-configuration'
], function(configuration) {

    var context;
	var exposed = {
		initialize: function(app) {
            context = app;

            if(!app.sandbox.export){
                app.sandbox.export = {
                    export: {},
                    options: [],
                    validate: {}
                };
            }

            app.sandbox.export.options.push(configuration);

            app.sandbox.export.export[configuration.id] = function (data) {
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