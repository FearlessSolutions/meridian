var _ = require('underscore');
var metadataManager = require('./metadata');
var query = require('./query');

exports.pipeCSVToResponse = function(userName, sessionId, res){

    // Query metadata
    metadataManager.getMetadataBySessionId(sessionId, function(err, meta){
        var needToCreateLAT = false; //If there is a need to create the keys, for when they are not already included
        var needToCreateLON = false;
        if (err){
            res.status(500);
            res.send("Error - couldn't fetch metadata for " + sessionId);
            return;
        }

        // Response prep
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename=results.csv');

        // Handle keyToIndex map
        var keyToIndexMap = {};
        var maxIndex = 0;
        _.each(meta, function(metadata, queryId){
            _.each(metadata.keys, function(value, key){
                if (keyToIndexMap[key] === undefined){
                    keyToIndexMap[key] = maxIndex;
                    maxIndex += 1;
                }
            });
        });

        //Make sure that LAT and LON are there for future upload
        if(keyToIndexMap.LAT === undefined){
            keyToIndexMap.LAT = maxIndex;
            needToCreateLAT = true;
            maxIndex++;
        }
        if(keyToIndexMap.LON === undefined){
            keyToIndexMap.LON = maxIndex;
            needToCreateLON = true;
            maxIndex++; //Not required for now, but keeping in case of future additions
        }

        // Generate header row
        var buffer = '\ufeff'; // UTF-8 Byte Order Mark, used by excel
        var headerRow = new Array(maxIndex);
        _.each(keyToIndexMap, function(index, key){
            headerRow[index] = key;
        });

        buffer = _writeArray(buffer, headerRow);

        // Query data
        query.streamQuery(userName, sessionId, {query:{"match_all":{}}}, 100, function(err, results){

            if (results.hits.hits.length === 0){
                // Pipe file to response object
                res.end(buffer);

            } else {
                // Write data rows
                _.each(results.hits.hits, function(result){
                    var row = new Array(maxIndex);
                    _.each(result._source.properties, function(value, key){
                        var index = keyToIndexMap[key];
                        row[index] = value;
                    });

                    //If required, add LAT and LON based on Point geometry
                    if(needToCreateLAT){
                        row[keyToIndexMap.LAT] = result._source.geometry.coordinates[1];
                    }
                    if(needToCreateLON){
                        row[keyToIndexMap.LON] = result._source.geometry.coordinates[0];
                    }

                    buffer = _writeArray(buffer, row);
                });

                if (buffer.length > 5 * 1024 * 1024){
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
    out.push("\r\n");
    buffer += out.join('');
    return buffer;
}
