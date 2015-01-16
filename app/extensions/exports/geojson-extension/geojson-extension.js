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
                validate: validate
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

    function validate(params){
        var valid = true;

        if(params.featureId){
            valid = false
        } else if(params.layerIds){
            context.sandbox.utils.each(params.layerIds, function(index, layerId){
                //Check allocated datasources for this export
                if(context.sandbox.export.options[configuration.id].datasources.indexOf(layerId) === -1){
                    valid = false;

                    return false; //Stop the loop
                }
            });

        } else {
            //error?
            valid = false;
        }

        params.callback(valid);
    }

	return exposed;
});