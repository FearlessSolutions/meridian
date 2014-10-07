define([
    'jquery',
    'backbone'
], function($, Backbone){

    var exposed = {
        initialize: function(app) {
            var sortedPropertiesArray = [];
            var columns = {
                "lat": [{
                    "property": "lat",
                    "displayName": "Lat",
                    "weight": 80
                }],
                "lon":[{
                    "property": "lon",
                    "displayName": "Lon",
                    "weight": 0
                }],
                "dataService": [{
                    "property": "dataService",
                    "displayName": "Data Service",
                    "weight": 5
                }],
                "featureId": [{
                    "property": "featureId",
                    "displayName": "Feature ID",
                    "weight": 60
                }],
                "layerId": [{
                    "property": "layerId",
                    "displayName": "Layer ID",
                    "weight": 0
                }]
            };
            var dataStorage = {
				"datasets": {}, //Start empty
                "addData": function(params) {
                    dataStorage.datasets[params.datasetId].add(params.data);
                },
                "getDatasetWhere": function(params) {
                    return (dataStorage.datasets[params.datasetId]) ? dataStorage.datasets[params.datasetId].where(params.criteria) : [];
                },
                "updateColumns": function(params) {
                    $.each(params.data, function(k, v) {
                        // Skipping id field because it is for backbone modeling
                        if(($.type(v) === 'string' || $.type(v) === 'number' || $.type(v) === 'boolean') && k !== 'id' && k !== 'type') {
                            if(!dataStorage.columns[k]) {
                                dataStorage.columns[k] = k;
                            }
                        }
                    });
                },
                "getColumns": function() {
                    return sortedPropertiesArray;
//                    var propertyToDisplayNameMap = {};
//                    sortedPropertiesArray.forEach(function(entry, index){
//                        propertyToDisplayNameMap[entry.property] = entry.displayName;
//                    });
//                    return propertyToDisplayNameMap;
                },
                "getColumnsDisplayNameArray": function(){
                    var columnsArray = [];
                    sortedPropertiesArray.forEach(function(entry, index){
                        columnsArray.push(entry.displayName);
                    });

                    return columnsArray;
                },
                "clear": function() {
                    dataStorage.datasets = {};
                },
                "getFeatureById": function(params, callback) {
                    var featureId = params.featureId;
                    var feature = {};
                    var ajax = $.ajax({
                        "type": "GET",
                        "url": app.sandbox.utils.getCurrentNodeJSEndpoint() + "/feature/" + featureId
                    }).done(function(data) {
                        callback(data);
                    });

                    return ajax;
                },
                "getResultsByQueryAndSessionId": function(queryId, sessionId, start, size, callback) {
                    $.ajax({
                        "type": "GET",
                        "url": app.sandbox.utils.getCurrentNodeJSEndpoint() + "/feature/query/" + queryId + "/session/" + sessionId +
                            "?start=" + start + "&size=" + size
                    }).done(function(data) {
                        callback(null, data);
                    }).error(function(error) {
                        callback(error, null);
                    });
                },
                "insertKeys": function(params){
                    $.each(params.keys, function(property, newMetadata){
                        var propertyEntryArray = columns[newMetadata.property],
                            index,
                            entry;

                        if(!propertyEntryArray){
                            columns[newMetadata.property] = [newMetadata];

                            binaryInsert(newMetadata);
                        }else{
                            for(index = 0; index < propertyEntryArray.length; index++){
                                entry = propertyEntryArray[index];

                                if(entry.displayName === newMetadata.displayName){
                                    if(entry.weight >= newMetadata.weight){
                                        return;
                                    }else{
                                        binaryDelete(entry);
                                        binaryInsert(newMetadata);

                                        columns[newMetadata.property][index].weight = newMetadata.weight;

                                        return;
                                    }
                                }
                            }

                            //No match
                            columns[newMetadata.property].push(newMetadata);
                            binaryInsert(newMetadata);
                        }
                    });

                    console.debug(sortedPropertiesArray);
                }
			};

            var binaryInsert = function(newMetadata){
                var weight = newMetadata.weight,
                    bottomIndex = 0,
                    topIndex = sortedPropertiesArray.length - 1,
                    currentIndex,
                    currentEntry;

                /**
                 * Finds the index AFTER the top index where the weight matches.
                 * This is where the splice should happen
                 * @param thisIndex
                 * @param thisWeight
                 * @returns {*}
                 */
                var findTopEqualIndex = function(thisIndex, thisWeight){
                    var thisEntry = sortedPropertiesArray[thisIndex];
                    while(thisEntry && thisEntry.weight === thisWeight){
                        thisIndex++;
                        thisEntry = sortedPropertiesArray[thisIndex];
                    }

                    return thisIndex;
                };

                var checkEndOfArray = function(thisIndex){
                    return thisIndex === sortedPropertiesArray.length;
                };

                if(topIndex === -1){
                    sortedPropertiesArray.push(newMetadata);
                }else{
                    while(bottomIndex <= topIndex){
                        currentIndex = (bottomIndex + topIndex) / 2 | 0;
                        currentEntry = sortedPropertiesArray[currentIndex];

                        //If top and bottom indicies are the same, then we found the correct middle
                        if(bottomIndex === topIndex){
                            if(currentEntry.weight === weight){
                                currentIndex = findTopEqualIndex(topIndex, weight);
                                if(checkEndOfArray(currentIndex)){
                                    sortedPropertiesArray.push(newMetadata);
                                }else{
                                    sortedPropertiesArray.splice(currentIndex);
                                }
                            }else if(currentEntry.weight < weight){
                                sortedPropertiesArray.splice(currentIndex, 0, newMetadata);
                            }else {
                                currentIndex++; //It should be put on the right, so increment; check for end of array
                                if(checkEndOfArray(currentIndex)){
                                    sortedPropertiesArray.push(newMetadata);
                                }else{
                                    sortedPropertiesArray.splice(currentIndex, 0, newMetadata);
                                }
                            }

                            return;
                        }else{
                            if(currentEntry.weight < weight){
                                topIndex = currentIndex - 1;
                            }else if(currentEntry.weight > weight){
                                bottomIndex = currentIndex + 1;
                            }else{
                                //They are equal; Find top entry that matches, and insert there
                                currentIndex = findTopEqualIndex(currentIndex, weight);
                                if(checkEndOfArray(currentIndex)){
                                    sortedPropertiesArray.push(newMetadata);
                                } else{
                                    sortedPropertiesArray.splice(findTopEqualIndex(currentIndex, weight), 0, newMetadata);
                                }

                                return;
                            }
                        }
                    }

                    //It was the highest number so far
                    sortedPropertiesArray.splice(0, 0, newMetadata);
                }
            };

            var binaryDelete = function(metadata){
                var property = metadata.property,
                    displayName = metadata.displayName,
                    weight = metadata.weight,
                    currentEntry,
                    bottomIndex = 0,
                    topIndex = sortedPropertiesArray.length - 1,
                    currentIndex;

                while(bottomIndex <= topIndex){
                    currentIndex = (bottomIndex + topIndex) / 2 | 0;
                    currentEntry = sortedPropertiesArray[currentIndex];

                    if(weight === currentEntry.weight){
                        //Found a matching weight; Find matching entry
                        topIndex = currentIndex;
                        while(topIndex < sortedPropertiesArray.length && currentEntry.weight === weight){
                            if(currentEntry.property === property && currentEntry.displayName === displayName){
                                sortedPropertiesArray.splice(topIndex, 1);
                                return;
                            }

                            topIndex++;
                            currentEntry = sortedPropertiesArray[topIndex];
                        }

                        //Didn't find on the way up
                        bottomIndex--; //Already checked currentIndex
                        currentEntry = sortedPropertiesArray[bottomIndex];
                        while(bottomIndex >= 0 && currentEntry.weight === weight){
                            if(currentEntry.property === property && currentEntry.displayName === displayName){
                                sortedPropertiesArray.splice(bottomIndex, 1);
                                return;
                            }
                            bottomIndex--;
                            currentEntry = sortedPropertiesArray[bottomIndex];
                        }

                        return;
                    }else if(currentEntry.weight < weight){
                        topIndex = currentIndex - 1;
                    }else{
                        bottomIndex = currentIndex + 1;
                    }
                }

                //Didn't match anything already there
            };

            //Fill sortedColumnsArray
            $.each(columns, function(property, propertyArray){
                propertyArray.forEach(function(propertyEntry, index){
                    binaryInsert(propertyEntry);
                });
            });

            app.sandbox.dataStorage = dataStorage;
        }
    };


    return exposed;

});
