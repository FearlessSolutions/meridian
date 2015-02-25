var _ = require('underscore'),
    metadataManager,
    query,
    transform,
    displayNameConverter;

exports.init = function(context){
    query = context.sandbox.elastic.query;
    metadataManager = context.sandbox.elastic.metadata;
    transform = context.sandbox.transform;
    displayNameConverter = context.sandbox.displayText;
};

exports.pipeGeoJSONResponse = function(userName, queryIds, callback, incrementMutex){
    query.streamQuery(userName, {
                                    query:{
                                        terms:{
                                            queryId:queryIds
                                        }
                                    }
                                }, 100, function(queryErr, results) {

        //Tell parent that a new thread has been started
        incrementMutex();

        //Do what is needed for callback
        if(queryErr){
            callback(queryErr, null);
        } else if(results.hits.hits.length === 0){
            callback(null, null);
        }else{
            try {
                transform.toGeoJSON(resultsToGeoJSON(results), callback);
            }catch(ogrErr){
                callback(ogrErr, null);
            }
        }
    });
};

exports.pipeKMLResponse = function(userName, queryIds, callback, incrementMutex){
    query.streamQuery(userName, {
                                    query:{
                                        terms:{
                                            queryId:queryIds
                                        }
                                    }
                                }, 100, function(queryErr, results) {

        //Tell parent that a new thread has been started
        incrementMutex();

        //Do what is needed for callback
        if(queryErr){
            callback(queryErr, null);
        } else if(results.hits.hits.length === 0){
            callback(null, null);
        }else{
            try {
                transform.toKML(resultsToGeoJSON(results), callback);
            }catch(ogrErr){
                callback(ogrErr, null);
            }
        }
    });
};

// Query metadata by user
// Remove anything that doesn't match the query id
// Query for all records that match any of the query ids
exports.pipeCSVToResponseForQuery = function(userName, queryIdArray, res){
    // Query metadata
    metadataManager.getMetadataByUserId(userName, function(err, meta) {
        var needToCreateLAT = false, //If there is a need to create the keys, for when they are not already included
            needToCreateLON = false,
            // Handle keyToIndex map
            keyToIndexMap = {},
            queryIdToMetadataMap = {},
            maxIndex = 0,
            buffer,
            headerRow;

        if (err) {
            res.status(500);
            res.send("Error - couldn't fetch metadata for " + userName);
            return;
        }


        _.each(meta, function (metadata, queryId) {
            if (_.indexOf(queryIdArray, queryId) !== -1) {
                queryIdToMetadataMap[queryId] = metadata.toJSON(); //Add all metadata for the query to the map

                //Find all the keys in the query, and add the to the list if needed
                _.each(metadata.getKeys(), function (value, key) {
                    if (keyToIndexMap[key] === undefined) {
                        keyToIndexMap[key] = maxIndex;
                        maxIndex += 1;
                    }
                });
            }
        });

        //Make sure that LAT and LON are there for future upload
        if (keyToIndexMap.LAT === undefined) {
            keyToIndexMap.LAT = maxIndex;
            needToCreateLAT = true;
            maxIndex++;
        }
        if (keyToIndexMap.LON === undefined) {
            keyToIndexMap.LON = maxIndex;
            needToCreateLON = true;
            maxIndex++;
        }
        if (keyToIndexMap.meridianDataSource === undefined) {
            keyToIndexMap.meridianDataSource = maxIndex;
            maxIndex++;
        }
        if (keyToIndexMap.meridianQueryName === undefined) {
            keyToIndexMap.meridianQueryName = maxIndex;
            maxIndex++;
        }

        // Generate header row
        buffer = '\ufeff'; // UTF-8 Byte Order Mark, used by excel
        headerRow = new Array(maxIndex);
        _.each(keyToIndexMap, function (index, key) {
            headerRow[index] = key;
        });

        buffer = _writeArray(buffer, headerRow);

        query.streamQuery(userName, {query:{"terms":{"queryId":queryIdArray}}}, 100, function (err, results) {

            if (results.hits.hits.length === 0) {
                // Pipe file to response object
                res.end(buffer);

            } else {
                // Write data rows
                _.each(results.hits.hits, function (result) {
                    var row = new Array(maxIndex),
                        featureQueryMetadata = queryIdToMetadataMap[result._source.properties.queryId];

                    _.each(result._source.properties, function (value, key) {
                        var index = keyToIndexMap[key];
                        row[index] = value;
                    });

                    //If required, add LAT and LON based on Point geometry
                    if (needToCreateLAT) {
                        row[keyToIndexMap.LAT] = result._source.geometry.coordinates[1];
                    }
                    if (needToCreateLON) {
                        row[keyToIndexMap.LON] = result._source.geometry.coordinates[0];
                    }

                    row[keyToIndexMap.meridianDataSource] = displayNameConverter.toDisplay(featureQueryMetadata.dataSource);
                    row[keyToIndexMap.meridianQueryName] = featureQueryMetadata.queryName;

                    buffer = _writeArray(buffer, row);
                });

                if (buffer.length > 5 * 1024 * 1024) {
                    res.write(buffer);
                    buffer = "";
                }
            }
        });
    });
};


// copy pasted from ya-csv's library in npm
function _appendField(outArr, field) {
    // Make sure field is a string
    if(typeof(field) !== 'string'){
        // We are not interested in outputting "null" or "undefined"
        if(typeof(field) !== 'undefined' && field !== 'null'){
            field = String(field);
        } else {
            outArr.push('');
            return;
        }
    }

    for (var i = 0; i < field.length; i++) {
        if (field.charAt(i) === '"') {
            outArr.push('"');
        }
        outArr.push(field.charAt(i));
    }
}

// copy pasted from ya-csv's library in npm
function _writeArray(buffer, row){
    var out = [];
    for (var i = 0; i < row.length; i++){
        if(i != 0) out.push(',');
        out.push('"');
        _appendField(out, row[i]);
        out.push('"');
    }
    out.push('\r\n');
    buffer += out.join('');
    return buffer;
}

/**
 * Turns database results into normal geoJSON
 * @param results
 */
function resultsToGeoJSON(results){
    var collection = {
        type: 'FeatureCollection',
        features: []
    };

    results.hits.hits.forEach(function(feature){
        collection.features.push(feature._source);
    });

    return collection;
}
