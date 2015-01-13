var uuid = require('node-uuid'),
    Stream = require('stream'),
    EventStream = require('event-stream'),
    fileDownload = require('./file-download'),
    jsxml,

    _ = require('underscore'),
    KML_HEADER,
    KML_FOOTER,
    KML_SCHEMA_HEADER;

KML_HEADER =
    '<?xml version="1.0" encoding="utf-8" ?>' +
    '\n<kml xmlns="http://www.opengis.net/kml/2.2">' +
    '\n  <Document>' +
    '\n    <Folder>' +
    '\n      <name>OGRGeoJSON</name>';

KML_SCHEMA_HEADER =
    '\n    </Folder>' +
    '\n    <Schema name="OGRGeoJSON" id="OGRGeoJSON">';

KML_FOOTER =
    '\n    </Schema>' +
    '\n  </Document>' +
    '\n</kml>';

/**
 * @param app
 */
exports.init = function(context){
    var query = context.sandbox.elastic.query,
        app = context.app,
        auth = context.sandbox.auth,
        config = context.sandbox.config.getConfig(),
        transform = context.sandbox.transform;
        jsxml = context.sandbox.jsxml;

    jsxml.XML.prettyPrinting = true;

    fileDownload.init(context);

    app.head('/results.*', auth.verifyUser, function(req, res){
        var queryIds = req.query.ids.split(',');
        query.getCountByQuery(
            null,
            config.index.data,
            null,
            {
                query:{
                    terms:{
                        queryId: queryIds
                    }
                }
            },
            function(err, results){
                if (err){
                    res.status(500);
                    res.send(err);
                } else {
                    res.status(results.count === 0 ? 204 : 200); // 204 = No Content
                    res.send();
                }
            }
        );

    });

    app.get('/results.csv', auth.verifyUser, function(req, res) {
        var userName = res.get('Parsed-User'),
            queryIds = req.query.ids.split(",");

        // Response prep
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename=results.csv');

        fileDownload.pipeCSVToResponseForQuery(userName, queryIds, res);
    });

    app.get('/results.geojson', auth.verifyUser, function(req, res) {
        var userName = res.get('Parsed-User'),
            queryIds = req.query.ids.split(','),
            mutex = 0,
            done = false,
            started = false,
            incrementMutex;

        /**
         * Used for mutex
         */
        incrementMutex = function(){
            mutex++;
        };

        // Response prep
        res.header('Content-Type', 'application/json');
        res.header('Content-Disposition', 'attachment; filename=results.geojson');
        res.write('{"type": "FeatureCollection","features": [');

        fileDownload.pipeGeoJSONResponse(
            userName,
            queryIds,
            function(err, resultChunk) {
                // If there was an error, end immediately with err
                if(err) {
                    res.status(500);
                    res.send(err);

                    return;
                } else if(resultChunk){

                    //There is a chunk to write. Add ',' if not the first one.
                    resultChunk = JSON.stringify(resultChunk.features);
                    if(started){
                        res.write(',');
                    } else{
                        started = true;
                    }
                    res.write(resultChunk.replace(/^\[/, '').replace(/\]$/, ''));//Remove []s

                } else {
                    done = true;
                }

                //If done and this was the last thread, end res, otherwise, decrement mutex
                mutex--;
                if(done && mutex === 0){
                    res.write(']}'); //Close the file
                    res.end();
                }
            },
            incrementMutex
        );
    });



    app.get('/results.kml', auth.verifyUser, function(req, res) {
        var userName = res.get('Parsed-User'),
            queryIds = req.query.ids.split(','),
            mutex = 0,
            done = false,
            started = false,
            incrementMutex,
            closeKML,
            schemaFields = {};

        /**
         * Used for mutex
         */
        incrementMutex = function(){
            mutex++;
        };

        closeKML = function(){
            res.write(KML_SCHEMA_HEADER);

            _.each(schemaFields, function(fieldNode, fieldName) {
                res.write('\n');
                res.write(fieldNode.toXMLString(6));
            });

            res.write(KML_FOOTER);
            res.end();
        };

        // Response prep
        res.header('Content-Type', 'application/vnd.google-earth.kml+xml');
        res.header('Content-Disposition', 'attachment; filename=results.kml');

        fileDownload.pipeKMLResponse(
            userName,
            queryIds,
            function(err, resultChunk) {
                var xmlDoc;

                // If there was an error, end immediately with err
                if(err) {
                    res.status(500);
                    res.send(err);

                    return;
                } else if(resultChunk){
                    if(!started){
                        started = true;
                        res.write(KML_HEADER);
                    }

                    xmlDoc = new jsxml.XML(resultChunk.toString());

                    // Write all the points to the document
                    res.write('\n');
                    res.write(xmlDoc.descendants('Placemark').toXMLString(6));

                    xmlDoc.descendants('SimpleField').each(function(simpleField){
                        var fieldName = simpleField.attribute('name');

                        if(!schemaFields[fieldName]){
                            schemaFields[fieldName] = simpleField;
                        }
                    });

                    mutex--; //TODO remove
                    if(done && mutex === 0){
                        closeKML();
                    }
                } else {
                    done = true;
                    mutex--;

                    if(mutex === 0){ //If all processing is done, end now
                        closeKML();
                    }
                }
            },
            incrementMutex
        );
    });
};
