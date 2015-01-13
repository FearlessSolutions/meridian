define([
    'jquery',
    'backbone'
], function(){

    var exposed = {
        initialize: function(app) {
            var sortedPropertiesArray = [];
            //Default columns for the datagrid.
            // property = given property from data
            // displayName = text to display in the datagrid as a header
            // weight How important the column is. Higher weight = more important = more to the left
            var columns = {
                lat: [{
                    property: "lat",
                    displayName: "Lat",
                    weight: 100
                }],
                lon:[{
                    property: "lon",
                    displayName: "Lon",
                    weight: 100
                }],
                dataService: [{
                    property: "dataService",
                    displayName: "Data Service",
                    weight: 5
                }]
            };
            var dataStorage = {
				datasets: {}, //Start empty
                addData: function(params) {
                    dataStorage.datasets[params.datasetId].add(params.data);
                },
                getDatasetWhere: function(params) {
                    return (dataStorage.datasets[params.datasetId]) ? dataStorage.datasets[params.datasetId].where(params.criteria) : [];
                },
                getColumns: function() {
                    return sortedPropertiesArray;
                },
                /**
                 *  Get the ordered array of column headers
                 */
                getColumnsDisplayNameArray: function(){
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

                    return ajax = $.ajax({
                        type: "GET",
                        url: app.sandbox.utils.getCurrentNodeJSEndpoint() + "/feature/" + featureId
                    }).done(function(data) {
                        callback(data);
                    });
                },
                getResultsByQueryAndSessionId: function(queryId, sessionId, start, size, callback) {
                    return $.ajax({
                        type: "GET",
                        url: app.sandbox.utils.getCurrentNodeJSEndpoint() + "/feature/query/" + queryId + "/session/" + sessionId +
                            "?start=" + start + "&size=" + size
                    }).done(function(data) {
                        callback(null, data);
                    }).error(function(error) {
                        callback(error, null);
                    });
                },
                /**
                 * Insert new keys into sortedPropertiesArray, and note them in columns
                 * @param params
                 */
                insertKeys: function(params){
                    $.each(params.keys, function(property, newMetadata){
                        var propertyEntryArray = columns[newMetadata.property],
                            index,
                            entry;

                        //If there isn't any matching property, add it
                        if(!propertyEntryArray){
                            columns[newMetadata.property] = [newMetadata];
                            binaryInsert(newMetadata);

                            return;
                        }else{

                            //Check to see what the old weight is. If the new one is higher, replace it (delete and re-insert)
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
                }
			};

            /**
             * Insert property into sortedPropertiesArray
             * This uses a version of binary insert based on weight,
             * When a new property is inserted, and there is another property with the same weight,
             * the new property is added after all matching weights
             * Higher weight == more to the left
             * @param newMetadata
             */
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

                /**
                 * See if the given index is the end of the array
                 * @param thisIndex
                 * @returns {boolean}
                 */
                var checkEndOfArray = function(thisIndex){
                    return thisIndex === sortedPropertiesArray.length;
                };

                if(topIndex === -1){ //The array is empty; just add it
                    sortedPropertiesArray.push(newMetadata);
                }else{

                    //Keep adjusting the top and bottom indicies to narrow the search;
                    // insert when correct place is found
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
                                    sortedPropertiesArray.splice(currentIndex, 0, newMetadata);
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

            /**
             * Remove property from sortedPropertiesArray.
             * Uses a variant of binary search to find the property
             * @param metadata
             */
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
                        // Since we jumped around, we might be in the middle of a group of
                        // identical weights, so check up and down
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


            //Initialize sortedColumnsArray
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
