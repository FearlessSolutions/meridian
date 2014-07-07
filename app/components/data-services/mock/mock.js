define([
    './mock-publisher'
], function(publisher) {

    var context;

    var exposed = { 

        init: function(thisContext) {
            context = thisContext;
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
                    "coords": {
                        "minLat": args.minLat,
                        "minLon": args.minLon,
                        "maxLat": args.maxLat,
                        "maxLon": args.maxLon
                    }
                });

                publisher.plotFeatures({
                    "layerId": args.queryId,
                    "data": [{
                        "queryId": args.queryId,
                        "featureId": "_aoi",
                        "dataService": "mock",
                        "id": "_aoi",
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [[
                                [args.minLon, args.maxLat],
                                [args.maxLon, args.maxLat],
                                [args.maxLon, args.minLat],
                                [args.minLon, args.minLat]
                            ]]
                        },
                        "type": "Feature"
                    }]
                });
            }

            queryData(args);

            publisher.publishMessage({
                "messageType": "success",
                "messageTitle": "Data Service",
                "messageText": args.name + " query initiated"
            });

        },
        clear: function(){
            context.sandbox.dataStorage.clear();
        }

    };

    function queryData(args) {
        context.sandbox.utils.ajax({
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
    }

    return exposed;

});
