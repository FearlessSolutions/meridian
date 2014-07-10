define([
    './mock-publisher'
], function(publisher) {

    var context,
        activeAJAXs;

    var exposed = { 

        init: function(thisContext) {
            context = thisContext;
            activeAJAXs = [];
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
        stop: function(params){
            abortQuery({
                "queryId": params.layerId
            });
        },
        clear: function(){
            stopAllAJAX();
            context.sandbox.dataStorage.clear();

        },
        deleteDataset: function(params) {
            // delete context.sandbox.dataStorage.datasets[params.layerId]; 
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

            cleanAJAX();

            if (data && data.length > 0){
                layerId = params.queryId || data[0].properties.queryId;

                publisher.publishMessage({
                    "messageType": "info",
                    "messageTitle": "Data Service",
                    "messageText": data.length+ " events have been added to " + params.name + " query layer."
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

            cleanAJAX();
            publisher.publishMessage({
                "messageType": "error",
                "messageTitle": "Data Service",
                "messageText": "Connection to data service failed."
            });

            publisher.publishError({
                "layerId": params.queryId
            });

            return false;
        }); 

        newAJAX.queryId = params.queryId;
        activeAJAXs.push(newAJAX);
    }

    function stopAllAJAX(){
        activeAJAXs.forEach(function(ajax){
            ajax.abort();
        });

        activeAJAXs = [];
    }

    /**
     * Stop a query's ajax call,
     * This function requires that ajax.queryId was set when the query was created.
     */
    function abortQuery(params){
        activeAJAXs.forEach(function(ajax, index){
            if(ajax.queryId === params.queryId){ //This was set in queryData
                ajax.abort();
                activeAJAXs.splice(index, 1);
            }
        });
    }

    /**
     * Clean up all finished ajax calls from the activeAJAXs array
     */
    function cleanAJAX(){
        activeAJAXs.forEach(function(ajax, index){
            if(ajax.readyState === 4){ //4 is "complete" status
                activeAJAXs.splice(index, 1);
            }
        });
    }

    return exposed;

});
