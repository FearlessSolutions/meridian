define([
    './csv-configuration'
], function(configuration) {

    var context;
	var exposed = {
		initialize: function(app) {
            context = app;

            if(!app.sandbox.export){
                throw 'Requires export-utils extension to be loaded.';
            }

            app.sandbox.export.utils.addExport({
                id: configuration.id,
                option: configuration,
                export: exportFunction,
                validate: validate
            });

        }//end of initialize
	};//exposed

    function exportFunction(params) {
        var layerIds = params.layerIds;

        if (params.featureId && params.layerId) { //Not done

        } else if (params.layerIds) {
            if (context.sandbox.export.utils.verifyOnlyPointsInLayer(layerIds)) {
                context.sandbox.export.utils.checkFileHead(layerIds, function(err, pass){
                    if(err) {
                        params.callback({
                            messageType: err.messageType,
                            messageTitle: 'CSV export',
                            messageText: err.messageText
                        });
                    } else {
                        params.callback({
                            messageType: 'info',
                            messageTitle: 'CSV export',
                            messageText: 'CSV download started'
                        });

                        window.location.assign(context.sandbox.export.utils.getFileExportUrl(layerIds, 'csv'));
                    }
                });
            } else {
                params.callback({
                    messageType: 'error',
                    messageTitle: 'CSV export',
                    messageText: 'CSV can only export points.'
                });
            }
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