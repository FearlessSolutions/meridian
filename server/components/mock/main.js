var mock = require('./mock.js');
var uuid = require('node-uuid');
var _ = require("underscore");

/**
 * curl -XPOST https://localhost:8000/query/bbox/mock -d'{"minLat":"40","maxLat":"50","minLon":"40","maxLon":"50"}' --cert sean.pines.p12:schemaless --insecure --header "Content-Type:application/json"
 * @param app
 */
exports.init = function(context){

    var app = context.app;
    var auth = context.sandbox.auth;
    var save = context.sandbox.elastic.save;
    var purge = context.sandbox.elastic.purge;

    app.post('/query/bbox/mock', auth.verifyUser, auth.verifySessionHeaders, function(req, res){
        var minLat = parseFloat(req.body.minLat);
        var minLon = parseFloat(req.body.minLon);
        var maxLat = parseFloat(req.body.maxLat);
        var maxLon = parseFloat(req.body.maxLon);
        var start = parseInt(req.body.start);
        var pageSize = parseInt(req.body.pageSize);
        var throttleMs = req.body.throttleMs ? parseInt(req.body.throttleMs) : 0;
        var userName = res.get('Parsed-User');
        var sessionId = res.get('Parsed-SessionId');
        var source = 'mock';

        var queryId = req.body.queryId || uuid.v4();
        var aborted = false;

        //TODO this is how to check if the call was aborted
        //TODO see how to delete the extra calls
        //TODO figure out how to stop partally finished queries
        //TODO Make sure it is consistant (might miss some?)
        //TODO records probably will not have ids before saving to elastic
        //TODO putting this inside elastic callback will prevent race condition at the expsense of time
        //TODO don't save in the first place if already aborted
        //Just make 'on.close' mark flag; do everything else by the flag.
        req.on('close', function(firstParam, secondParam){
            console.log("req closed " + queryId);
            aborted = true;
        });

        req.on('end', function(firstParam, secondParam){
            console.log("req end for " + queryId);
        });

        res.on('close', function(firstParam, secondParam){
            console.log("res closed " + queryId);
            aborted = true;
        });

        req.on('end', function(firstParam, secondParam){
            console.log("res end for " + queryId);
        });


        mock.query(minLat, maxLat, minLon, maxLon, start, pageSize, throttleMs, function(page){
//            console.log("query finished");
            if (!page || page.length === 0){
                console.log("no data returned");
                res.status(204);
                res.send();
                return;
            }

            var persistData = function(){
//                console.log("persist data");

                if(aborted){
                    console.log("aborted before save");
                    res.status(403);//TODO find better code; this might not even be required
                    res.send("Aborted");

                    return;
                }else{
//                    console.log("saving data");
                    save.writeGeoJSON(userName, sessionId, queryId, source, page, function(err, results){

                        console.log("saved data");
                        //TODO move delete here
                        //TODO don't send if aborted
                        if (err){
                            res.status(500);
                            res.send(err);

                        } else if(aborted) {
                            console.log("aborted after save");

                            purge.deleteRecordsByIndices(userName, results.items, function(err, deleteResponse){

                                res.status(204);
                                res.send("aborted");
                            });
                        } else {
                            res.status(200);
                            res.send(page);
                        }
                    });
                }
            };

            if (parseInt(start) === 0){
                console.log("set up metadata");
                context.sandbox.elastic.metadata
                    .create(userName, sessionId, queryId)
                    .setQueryName(req.body.queryName)
                    .setRawQuery(req.body)
                    .setQueryBbox({top: maxLat, bottom: minLat, left: minLon, right: maxLon})
                    .setDataSource(source)
                    .commit(persistData);
            } else {
                persistData();
            }
        });
    });

    app.post('/query/bbox/mock/dummy', auth.verifyUser, auth.verifySessionHeaders, function(req, res){
        var queryId = uuid.v4();

        mock.query(40, 50, 40, 50, 0, 1000, 0, function(page){

            page.forEach(function(record){
                record.properties.queryId = queryId;
            });

            var userName = res.get('Parsed-User');
            var sessionId = res.get('Parsed-SessionId');

            save.writeGeoJSON(userName, sessionId, queryId, 'mock', page, function(err){
                if (err){
                    console.log('error: ' + err);
                    res.status(500);
                    res.send();
                } else {
                    console.log('ingest complete');
                    res.send();
                }
            });
        });

    });
};