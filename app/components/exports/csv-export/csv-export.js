define([
    './csv-export-publisher'
], function (publisher) {
    var context,
        EXPORT_ID = 'csv';

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        exporter: function(params){
            if(params.featureId && params.layerId){
//                context.sandbox.export.export[EXPORT_ID]({
//                    featureId: params.featureId,
//                    layerId: params.layerId,
//                    callback: function(callbackParams){
//                        publisher.publishMessage({
//                            messageType: callbackParams.messageType,
//                            messageTitle: 'CSV export',
//                            messageText: callbackParams.messageText
//                        });
//                    }
//                });
            } else if(params.layerIds){
                if(verifyLayers(params.layerIds)){
                    context.sandbox.export.export[EXPORT_ID]({
                        layerIds: params.layerIds,
                        callback: function(callbackParams){
                            publisher.publishMessage({
                                messageType: callbackParams.messageType,
                                messageTitle: 'CSV export',
                                messageText: callbackParams.messageText
                            });
                        }
                    });
                } else{
                    publisher.publishMessage({
                        messageType: 'error',
                        messageTitle: 'CSV export',
                        messageText: 'CSV can only export points.'
                    })
                }
            } else {
                //error?
            }
        }
    };

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