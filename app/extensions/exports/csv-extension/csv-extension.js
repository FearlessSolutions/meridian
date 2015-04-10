define([
    './csv-configuration'
], function(configuration) {

    var context,
        exportUtils;

	return {
		initialize: function(app) {
            context = app;
            exportUtils = context.sandbox.export.utils;

            if(!app.sandbox.export){
                throw 'Requires export-utils extension to be loaded.';
            }

            exportUtils.addExport({
                id: configuration.id,
                option: configuration,
                export: exportFunction,
                validate: validate
            });

        }//end of initialize
	};

    function exportFunction(params) {
        var layerIds = params.layerIds,
            filename = params.options.filename;

        if (params.featureId && params.layerId) { //Not done

        } else if (params.layerIds) {
            if (exportUtils.verifyOnlyPointsInLayer(layerIds)) {
                if(!exportUtils.validateFilename(filename)){
                    params.callback({
                        messageType: 'error',
                        messageTitle: 'CSV export',
                        messageText: 'Filename contained one of: \\ / : * ? " < > | &'
                    });
                }else {
                    exportUtils.checkFileHead(layerIds, function(err, pass){
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

                            window.location.assign(exportUtils.getFileExportUrl(layerIds, filename, 'csv'));
                        }
                    });
                }
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
            valid = exportUtils.validateExportForLayerByDatasource(
                configuration.id,
                params.layerIds
            );
        } else{
            valid = false;
        }

        params.callback(valid);
    }

});