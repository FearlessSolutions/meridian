// Standard NodeJS Libraries
var fs = require('fs');

// NPM Libraries
var _ = require('underscore');
var uuid = require('node-uuid');
var path = require('path');
var os = require('os');



var DATASOURCE_NAME = "upload";
var context;
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

//                var saveTo = path.join(os.tmpDir(), path.basename(fieldname));
//                file.pipe(fs.createWriteStream(saveTo));

//                req.busboy.on('finish', function () {
//                    var savedFs = fs.createReadStream(saveTo);
//                var savedFs = fs.createReadStream('dl3.csv')
//                var savedFs = fs.createReadStream('Random-Points-100k.csv')

                    mimeTypeTransformFunction(file, function (er, data) {


                        if (er) {
                            console.log("error in parser", er)
                            res.status(500);
                            res.send(er);
                        } else {



//                            console.log("sending 200")
//                            res.status(200);
//                            res.set('Content-Type', 'application/json');
//                            res.setHeader('Content-Type', 'application/json');
//                            res.json(data.features);

//                            return;





//
//                            save.writeGeoJSON(userName, sessionId, queryId, DATASOURCE_NAME, data.features, function (err) {
//                                if (err) {
//                                    console.log('error:' + err);
//                                    res.status(500);
//                                    res.send(err);
//                                } else {
//                                    console.log("sending 200")
//                                    res.status(200);
//                                    res.set('Content-Type', 'application/json');
//                                    res.setHeader('Content-Type', 'application/json');
//                                    res.json(data.features);
//                                }
//                            });
//                            return;


                            context.sandbox.elastic.metadata
                                .create(userName, sessionId, queryId)
                                .setQueryName(queryName)
                                .setDataSource(DATASOURCE_NAME)
                                .commit(function () {
                                    var CHUNK_SIZE = 1000;

                                    _.each(data.features, function (feature, index) {
                                        var featureId = feature.properties.featureId || feature.properties.id || uuid.v4();

                                        feature.featureId = featureId;
                                        feature.properties.featureId = featureId;
                                        feature.queryId = queryId;
                                        //TODO check for required fields?

                                        data.features[index] = feature;
                                    });




                                    var saveRecursive = function(chunkIndex, featuresToProcess, callback){
                                        console.log("save chunk ", chunkIndex)
                                        console.log("length", featuresToProcess.length);
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
                                                console.log('error:' + err);
                                                callback(err);

                                                return;
                                            } else {
                                                console.log("saving...")
                                                saveRecursive(chunkIndex + CHUNK_SIZE, featuresToProcess, callback);
                                            }
                                        });
                                    };


                                    console.log("features to proccess: ", data.features.length)
                                    //Start the chunk saving at index 0, when done, handle error and return status
                                    saveRecursive(0, data.features, function(err){
                                        console.log("finished saving ", err)
                                        if(err){
                                            console.log('error:' + err);
                                            res.status(500);
                                            res.send(err);
                                        }else{

                                            console.log("sending back 200: ", data.features.length)
                                            context.sandbox.elastic.refresh(function(){
                                                console.log("sessionId ", sessionId)
                                                console.log("queryId ", queryId)
                                                res.status(200);
//                                            res.set('Content-Type', 'application/json');
//                                            res.setHeader('Content-Type', 'application/json');
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


//                mimeTypeTransformFunction(file, function(er, data){
//                    if(er){
//                        res.status(500);
//                        res.send(er);
//                    }else{
//                        context.sandbox.elastic.metadata
//                            .create(userName, sessionId, queryId)
//                            .setQueryName(queryName)
//                            .setDataSource(DATASOURCE_NAME)
//                            .commit(function(){
//                                _.each(data.features, function(feature, index){
//                                    var featureId = feature.properties.featureId || feature.properties.id || uuid.v4();
//
//                                    feature.featureId = featureId;
//                                    feature.properties.featureId = featureId;
//                                    feature.queryId = queryId;
//                                    //TODO check for required fields?
//
//                                    data.features[index] = feature;
//                                });
//
//                                save.writeGeoJSON(userName, sessionId, queryId, DATASOURCE_NAME, data.features, function(err){
//                                    if(err){
//                                        console.log('error:' + err);
//                                        res.status(500);
//                                        res.send(err);
//                                    }else{
//                                        res.status(200);
//                                        res.set('Content-Type', 'application/json');
//                                        res.setHeader('Content-Type', 'application/json');
//                                        res.json(data.features);
//                                    }
//                                });
//                            });
//                    }
//                });
            }else {
                console.log('error: Mimetype ' + mimetype + ' not supported');
                res.status(500);
                res.send('error: Mimetype ' + mimetype + ' not supported');
            }

        });
    });
};