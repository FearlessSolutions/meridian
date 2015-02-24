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
        var layerIds = params.layerIds;

        if(params.featureId){
            window.open(context.sandbox.utils.getCurrentNodeJSEndpoint() + '/feature/' + params.featureId, '_blank');
        } else if(layerIds){
            context.sandbox.export.utils.checkFileHead(layerIds, function(err, pass){
                if(err) {
                    params.callback({
                        messageType: err.messageType,
                        messageTitle: 'geoJSON export',
                        messageText: err.messageText
                    });
                } else {
                    params.callback({
                        messageType: 'info',
                        messageTitle: 'geoJSON export',
                        messageText: 'geoJSON download started'
                    });

                    window.location.assign(context.sandbox.export.utils.getFileExportUrl(layerIds, 'geojson'));
                }
            });        }
    }

    function validate(params){
        var valid = false;

        if(params.featureId){
            valid = context.sandbox.export.utils.validateExportForLayerByDatasource(
                configuration.id,
                [params.layerId] //Turn it into an array
            );
        } else if(params.layerIds){
            valid = context.sandbox.export.utils.validateExportForLayerByDatasource(
                configuration.id,
                params.layerIds
            );
        } else{
            valid = false;
        }

        params.callback(valid);
    }

	return exposed;
});