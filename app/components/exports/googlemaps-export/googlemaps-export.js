define([
    './googlemaps-export-publisher'
], function (publisher) {
    var context,
        EXPORT_ID = 'googlemaps';

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        exporter: function(params){
            if(params.featureId && params.layerId){
                //Not supported right now TODO

                context.sandbox.export.export[EXPORT_ID]({
                    featureId: params.featureId,
                    layerId: params.layerId,
                    callback: function(callbackParams){
                        publisher.publishMessage({
                            messageType: callbackParams.messageType,
                            messageTitle: 'Google Maps export',
                            messageText: callbackParams.messageText
                        });
                    }
                });
            } else if(params.layerIds){
                // Does not support
            } else {
                //error?
            }
        }
    };

    return exposed;
});