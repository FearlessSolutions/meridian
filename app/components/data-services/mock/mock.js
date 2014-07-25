define([
    './mock-publisher'
], function(publisher) {

    var context;

    var exposed = { 

        init: function(thisContext) {
            context = thisContext;
        },
        executeQuery: function(params) {
            // Set a query ID to pass to the server
            params.queryId = context.sandbox.utils.UUID();

            // Create the snapshot prior to executing query, so user knows something happened
            if(!context.sandbox.dataStorage.datasets[params.queryId]) {
                context.sandbox.dataStorage.datasets[params.queryId] = new Backbone.Collection();

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

        },
        clear: function() {// TODO: look at the alternate solution for clearing single dataset
            context.sandbox.dataStorage.clear();

        },
        deleteDataset: function(params) { 
            // delete context.sandbox.dataStorage.datasets[params.layerId]; // TODO: like the clear above, use a method on dataStorage to delete layer instead of calling a delete directly
        }
    };

    function queryData(params) {
        var newAJAX = context.sandbox.utils.ajax({
            type: 'POST',
            url: 'https://localhost:3000/query/bbox/' + params.serviceName,
            data: {
                "throttleMs": 0,
                "minLat": params.minLat,
                "minLon": params.minLon,
                "maxLat": params.maxLat,
                "maxLon": params.maxLon,
                "start": params.start || 0,
                "queryId": params.queryId || null,
                "pageSize": params.pageSize
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

                    context.sandbox.utils.each(context.sandbox.dataServices.mock.keys, function(k1, v1){
                        context.sandbox.utils.each(value.properties, function(k2, v2){
                            if(v1 === k2) {
                                newValue[k2] = v2;
                            }
                        });
                    });

                    newValue.dataService = data[key].dataService = "mock";
                    newValue.layerId = layerId;
                    newValue.id = data[key].id = value.properties.featureId;
                    newValue.geometry = value.geometry;
                    newValue.type = value.type;

                    context.sandbox.dataStorage.addData({
                        "datasetId": layerId,
                        "data": newValue
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
