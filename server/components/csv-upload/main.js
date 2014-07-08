// Standard NodeJS Libraries
var fs = require('fs');

// NPM Libraries
var _ = require('underscore');
var uuid = require('node-uuid');
var csv = require('ya-csv');

var DATASERVICE_NAME = "csv";

/**
 * Entry point for initialized the application
 *
 * @param app - Express application to add endpoints if needed
 */
exports.init = function(context){
    var app = context.app,
        auth = context.sandbox.auth,
        save = context.sandbox.elastic.save;

    /**
     * Endpoint for uploading a CSV to the server
     *
     * Middleware:
     *      auth.verifyUser - ensure the user has a valid test cert
     *
     *      auth.verifySessionHeaders - Ensure x-meridian-session-id header is set
     *
     * Body:
     *      data- should be a string of comma separated values
     *          REQUIRED KEYS:
     *              - CLASSIFICATION
     *              - LATITUDE
     *              - LONGITUDE
     *          queryName - what to name the query (optional)
     *          queryId - uuid for the qurey (optional)
     */
    app.post("/importCsv", auth.verifyUser, auth.verifySessionHeaders, function(req, res){
        // Node middleware parses our the response body into JSON
        var postBody = req.body;

        // Get the required parameters to push to the database
        var csvString = postBody.data,
            sessionId = res.get('Parsed-SessionId'),
            userName = res.get('Parsed-User'), //TODO needed?
            queryId = postBody.queryId || uuid.v4(),
            //queryName = postBody.queryName || "CSV Import",
            sourceName = 'csv';
            //autoZoom = true;

        parseCSVIntoEvents(csvString, queryId, function(err, features){
            if(err){
                res.status(500);
                res.send(err);
                return;
            }

            // Save the data and pipe the resulting GeoJSON back to the client
            // Note: This function will be replaced with ElasticSearch soon
            if(features.length > 0){
                save.writeGeoJSON(userName, sessionId, queryId, sourceName, features, function(err, results){
                    if (err){
                        res.status(500);
                        res.send(err);

                    } else {
                        res.status(200);
                        res.send(features);
                    }
                });
            }else{
                res.status(200);
                res.send([]);
            }
        });
    });
};

/**
 * Utility functions to parse a CSV string into an array
 * of events
 *
 * @param csvString
 * @param queryId
 * @param callback
 * @return - Array of Events
 */
function parseCSVIntoEvents(csvString, queryId, callback){
    var reader = csv.createCsvStreamReader(),
        firstRow = true,
        headerRow = null,
        features = [];

    reader.addListener('data', function(data){
        //Handle Header Row
        if(firstRow){
            headerRow = data;
            firstRow = false;
            console.log('headerRow', headerRow);
        }

        //Handle Data Rows
        else{
            var geoJSON = convertCSVRowToGeoJSON(headerRow, data);

            //Ensure required fields are present
            if(!geoJSON){
                callback('Please ensure your CSV has fields LATITUDE, LONGITUDE, ' +
                    'and CLASSIFICATION', null);
            }else{
                features.push(geoJSON); //Add the feature
            }
        }
    });

    // Generic error handler
    reader.addListener('error', function(err){
        callback('CSV Parse Error: ' + err, null);
    });

    // Called after the CSV is finished parsing
    reader.addListener('end', function(){
        callback(null, features);
    });

    reader.parse(csvString);
    reader.end();
}

/**
 * Utility function to take a header row (in array form) plus
 * a csv row (in array form) and turn them into a JSON object
 *
 * @param headerRowArray - array of keys in the header row
 * @param rowArray - array of values in a data row
 * @returns geoJSON feature
 */
function convertCSVRowToGeoJSON(headerRowArray, rowArray){
    var geoJSON = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [NaN, NaN]
        },
        "properties": {}
    };

    // Map values to keys
    _.each(rowArray, function(value, index){
        var key = headerRowArray[index];

        if(key === 'LONGITUDE'){
            value = parseFloat(value);
            geoJSON.geometry.coordinates[0] = value;
        }else if(key === 'LATITUDE'){
            value = parseFloat(value);
            geoJSON.geometry.coordinates[1] = value;
        }

        geoJSON.properties[key] = value;
    });

    //If there are missing required fields, it is not a valid feature
    if(!geoJSON.properties['LATITUDE'] ||
        !geoJSON.properties['LONGITUDE'] ||
        !geoJSON.properties['CLASSIFICATION']){
        return null;
    }

    geoJSON.properties.featureId = uuid.v4();

    return geoJSON;
}