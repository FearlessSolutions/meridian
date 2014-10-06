define([
    'jquery',
    'backbone'
], function($, Backbone){

    var exposed = {
        initialize: function(app) {
            var sortedPropertiesArray = [];
            var columns = {
                "lat": [{
                    "displayName": "Lat",
                    "weight": 0
                }],
                "lon":[{
                    "displayName": "Lon",
                    "weight": 0
                }],
                "dataService": [{
                    "displayName": "Data Service",
                    "weight": 0
                }],
                "featureId": [{
                    "displayName": "Feature ID",
                    "weight": 0
                }],
                "layerId": [{
                    "displayName": "Layer ID",
                    "weight": 0
                }]
            };
            var dataStorage = {
				"datasets": {
                },
                addData: function(params) {
                    dataStorage.datasets[params.datasetId].add(params.data);
//                    if(dataStorage.datasets) {
//                        dataStorage.updateColumns({"data": params.data});
//                    }
                },
                /**
                 * Add columns from new data into dataStorage
                 * If a column already exists, use the new weight if it is higher
                 * TODO what happens if multiple datasources have different displayNames for the same property?
                 * @param params
                 *      params.keys - The new keys to add to dataStorage
                 */
                "addColumnKeys": function(params){
                    $.each(params.keys, function(newKeyName, newKeyMetadata){
                        var currentKeyMetadata = dataStorage.columns[newKeyName];
                        if(!currentKeyMetadata){
                            dataStorage.columns[newKeyName] = newKeyMetadata;
                        } else if(currentKeyMetadata.weight < newKeyMetadata.weight){
                            dataStorage.columns[newKeyName].weight = newKeyMetadata.weight;
                        }
                    });
                },
                getDatasetWhere: function(params) {
                    return (dataStorage.datasets[params.datasetId]) ? dataStorage.datasets[params.datasetId].where(params.criteria) : [];
                },
                updateColumns: function(params) {
                    $.each(params.data, function(k, v) {
                        // Skipping id field because it is for backbone modeling
                        if(($.type(v) === 'string' || $.type(v) === 'number' || $.type(v) === 'boolean') && k !== 'id' && k !== 'type') {
                            if(!dataStorage.columns[k]) {
                                dataStorage.columns[k] = k;
                            }
                        }
                    });
                },
                getColumns: function() {
                    return dataStorage.columns;
                },
                clear: function() {
                    dataStorage.datasets = {};
                },
                getFeatureById: function(params, callback) {
                    var featureId = params.featureId;
                    var feature = {};
                    var ajax = $.ajax({
                        type: "GET",
                        url: app.sandbox.utils.getCurrentNodeJSEndpoint() + '/feature/' + featureId
                    }).done(function(data) {
                        callback(data);
                    });

                    return ajax;
                },
                getResultsByQueryAndSessionId: function(queryId, sessionId, start, size, callback) {
                    $.ajax({
                        type: "GET",
                        url: app.sandbox.utils.getCurrentNodeJSEndpoint() + '/feature/query/' + queryId + '/session/' + sessionId +
                            '?start=' + start + '&size=' + size
                    }).done(function(data) {
                        callback(null, data);
                    }).error(function(error) {
                        callback(error, null);
                    });
                },
                "insertKey": function(params){
                    var property = params.property,
                        newMetadata = params.metadata,
                        currentMetadata;

                    dataStorage[property].forEach(function(index, entry){
                        if(entry.displayName === newMetadata.displayName){
                            if(entry.weight >= newMetadata.weight){
                                return;
                            }else{
                                binaryDelete();
                                binaryInsert();

                                return;
                            }
                        }
                    });

                    //No match
                    binaryInsert();
                }
			};

            var binaryInsert = function(property, displayName, weight){
                var newEntry,
                    currentEntry,
                    bottomIndex = 0,
                    middleIndex,
                    topIndex = sortedPropertiesArray.length - 1;

                newEntry = {
                    "property": property,
                    "displayName": displayName,
                    "weight": weight
                };

                if(topIndex === -1){
                    sortedPropertiesArray.push(property)
                }else{
                    while(topIndex >= bottomIndex){
                        middleIndex = Math.floor((bottomIndex + topIndex) / 2);
                        currentEntry = sortedPropertiesArray[middleIndex];
                        if(weight === currentEntry.weight){
                            //TODO insert

                            return;
                        }else if(weight < currentEntry.weight){
                            topIndex = middleIndex;
                        }else{
                            bottomIndex = middleIndex + 1;
                        }
                    }

                    //Didn't match anything already there
                    if()
                }

            };

            var binaryDelete = function(params){

            };

            //Fill sortedColumnsArray
            $.each(dataStorage, function(property, metadata){
                dataStorage.insertKey({
                    "property": property,
                    "metadata": metadata
                })
            });
            app.sandbox.dataStorage = dataStorage;

        }
    };


    return exposed;

});
