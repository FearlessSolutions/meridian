define([
    './kml-configuration'
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
        }
	};

    function exportFunction(params){
        var layerIds = params.layerIds,
            filename = params.options.filename;

        if (params.featureId && params.layerId) { //Not done

        } else if (layerIds) {
            if(!exportUtils.validateFilename(filename)){
                params.callback({
                    messageType: 'error',
                    messageTitle: 'KML export',
                    messageText: 'Filename contained one of: \\ / : * ? " < > | &'
                });
            }else {
                exportUtils.checkFileHead(layerIds, function (err, pass) {
                    if (err) {
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

                        window.location.assign(exportUtils.getFileExportUrl(layerIds, filename, 'kml'));
                    }
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