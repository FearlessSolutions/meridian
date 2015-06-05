var fake = require('./fake.js');
var uuid = require('node-uuid');
var _ = require('underscore');

/**
 * curl -XPOST https://localhost:8000/query/bbox/fake -d'{"minLat":"40","maxLat":"50","minLon":"40","maxLon":"50"}' --cert sean.pines.p12:schemaless --insecure --header "Content-Type:application/json"
 * @param app
 */
exports.init = function(context){

    var app = context.app,
        auth = context.sandbox.auth,
        save = context.sandbox.elastic.save;

    app.post('/query/bbox/fake', auth.verifyUser, auth.verifySessionHeaders, function(req, res){
        var newMetadata = req.body.metadata,
            newQuery = req.body.query,
            minLat = parseFloat(newMetadata.minLat),
            minLon = parseFloat(newMetadata.minLon),
            maxLat = parseFloat(newMetadata.maxLat),
            maxLon = parseFloat(newMetadata.maxLon),
            start = parseInt(newQuery.start),
            pageSize = parseInt(newQuery.pageSize),
            throttleMs = newQuery.throttleMs ? parseInt(newQuery.throttleMs) : 0,
            userName = res.get('Parsed-User'),
            sessionId = res.get('Parsed-SessionId'),
            source = 'fake',
            queryId = newMetadata.queryId || uuid.v4();

        fake.query(minLat, maxLat, minLon, maxLon, start, pageSize, throttleMs, function(page){
            var persistData;

            persistData = function(){
                if (!page || page.length === 0){
                    res.status(204);
                    res.send();
                    return;
                } else {
                    save.writeGeoJSON(userName, sessionId, queryId, source, page, function (err, results) {
                        if (err) {
                            res.status(500);
                            res.send(err);

                        } else {
                            res.status(200);
                            res.send(page);
                        }
                    });
                }
            };

            if (parseInt(start) === 0){
                context.sandbox.elastic.metadata
                    .create(userName, sessionId, queryId)
                    .setQueryName(newMetadata.queryName)
                    .setRawQuery(newQuery)
                    .setQueryBbox({
                        maxLat: maxLat,
                        minLat: minLat,
                        minLon: minLon,
                        maxLon: maxLon
                    })
                    .setDataSource(source)
                    .setQueryType(source)
                    .setJustification(newMetadata.justification) //TODO
                    .setClassification('N/A')
                    .commit(persistData);
            } else {
                persistData();
            }
        });
    });

    app.post('/query/bbox/fake/dummy', auth.verifyUser, auth.verifySessionHeaders, function(req, res){
        var queryId = uuid.v4();

        fake.query(40, 50, 40, 50, 0, 1000, 0, function(page){
            var userName = res.get('Parsed-User'),
                sessionId = res.get('Parsed-SessionId');

            page.forEach(function(record){
                record.properties.queryId = queryId;
            });

            save.writeGeoJSON(userName, sessionId, queryId, 'fake', page, function(err){
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