// Standard NodeJS Libraries
var fs = require('fs');

// NPM Libraries
var _ = require('underscore');
var uuid = require('node-uuid');

/**
 * Entry point for initialized the application
 *
 * @param app - Express application to add endpoints if needed
 */
exports.init = function(context){
    var app = context.app,
        auth = context.sandbox.auth,
        save = context.sandbox.elastic.save, //TODO save
        ogrTransform = context.sandbox.transform,
        mimetypeToTransformFunctionMap;

    mimetypeToTransformFunctionMap = {
        "text/csv": ogrTransform.fromCSV,
        "text/json": ogrTransform.fromGeoJSON, //TODO see what the meme for geoJSON actually is
        "text/kml": ogrTransform.fromKML //TODO see what the meme for KML actually is
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
            var mimeTypeTransformFunction = mimetypeToTranformFunctionMap[mimetype];
            if(mimeTypeTransformFunction){
                mimetypeToTransformFunctionMap[mimetype](file, function(er, data){
                    if(er){
                        res.status(500);
                        res.send(er);
                    }else{
                        _.each(data.features, function(feature, index){
                            var featureId = feature.properties.featureId || feature.properties.id || uuid.v4();

                            feature.featureId = featureId;
                            feature.properties.featureId = featureId;
                            feature.queryId = queryId;
                            //TODO more fields? //TODO check for required fields?

                            data.features[index] = feature;
                        });

                        save.writeGeoJSON(userName, sessionId, queryId, 'UNKNOWN', data.features, function(err){
                            if(err){
                                console.log('error:' + err);
                                res.status(500);
                                res.send(err);
                            }else{
                                console.log('ingest complete');
                                res.status(200);
                                res.set('Content-Type', 'application/json');
                                res.setHeader('Content-Type', 'application/json');
                                res.json(data.features);
                            }
                        });
                    }
                });
            }else {
                console.log('error: Mimetype ' + mimetype + 'not supported');
                res.status(500);
                res.send('error: Mimetype ' + mimetype + 'not supported');
            }

        });
    });
};