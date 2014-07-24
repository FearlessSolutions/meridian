define([
    './ajax-handler-publisher'
], function (publisher) {

    var context;

    var exposed = { 

        init: function(thisContext) {
            context = thisContext;
        },
        stopQuery: function(params) {
            var layerState,
                dataTransferState;

            context.sandbox.ajax.stopQuery({
                "layerId": params.layerId
            });

            // Handle notifcations and state
            layerState = context.sandbox.stateManager.getLayerStateById({"layerId": params.layerId});
            if(layerState) {
                // Check state manager for status of layer, if already stopped or finished don't publish message or change state
                dataTransferState = layerState.dataTransferState;

                if(dataTransferState !== 'stopped' && dataTransferState !== 'finished') {
                    publisher.publishMessage({
                        "messageType": "warning",
                        "messageTitle": "Data Service",
                        "messageText": "Query data transfer was stopped."
                    });

                    context.sandbox.stateManager.setLayerStateById({
                        "layerId": params.layerId,
                        "state": {
                            "dataTransferState": 'stopped'
                        }
                    });
                }
            }

            
        },
        clearAll: function(params) {
            context.sandbox.ajax.clear();
        }
    };

    return exposed;

});
