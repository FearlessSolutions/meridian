define([
    './fake-publisher'
], function(publisher) {

    var context,
        DATASOURCE_NAME = 'fake';

    var exposed = { 

        init: function(thisContext) {
            context = thisContext;
        },
        executeQuery: function(params) {
            if(params.dataSourceId === DATASOURCE_NAME) {
                // Set a query ID to pass to the server
                params.queryId = context.sandbox.utils.UUID();

                // Create the snapshot prior to executing query, so user knows something happened
                if(!context.sandbox.dataStorage.datasets[params.queryId]) {
                    context.sandbox.dataStorage.datasets[params.queryId] = new Backbone.Collection();
                    context.sandbox.dataStorage.datasets[params.queryId].dataSourceId = DATASOURCE_NAME;

                    publisher.createLayer({
                        "layerId": params.queryId,
                        "name": params.name,
                        "selectable": true,
                        "coords": {
                            "minLat": params.minLat,
                            "minLon": params.minLon,
                            "maxLat": params.maxLat,
                            "maxLon": params.maxLon
                        }
                    });
                }

                queryData(params);

                publisher.publishMessage({
                    "messageType": "success",
                    "messageTitle": "Data Service",
                    "messageText": params.name + " query initiated"
                });
                publisher.addToProgressQueue();
            }
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

                    publisher.removeFromProgressQueue();

                    context.sandbox.stateManager.setLayerStateById({
                        "layerId": params.layerId,
                        "state": {
                            "dataTransferState": 'stopped'
                        }
                    });
                }
            }
            
        },
        clear: function() {
            context.sandbox.dataStorage.clear();
            context.sandbox.ajax.clear();
        },
        deleteDataset: function(params) { 
            // delete context.sandbox.dataStorage.datasets[params.layerId]; // TODO: like the clear above, use a method on dataStorage to delete layer instead of calling a delete directly
        }
    };

    function queryData(params) {
        var newAJAX = context.sandbox.utils.ajax({
            type: 'POST',
            url: 'https://localhost:3000/query/bbox/' + params.dataSourceId,
            data: {
                "throttleMs": 0,
                "minLat": params.minLat,
                "minLon": params.minLon,
                "maxLat": params.maxLat,
                "maxLon": params.maxLon,
                "start": params.start || 0,
                "queryId": params.queryId || null,
                "pageSize": params.pageSize,
                "queryName": params.name,
                "justification": params.justification
            },
            xhrFields: {
                withCredentials: true
            }
        })
        .done(function(data){
            var layerId,
                newData = [];

            if (data && data.length > 0){
                layerId = params.queryId || data[0].properties.queryId;

                publisher.publishMessage({
                    "messageType": "info",
                    "messageTitle": "Data Service",
                    "messageText": data.length+ " events have been added to " + params.name + " query layer."
                });

                context.sandbox.stateManager.setLayerStateById({
                    "layerId": layerId,
                    "state": {
                        "dataTransferState": 'running'
                    }
                });

                context.sandbox.utils.each(data, function(key, value){
                    var newValue = {};

                    context.sandbox.utils.each(context.sandbox.dataServices.fake.keys, function(k1, v1){
                        context.sandbox.utils.each(value.properties, function(k2, v2){
                            if(v1 === k2) {
                                newValue[k2] = v2;
                            }
                        });
                    });

                    newValue.dataService = data[key].dataService = 'fake';
                    newValue.layerId = layerId;
                    newValue.id = data[key].id = value.properties.featureId;
                    newValue.geometry = value.geometry;
                    newValue.type = value.type;
                    newValue.properties = {};

                    context.sandbox.dataStorage.addData({
                        "datasetId": layerId,
                        "data": newValue
                    });

                    // Add style properties for map features, but not for local dataset storage
                    context.sandbox.utils.each(context.sandbox.icons.getIconForFeature(value), function(styleKey, styleValue){
                        newValue.properties[styleKey] = styleValue;
                    });

                    newData.push(newValue);
                });

                // Clear data out from memory
                data = [];

                publisher.plotFeatures({
                    "layerId": layerId,
                    "data": newData
                });

                params.start = parseInt(params.start || 0) + parseInt(params.pageSize);
                params.queryId = layerId;
                // Loop back over the funtion
                queryData(params);
            } else {
                publisher.publishMessage({
                    "messageType": "success",
                    "messageTitle": "Data Service",
                    "messageText": params.name + " query complete"
                });

                context.sandbox.stateManager.setLayerStateById({
                    "layerId": params.queryId,
                    "state": {
                        "dataTransferState": 'finished'
                    }
                });

                publisher.publishFinish({
                    "layerId": params.queryId
                });

                publisher.removeFromProgressQueue();
            }

        })
        .error(function(e){
            //If the error was because we aborted, ignore
            if(e.statusText === "abort"){
                return;
            }

            publisher.publishMessage({
                "messageType": "error",
                "messageTitle": "Data Service",
                "messageText": "Connection to data service failed."
            });

            publisher.removeFromProgressQueue();

            context.sandbox.stateManager.setLayerStateById({
                "layerId": layerId,
                "state": {
                    "dataTransferState": 'error'
                }
            });

            publisher.publishError({
                "layerId": params.queryId
            });

            return false;
        });

        context.sandbox.ajax.addActiveAJAX({
            "newAJAX": newAJAX, 
            "layerId": params.queryId
        });
    }


    return exposed;

});
