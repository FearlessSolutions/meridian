define([
], function(){
    /**
     * @exports data-storage-extension
     */
    var exposed = {
        /**
         * All Meridian extensions require an 'initialize' function to begin the loading process of the extension.
         * This extension exposes {@link Sandbox.dataStorage} to the {@link Sandbox} namespace and sets the defauld columns
         * for the datagrid.
         * @function
         * @instance
         * @param {Object} app Instance of the Meridian application.
         */
        initialize: function(app) {
            var sortedPropertiesArray = [];
            /**
             * Default columns for the datagrid.
             * @var columns
             * @instance
             * @property {Array} lat                      - Each object has information about the name and location 
             *                                              of each feature property, and it should focus on a different dataSource.
             * @property {String} lat.property            - Name of the property of the feature
             * @property {String} lat.displayName         - Name used in the datagrid.
             * @property {String} lat.weigth              - Number used to specify the location in the datagrid. Higher weight means more to the left.
             * 
             * @property {Array} lon                      - Each object has information about the name and location 
             *                                              of each feature property, and it should focus on a different dataSource.
             * @property {String} lon.property            - Name of the property of the feature
             * @property {String} lon.displayName         - Name used in the datagrid.
             * @property {String} lon.weigth              - Number used to specify the location in the datagrid. Higher weight means more to the left.
             * 
             * @property {Array} dataService              - Each object has information about the name and location 
             *                                              of each feature property, and it should focus on a different dataSource.
             * @property {String} dataService.property    - Name of the property of the feature
             * @property {String} dataService.displayName - Name used in the datagrid.
             * @property {String} dataService.weigth      - Number used to specify the location in the datagrid. Higher weight means more to the left.
             * 
             * @property {Array} featureId                - Each object has information about the name and location 
             *                                              of each feature property, and it should focus on a different dataSource.
             * @property {String} featureId.property      - Name of the property of the feature
             * @property {String} featureId.displayName   - Name used in the datagrid.
             * @property {String} featureId.weigth        - Number used to specify the location in the datagrid. Higher weight means more to the left.
             * 
             * @property {Array} layerId                  - Each object has information about the name and location 
             *                                              of each feature property, and it should focus on a different dataSource.
             * @property {String} layerId.property        - Name of the property of the feature
             * @property {String} layerId.displayName     - Name used in the datagrid.
             * @property {String} layerId.weigth          - Number used to specify the location in the datagrid. Higher weight means more to the left.
             * 
             * @memberof module:data-storage-extension
             */
            var columns = {
                lat: [{
                    property: "lat",
                    displayName: "Lat",
                    weight: 100
                },
                {
                    property: "LAT",
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
                }],
                featureId: [{
                    property: "featureId",
                    displayName: "Feature ID",
                    weight: 0
                }],
                layerId: [{
                    property: "layerId",
                    displayName: "Layer ID",
                    weight: 0
                }]
            };
            /**
             * .
             * @namespace Sandbox.dataStorage
             * @memberof Sandbox
             */
            var dataStorage = {
                /**
                 * Variable used to hold all datasets.
                 * @namespace Sandbox.dataStorage.datasets
                 * @memberof Sandbox.dataStorage
                 */
				datasets: {}, //Start empty
                /**
                 * Add data to specific dataSet found in {@link Sandbox.dataStorage.datasets datasets} by Id.
                 * @function
                 * @instance
                 * @param {Object} params                - Payload containg the information needed.
                 * @param {Object} params.datasetId      - Id of the dataSet.
                 * @param {Object} params.data           - Data to be added.
                 * @memberof Sandbox.dataStorage
                 */
                addData: function(params) {
                    dataStorage.datasets[params.datasetId].add(params.data);
                },
                /**
                 * Get a dataset based on an Id and criteria provided.
                 * @function
                 * @instance
                 * @param {Object} params           - Object with the required properties.
                 * @param {String} params.datasetId - Id of the dataset.
                 * @param {String} params.criteria  - Criteria used to get the desired dataset.
                 * @return {Object|Array} Matching dataset with the criteria provided. 
                 * If no value found it returns and empty array.
                 * @memberof Sandbox.dataStorage
                 */
                getDatasetWhere: function(params) {
                    return (dataStorage.datasets[params.datasetId]) ? dataStorage.datasets[params.datasetId].where(params.criteria) : [];
                },
                /**
                 * Provides the array of sorted Properties. 
                 * @function
                 * @instance
                 * @memberof Sandbox.dataStorage
                 */
                getColumns: function() {
                    return sortedPropertiesArray;
                },
                /**
                 * Provides the ordered array of column headers. 
                 * @function
                 * @instance
                 * @memberof Sandbox.dataStorage
                 */
                getColumnsDisplayNameArray: function(){
                    var columnsArray = [];
                    sortedPropertiesArray.forEach(function(entry, index){
                        columnsArray.push(entry.displayName);
                    });

                    return columnsArray;
                },
                /**
                 * Clear all contents in {@link Sandbox.dataStorage.datasets datasets}.
                 * @function
                 * @instance
                 * @memberof Sandbox.dataStorage
                 */
                clear: function() {
                    dataStorage.datasets = {};
                },
                /**
                 * Retrieves feature by id using server end point: 
                 * {@link Sandbox.utils#getCurrentNodeJSEndpoint endpoint}/feature/featureId
                 * @function
                 * @instance
                 * @param {Object}   params          
                 * @param {String}   params.featureId - Id of the desired feature.
                 * @param {Function} callback         - Used when ajax.done occurs. 
                 * @memberof Sandbox.dataStorage
                 */
                getFeatureById: function(params, callback) {
                    var featureId = params.featureId;

                    return ajax = $.ajax({
                        type: "GET",
                        url: app.sandbox.utils.getCurrentNodeJSEndpoint() + "/feature/" + featureId
                    }).done(function(data) {
                        callback(data);
                    });
                },
                /**
                 * Retrieves results based on query and session Id using: 
                 * {@link Sandbox.utils#getCurrentNodeJSEndpoint endpoint}
                 * /feature/query/queryId/session/sessionId?start=param&size=param
                 * @param  {String}   queryId   - Id of the query where results want to be found.
                 * @param  {String}   sessionId - Id of the session where results want to be found.
                 * @param  {String}   start     - Description needed.
                 * @param  {String}   size      - Description needed.
                 * @param  {Function} callback  - Used when ajax.done occurs.
                 * @function
                 * @instance
                 * @memberof Sandbox.dataStorage
                 */
                getResultsByQueryAndSessionId: function(queryId, sessionId, start, size, callback) {
                    $.ajax({
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
                 * Insert new keys into sortedPropertiesArray, and note them in columns.
                 * @function
                 * @instance
                 * @params params - The new keys.
                 * @memberof Sandbox.dataStorage
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

            
              // This function CAN NOT BE ACCESSED directly. Insert property into sortedPropertiesArray
              // This uses a version of binary insert based on weight.
              // When a new property is inserted, and there is another property with the same weight,
              // the new property is added after all matching weights.
              // Higher weight == more to the left
              // @param newMetadata
              // @instance
              // @memberof module:data-storage-extension
             
            var binaryInsert = function(newMetadata){
                var weight = newMetadata.weight,
                    bottomIndex = 0,
                    topIndex = sortedPropertiesArray.length - 1,
                    currentIndex,
                    currentEntry;

                
                  // Finds the index AFTER the top index where the weight matches.
                  // This is where the splice should happen
                  // @param thisIndex
                  // @param thisWeight
                  // @returns {*}
                 
                var findTopEqualIndex = function(thisIndex, thisWeight){
                    var thisEntry = sortedPropertiesArray[thisIndex];
                    while(thisEntry && thisEntry.weight === thisWeight){
                        thisIndex++;
                        thisEntry = sortedPropertiesArray[thisIndex];
                    }

                    return thisIndex;
                };

                
                  // See if the given index is the end of the array
                  // @param thisIndex
                  // @returns {boolean}
                 
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

            
             //  Remove property from sortedPropertiesArray.
             //  Uses a variant of binary search to find the property
             // @param metadata
             
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
