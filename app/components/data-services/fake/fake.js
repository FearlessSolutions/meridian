define([
    './fake-publisher'
], function(publisher) {

    var context,
        DATASOURCE_NAME = 'fake',
        RESTORE_PAGE_SIZE = 500;

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
                    createLayer(params);
                }

                initiateQuery(params.name);
                queryData(params);
            }
        },
        stopQuery: function(params) {
            var layerState,
                dataTransferState,
                queryId = params.layerId,
                dataset = context.sandbox.dataStorage.datasets[queryId];

            //If the query is not related to this datasource, ignore
            if(dataset && dataset.dataService !== DATASOURCE_NAME){
                return;
            }

            context.sandbox.ajax.stopQuery({
                layerId: queryId
            });

            // Handle notifcations and state
            layerState = context.sandbox.stateManager.getLayerStateById({layerId: queryId});
            if(layerState) {
                // Check state manager for status of layer, if already stopped or finished don't publish message or change state
                dataTransferState = layerState.dataTransferState;

                if(dataTransferState !== 'stopped' && dataTransferState !== 'finished') {
                    publisher.publishMessage({
                        messageType: 'warning',
                        messageTitle: 'Data Service',
                        messageText: 'Query data transfer was stopped.'
                    });

                    publisher.removeFromProgressQueue();

                    context.sandbox.stateManager.setLayerStateById({
                        layerId: queryId,
                        state: {
                            dataTransferState: 'stopped'
                        }
                    });
                }
            }

        },
        clear: function() {
            var queryId;

            for(queryId in context.sandbox.dataStorage.datasets){
                if(context.sandbox.dataStorage.datasets[queryId].dataService === DATASOURCE_NAME){
                    delete context.sandbox.dataStorage.datasets[queryId];
                }
            }

            context.sandbox.ajax.clear();
        },
        deleteDataset: function(params) {
            // delete context.sandbox.dataStorage.datasets[params.layerId]; // TODO: like the clear above, use a method on dataStorage to delete layer instead of calling a delete directly
        },
        restoreDataset: function(params) {
            var queryName = params.queryName,
                queryId = params.queryId,
                bbox = params.queryBbox,
                minLat,
                maxLat,
                minLon,
                maxLon,
                getPage;

            //If the query is not related to this datasource, ignore
            if(params.dataSource === DATASOURCE_NAME) {
                if(!context.sandbox.dataStorage.datasets[queryId]) {
                    if(bbox){
                        minLat = bbox.minLat;
                        maxLat = bbox.maxLat;
                        minLon = bbox.minLon;
                        maxLon = bbox.maxLon;
                    }else {
                        minLat = null;
                        maxLat = null;
                        minLon = null;
                        maxLon = null;
                    }

                    createLayer({
                        queryId: queryId,
                        name: queryName,
                        minLat: minLat,
                        minLon: minLon,
                        maxLat: maxLat,
                        maxLon: maxLon
                    });
                    initiateQuery(queryName);

                    getPage = function(params, start, pageSize){
                        var newAJAX = context.sandbox.dataStorage.getResultsByQueryAndSessionId(queryId, params.sessionId, start, pageSize, function(err, results){
                            if(err) {
                                //If the error was because we aborted, ignore
                                if(err.statusText === 'abort') {
                                    return;
                                }
                                handleError({queryId: queryId});
                            } else if (!results || results.length === 0) {
                                completeQuery(queryName, queryId);
                            } else {
                                processDataPage(results, {
                                                            queryId: queryId,
                                                            name: queryName
                                                        });
                                getPage(params, start + RESTORE_PAGE_SIZE, RESTORE_PAGE_SIZE);
                            }
                        });

                        context.sandbox.ajax.addActiveAJAX({
                            newAJAX: newAJAX,
                            layerId: queryId
                        });
                    };

                    getPage(params, 0, RESTORE_PAGE_SIZE);

                } else {
                    // TODO: What do we do if the data set is already on the map?
                    publisher.publishMessage({
                        messageType: 'warning',
                        messageTitle: 'Data Service',
                        messageText: 'Dataset already loaded.'
                    });
                }
            }
        }
    };

    function createLayer(params) {
        var queryId = params.queryId,
            queryName = params.name;

        context.sandbox.dataStorage.datasets[queryId] = new Backbone.Collection();
        context.sandbox.dataStorage.datasets[queryId].dataService = DATASOURCE_NAME;
        context.sandbox.dataStorage.datasets[queryId].layerName = queryName || queryId;

        publisher.createLayer({
            layerId: queryId,
            name: queryName,
            selectable: true,
            coords: {
                minLat: params.minLat,
                minLon: params.minLon,
                maxLat: params.maxLat,
                maxLon: params.maxLon
            }
        });
    }

    function initiateQuery(queryName) {
        publisher.publishMessage({
            messageType: 'success',
            messageTitle: 'Data Service',
            messageText: queryName + ' query initiated'
        });
        publisher.addToProgressQueue();
    }

    function completeQuery(name, queryId) {
        publisher.publishMessage({
            messageType: 'success',
            messageTitle: 'Data Service',
            messageText: name + ' query complete'
        });

        context.sandbox.stateManager.setLayerStateById({
            layerId: queryId,
            state: {
                dataTransferState: 'finished'
            }
        });

        publisher.publishFinish({
            layerId: queryId
        });

        publisher.removeFromProgressQueue();
    }

    function processDataPage(data, params) {
        var queryId = params.queryId || data[0].properties.queryId,
            newData = [],
            keys = context.sandbox.dataServices[DATASOURCE_NAME].keys,
            newKeys = {};

        publisher.publishMessage({
            messageType: 'info',
            messageTitle: 'Data Service',
            messageText: data.length+ ' events have been added to ' + params.name + ' query layer.'
        });

        context.sandbox.stateManager.setLayerStateById({
            layerId: queryId,
            state: {
                dataTransferState: 'running'
            }
        });

        //For each feature, create the minimized feature to be stored locally, with all the fields needed for datagrid
        context.sandbox.utils.each(data, function(dataIndex, dataFeature){
            var newValue = {
                dataService: DATASOURCE_NAME,
                layerId: queryId,
                id: data[dataIndex].id = dataFeature.properties.featureId,
                geometry: dataFeature.geometry,
                type: dataFeature.type,
                properties: {},
                lat: dataFeature.geometry.coordinates[1],
                lon: dataFeature.geometry.coordinates[0],
                featureId: dataFeature.properties.featureId
            };

            if(keys){
                //For each of the keys required, if that property exists in the feature, hoist it
                //and give it the specified header name
                context.sandbox.utils.each(keys, function(index, keyMetadata){
                    if(dataFeature.properties[keyMetadata.property] !== undefined){
                        newValue[keyMetadata.property] = dataFeature.properties[keyMetadata.property];
                        if(!newKeys[keyMetadata.property]){
                            newKeys[keyMetadata.property] = keyMetadata;
                        }
                    }
                });
            }

            data[dataIndex].dataService = DATASOURCE_NAME;

            context.sandbox.dataStorage.addData({
                datasetId: queryId,
                data: newValue
            });

            // Add style properties for map features, but not for local dataset storage
            context.sandbox.utils.each(context.sandbox.icons.getIconForFeature(dataFeature), function(styleKey, styleValue){
                newValue.properties[styleKey] = styleValue;
            });

            newData.push(newValue);
        });

        //Add new keys for the datagrid
        context.sandbox.dataStorage.insertKeys({
            keys: newKeys
        });

        // Clear data out from memory
        data = [];

        publisher.plotFeatures({
            layerId: queryId,
            data: newData
        });
    }

    function handleError(params) {
        publisher.publishMessage({
            messageType: 'error',
            messageTitle: 'Data Service',
            messageText: 'Connection to data service failed.'
        });

        publisher.removeFromProgressQueue();

        context.sandbox.stateManager.setLayerStateById({
            layerId: params.queryId,
            state: {
                dataTransferState: 'error'
            }
        });

        publisher.publishError({
            layerId: params.queryId
        });
    }

    function queryData(params) {
        var queryId = params.queryId,
            queryName = params.name,
            query,
            metadata,
            newAJAX;

        query = {
            throttleMs: 0,
            start: params.start || 0,
            pageSize: params.pageSize
        };

        metadata = {
            queryId: queryId,
            queryName: queryName,
            minLat: params.minLat,
            minLon: params.minLon,
            maxLat: params.maxLat,
            maxLon: params.maxLon,
            justification: params.justification
        };

        newAJAX = context.sandbox.utils.ajax({
            type: 'POST',
            url: context.sandbox.utils.getCurrentNodeJSEndpoint() + '/query/bbox/' + params.dataSourceId,
            data: {
                query: query,
                metadata: metadata
            },
            xhrFields: {
                withCredentials: true
            }
        })
        .done(function(data) {
            if(data && data.length > 0) {
                // Process and then loop to the next page
                processDataPage(data, params);
                params.start = parseInt(params.start || 0) + parseInt(params.pageSize);
                queryData(params);
            } else {
                completeQuery(queryName, queryId);
            }

        })
        .error(function(e) {
            //If the error was because we aborted, ignore
            if(e.statusText === 'abort') {
                return;
            }
            handleError(params);
            return false;
        });

        context.sandbox.ajax.addActiveAJAX({
            newAJAX: newAJAX,
            layerId: queryId
        });
    }

    return exposed;

});
