// Standard NodeJS Libraries
var fs = require('fs'),

// NPM Libraries
     _ = require('underscore'),
    uuid = require('node-uuid'),
    path = require('path'),
    os = require('os'),
    DATASOURCE_NAME = 'upload',
    context;
/**
 * Entry point for initialized the application
 *
 * @param app - Express application to add endpoints if needed
 */
exports.init = function(thisContext){
    var context = thisContext,
        app = context.app,
        auth = context.sandbox.auth,
        save = context.sandbox.elastic.save, //TODO save
        ogrTransform = context.sandbox.transform,
        mimetypeToTransformFunctionMap;

    mimetypeToTransformFunctionMap = {
        "text/csv": ogrTransform.fromCSV,
        "text/comma-seperated-values": ogrTransform.fromCSV,
        "application/octet-stream": ogrTransform.fromGeoJSON,
        "application/vnd.google-earth.kml+xml": ogrTransform.fromKML
    };

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
    app.post('/uploadFile', auth.verifyUser, auth.verifySessionHeaders, function(req, res){
        // Node middleware parses our the response body into JSON
        // Get the required parameters to push to the database
        var file = req.body,
            sessionId = res.get('Parsed-SessionId'),
            userName = res.get('Parsed-User'),
            filetype = req.param('filetype'),
            queryId = req.param('queryId'),
            queryName = req.param('queryName'),
            classification = req.param('classification');

        //Set up busboy listeners. The piping is required to give the listeners something to listen to.
        //The req.busboy property is added by the connect-busboy middleware
        req.pipe(req.busboy);
        req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            //Run the correct function for the mimetype to convert fine to geoJSON
            var mimeTypeTransformFunction = mimetypeToTransformFunctionMap[mimetype];
            if(mimeTypeTransformFunction) {
                    mimeTypeTransformFunction(file, function (er, data) {

                        if (er) {
                            console.log("error in parser", er);
                            res.status(500);
                            res.send(er);
                        } else {
                            context.sandbox.elastic.metadata
                                .create(userName, sessionId, queryId)
                                .setQueryName(queryName)
                                .setDataSource(DATASOURCE_NAME)
                                .commit(function () {
                                    var CHUNK_SIZE = 1000,
                                        saveRecursive;

                                    _.each(data.features, function (feature, index) {
                                        var featureId = uuid.v4();

                                        feature.featureId = featureId;
                                        feature.properties.featureId = featureId;
                                        feature.queryId = queryId;
                                        //TODO check for required fields?

                                        data.features[index] = feature;
                                    });

                                    saveRecursive = function(chunkIndex, featuresToProcess, callback){
                                        var chunk;

                                        if(chunkIndex >= featuresToProcess.length){
                                            callback(null);
                                            return ; // Normal end; No error
                                        }

                                        chunk = (chunkIndex + CHUNK_SIZE) < featuresToProcess.length
                                            ? featuresToProcess.slice(chunkIndex, chunkIndex + CHUNK_SIZE)
                                            : featuresToProcess.slice(chunkIndex); //Goes to the end

                                        save.writeGeoJSON(userName, sessionId, queryId, DATASOURCE_NAME, chunk, function (err) {
                                            if (err) {
                                                callback(err);
                                            } else {
                                                saveRecursive(chunkIndex + CHUNK_SIZE, featuresToProcess, callback);
                                            }
                                        });
                                    };


                                    //Start the chunk saving at index 0, when done, handle error and return status
                                    saveRecursive(0, data.features, function(err){
                                        if(err){
                                            console.log('error:' + err);
                                            res.status(500);
                                            res.send(err);
                                        }else{

                                            // Refresh the indicies so that the data is immediately available
                                            context.sandbox.elastic.refresh(function(){
                                                res.status(200);
                                                res.send({
                                                    queryId: queryId,
                                                    count: data.features.length
                                                });
                                            });
                                        }
                                    });
                                });
                        }
                    });
            }else {
                console.log('error: Mimetype ' + mimetype + ' not supported');
                res.status(500);
                res.send('error: Mimetype ' + mimetype + ' not supported');
            }
        });
    });
};