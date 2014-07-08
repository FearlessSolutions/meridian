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
        executeQuery: function(args) {
            // Set a query ID to pass to the server
            args.queryId = context.sandbox.utils.UUID();

            // Create the snapshot prior to executing query, so user knows something happened
            if(!context.sandbox.dataStorage.datasets[args.queryId]) {
                context.sandbox.dataStorage.datasets[args.queryId] = new Backbone.Collection();

                publisher.createLayer({
                    "queryId": args.queryId,
                    "name": args.name,
                    "selectable": true,
                    "coords": {
                        "minLat": args.minLat,
                        "minLon": args.minLon,
                        "maxLat": args.maxLat,
                        "maxLon": args.maxLon
                    }
                });
            }

            queryData(args);

            publisher.publishMessage({
                "messageType": "success",
                "messageTitle": "Data Service",
                "messageText": args.name + " query initiated"
            });

        },
        stop: function(args){
            abortQuery(args.queryId);
        },
        clear: function(){
            stopAllAJAX();
            context.sandbox.dataStorage.clear();

        }
    };

    function queryData(args) {
        var newAJAX = context.sandbox.utils.ajax({
            type: 'POST',
            url: 'https://localhost:3000/query/bbox/' + args.serviceName,
            data: {
                "throttleMs": 0,
                "minLat": args.minLat,
                "minLon": args.minLon,
                "maxLat": args.maxLat,
                "maxLon": args.maxLon,
                "start": args.start || 0,
                "queryId": args.queryId || null,
                "pageSize": args.pageSize
            },
            xhrFields: {
                withCredentials: true
            }
        })
        .done(function(data){
            var queryId,
                newData = [];

            cleanAJAX();

            if (data && data.length > 0){
                queryId = args.queryId || data[0].properties.queryId;

                publisher.publishMessage({
                    "messageType": "info",
                    "messageTitle": "Data Service",
                    "messageText": data.length+ " events have been added to " + args.name + " query layer."
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
                        "datasetId": queryId,
                        "data": newValue
                    });

                    newData.push(newValue);
                });

                // Clear data out from memory
                data = [];

                publisher.publishData({
                    "queryId": queryId,
                    "data": newData
                });

                args.start = parseInt(args.start || 0) + parseInt(args.pageSize);
                args.queryId = queryId;
                queryData(args);
            } else {
                publisher.publishMessage({
                    "messageType": "success",
                    "messageTitle": "Data Service",
                    "messageText": args.name + " query complete"
                });
                publisher.publishFinish({
                    "queryId": args.queryId
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
                "queryId": args.queryId
            });

            return false;
        }); 

        newAJAX.queryId = args.queryId;
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
    function abortQuery(queryId){
        activeAJAXs.forEach(function(ajax, index){
            if(ajax.queryId === queryId){ //This was set in queryData
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
    };

    return exposed;

});
