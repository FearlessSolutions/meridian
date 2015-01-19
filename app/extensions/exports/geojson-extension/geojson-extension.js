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
        if(params.featureId){
            window.open(context.sandbox.utils.getCurrentNodeJSEndpoint() + '/feature/' + params.featureId, '_blank');
        } else if(params.layerIds){
            //Do nothing for now.
        }
    }

    function validate(params){
        var valid = false;

        params.callback(true); //TODO remove
        return;

        if(params.featureId){
            valid = context.sandbox.export.utils.validateExportForLayerByDatasource(
                configuration.id,
                [params.layerId] //Turn it into an array
            );
        } else if(params.layerIds){

            //TODO don't support right now
            valid = false;
//            valid = context.sandbox.export.utils.validateExportForLayerByDatasource(
//                configuration.id,
//                params.layerIds
//            );
        } else{
            valid = false;
        }

        params.callback(valid);
    }

	return exposed;
});