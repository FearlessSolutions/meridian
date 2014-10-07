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
                    "weight": 80
                }],
                "lon":[{
                    "displayName": "Lon",
                    "weight": 0
                }],
                "dataService": [{
                    "displayName": "Data Service",
                    "weight": 5
                }],
                "featureId": [{
                    "displayName": "Feature ID",
                    "weight": 90
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
                "getColumns": function() {
                    var propertyToDisplayNameMap = {};
                    sortedPropertiesArray.forEach(function(entry, index){
                        propertyToDisplayNameMap[entry.property] = entry.displayName;
                    });
                    return propertyToDisplayNameMap;
                },
                "getColumnsArray": function(){
                    var columnsArray = [];
                    sortedPropertiesArray.forEach(function(entry, index){
                        columnsArray.push(entry.displayName);
                    });

                    return columnsArray;
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
                "insertKeys": function(params){
                    $.each(params.keys, function(property, newMetadata){
                        var propertyEntryArray = columns[property],
                            index,
                            entry;

                        if(!propertyEntryArray){
                            columns[property] = [newMetadata];
                            propertyEntryArray = columns[property];

                            binaryInsert(property, newMetadata.displayName, newMetadata.weight);
                        }else{
                            for(index = 0; index < propertyEntryArray.length; index++){
                                entry = propertyEntryArray[index];

                                if(entry.displayName === newMetadata.displayName){
                                    if(entry.weight >= newMetadata.weight){
                                        return;
                                    }else{
                                        binaryDelete(property, newMetadata.displayName, newMetadata.weight);
                                        binaryInsert(property, newMetadata.displayName, newMetadata.weight);

                                        return;
                                    }
                                }
                            }

                            //No match
                            columns[property].push(newMetadata);
                            binaryInsert(property, newMetadata.displayName, newMetadata.weight);
                        }
                    });
                }
			};

            var binaryInsert = function(property, displayName, weight){
                var newEntry,
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
                    if(thisIndex === sortedPropertiesArray.length){
                        return true;
                    }else{
                        return false;
                    }
                };

                newEntry = {
                    "property": property,
                    "displayName": displayName,
                    "weight": weight
                };

                if(topIndex === -1){
                    sortedPropertiesArray.push(newEntry);
                }else{
                    while(bottomIndex <= topIndex){
                        currentIndex = (bottomIndex + topIndex) / 2 | 0;
                        currentEntry = sortedPropertiesArray[currentIndex];

                        //If top and bottom indicies are the same, then we found the correct middle
                        if(bottomIndex === topIndex){
                            if(currentEntry.weight === weight){
                                currentIndex = findTopEqualIndex(topIndex, weight);
                                if(checkEndOfArray(currentIndex)){
                                    sortedPropertiesArray.push(newEntry);
                                }else{
                                    sortedPropertiesArray.splice(currentIndex);
                                }
                            }else if(currentEntry.weight < weight){
                                sortedPropertiesArray.splice(currentIndex, 0, newEntry);
                            }else {
                                currentIndex++; //It should be put on the right, so increment; check for end of array
                                if(checkEndOfArray(currentIndex)){
                                    sortedPropertiesArray.push(newEntry);
                                }else{
                                    sortedPropertiesArray.splice(currentIndex, 0, newEntry);
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
                                    sortedPropertiesArray.push(newEntry);
                                } else{
                                    sortedPropertiesArray.splice(findTopEqualIndex(currentIndex, weight), 0, newEntry);
                                }

                                return;
                            }
                        }
                    }
                }
            };

            var binaryDelete = function(property, displayName, weight){
                var currentEntry,
                    bottomIndex = 0,
                    middleIndex,
                    topIndex = sortedPropertiesArray.length - 1;

                while(topIndex >= bottomIndex){
                    middleIndex = (bottomIndex + topIndex) / 2 | 0;
                    currentEntry = sortedPropertiesArray[middleIndex];
                    if(weight === currentEntry.weight){
                        //Found a matching weight; Find matching entry
                        bottomIndex = middleIndex;
                        topIndex = middleIndex;
                        while(currentEntry.weight === weight){
                            if(currentEntry.property === property && currentEntry.displayName === displayName){
                                sortedPropertiesArray.splice(topIndex, 1);
                                return;
                            }

                            topIndex++;
                            currentEntry = sortedPropertiesArray[topIndex];
                        }

                        //Didn't find on the way up
                        bottomIndex--;
                        currentEntry = sortedPropertiesArray[bottomIndex];
                        while(currentEntry.weight === weight){
                            if(currentEntry.property === property && currentEntry.displayName === displayName){
                                sortedPropertiesArray.splice(bottomIndex, 1);
                                return;
                            }
                            bottomIndex--;
                            currentEntry = sortedPropertiesArray[bottomIndex];
                        }

                        return;
                    }else if(weight < currentEntry.weight){
                        topIndex = middleIndex - 1;
                    }else{
                        bottomIndex = middleIndex + 1;
                    }
                }

                //Didn't match anything already there
            };

            //Fill sortedColumnsArray
            $.each(columns, function(property, propertyArray){
                propertyArray.forEach(function(propertyEntry, index){
                    binaryInsert(property, propertyEntry.displayName, propertyEntry.weight);
                });
            });
            app.sandbox.dataStorage = dataStorage;

        }
    };


    return exposed;

});
