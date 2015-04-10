define([
    './geojson-configuration'
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

        if(params.featureId){
            window.open(context.sandbox.utils.getCurrentNodeJSEndpoint() + '/feature/' + params.featureId, '_blank');
        } else if(layerIds){
            if(!exportUtils.validateFilename(filename)){
                params.callback({
                    messageType: 'error',
                    messageTitle: 'geoJSON export',
                    messageText: 'Filename contained one of: \\ / : * ? " < > | &'
                });
            }else {
                exportUtils.checkFileHead(layerIds, function (err, pass) {
                    if (err) {
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

                        window.location.assign(exportUtils.getFileExportUrl(layerIds, filename, 'geojson'));
                    }
                });
            }
        }
    }

    function validate(params){
        var valid = false;

        if(params.featureId){
            valid = exportUtils.validateExportForLayerByDatasource(
                configuration.id,
                [params.layerId] //Turn it into an array
            );
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