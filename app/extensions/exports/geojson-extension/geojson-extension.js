define([
    './geojson-configuration'
], function(configuration) {

    var context;
	var exposed = {
		initialize: function(app) {
            context = app;

            if(!app.sandbox.export){
                throw 'Requires export-utils extension to be loaded.'
            }

            app.sandbox.export.utils.addExport({
                id: configuration.id,
                option: configuration,
                export: exportFunction,
                verify: verify
            });

        }//end of initialize
	};//exposed

    function exportFunction(params){
        var currentDatasetIds = [],
            suffix;

        context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(datasetId, dataset) {
            currentDatasetIds.push(datasetId);
        });

        suffix = '?ids=' + currentDatasetIds.join();
        window.location.assign(context.sandbox.utils.getCurrentNodeJSEndpoint() + '/feature/' + suffix);
    }

    function verify(params){

    }

	return exposed;
});