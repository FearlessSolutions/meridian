define([
    './kml-configuration'
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
        }
	};

    function exportFunction(params){
        var layerIds = params.layerIds;

        if (params.featureId && params.layerId) { //Not done

        } else if (layerIds) {
            context.sandbox.export.utils.checkFileHead(layerIds, function(err, pass){
                if(err) {
                    params.callback({
                        messageType: err.messageType,
                        messageTitle: 'KML export',
                        messageText: err.messageText
                    });
                } else {
                    params.callback({
                        messageType: 'info',
                        messageTitle: 'KML export',
                        messageText: 'KML download started'
                    });

                    window.location.assign(context.sandbox.export.utils.getFileExportUrl(layerIds, 'kml'));
                }
            });
        }
    }

    function validate(params){
        var valid = false;

        if(params.featureId){
            valid = false;
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