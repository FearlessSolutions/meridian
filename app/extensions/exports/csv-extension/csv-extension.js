define([
    './csv-configuration'
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

    function exportFunction(params) {
        var layerIds = params.layerIds;

        if (params.featureId && params.layerId) { //Not done

        } else if (params.layerIds) {
            if (verifyLayers(layerIds)) {
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

    function verifyPoint(feature){
        return feature.attributes.geometry.type === 'Point' ;
    }

    function verifyLayers(layerIds){
        var valid = true;

        context.sandbox.utils.each(layerIds, function(index, layerId){
            var layer = context.sandbox.dataStorage.datasets[layerId];

            context.sandbox.utils.each(layer.models, function(index, feature){
                valid = verifyPoint(feature);

                if(!valid){ //If not valid, exit the loop
                    return false;
                }
            });

            if(!valid){
                return false; //If not valid, exit the loop
            }
        });

        return valid;
    }

	return exposed;
});