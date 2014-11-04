var query = require('./query');
var save = require('./save');
var download = require('./download');
var mapping = require('./mapping');
var client = require('./client');
var stream = require('./stream');
var purge = require('./purge');
var metadata = require('./metadata');

var uuid = require('node-uuid');

exports.init = function(context){

    var app = context.app,
        config = context.sandbox.config.getConfig();

    context.sandbox.elastic = {
        query: query,
        save: save,
        download: download,
        mapping: mapping,
        client: client,
        stream: stream,
        purge: purge,
        metadata: metadata
    };

    // Init sub-modules as necessary
    context.sandbox.elastic.client.init(context);
    context.sandbox.elastic.mapping.init(context);
    context.sandbox.elastic.query.init(context);
    context.sandbox.elastic.save.init(context);
    context.sandbox.elastic.stream.init(context);
    context.sandbox.elastic.purge.init(context);

    var auth = context.sandbox.auth;

    // See public/test.html for examples
    app.get('/feature', auth.verifyUser, auth.verifySessionHeaders, function(req, res){
        var userName = res.get('Parsed-User');
        var sessionId = res.get('Parsed-SessionId');
        query.executeQuery(userName, sessionId, JSON.parse(req.query.q), function(err, response){
            if (err){
                res.status(500);
                res.send(err);
            } else {
                res.status(200);
                res.send(response.hits.hits.map(function(ele){return ele._source;}));
            }
        });
    });

    app.get('/feature/:id', auth.verifyUser, function(req, res){
        var userName = res.get('Parsed-User');
        query.getByFeatureId(userName, null, req.params.id, function(err, response){
            if (err){
                res.status(500);
                res.send(err);
            } else {
                res.header('Content-Type', 'application/json');
                res.header('Content-Disposition', 'attachment; filename=results.geojson');
                res.status(200);
                res.send(response._source);
            }
        });
    });

    app.get('/feature/query/:queryId', auth.verifyUser, auth.verifySessionHeaders, function(req, res){
        var userName = res.get('Parsed-User');
        var sessionId = res.get('Parsed-SessionId');
        var queryId = req.params.queryId;

        query.getResultsByQueryId(userName, sessionId, queryId, function(err, results){
            if (err){
                res.status(500);
                res.send(err);
            } else {
                res.status(200);
                res.send(results);
            }
        });
    });

    app.get('/feature/query/:queryId/session/:sessionId', auth.verifyUser, function(req, res){
        var userName = res.get('Parsed-User');
        var sessionId = req.params.sessionId;
        var queryId = req.params.queryId;

        query.getResultsByQueryId(userName, sessionId, queryId,
            req.query.start, req.query.size, function(err, results){
            if (err){
                res.status(500);
                res.send(err);
            } else {
                res.status(200);
                res.send(results.hits.hits.map(function(ele){return ele._source;}));
            }
        });
    });


    /**
     * Must be formatted as GeoJSON
     *
     * For example:
     * {queryId: 'foo', type: 'mockdata', data: {
     *  type: "Feature",
     *  geometry: {
     *      type: "Point",
     *      coordinates: [102.0, 0.5]
     *  },
     *  properties: {
     *      key1: 'value1'
     *      key2: true
     *  }
     * }
     * }
     *
     * Note: featureIds will be generated internally
     *
     * TODO: Allow the user to pass in a queryId
     */
    app.post('/feature', auth.verifyUser, auth.verifySessionHeaders, function(req, res){
        var geoJSON = req.body.data;
        var userName = res.get('Parsed-User');
        var sessionId = res.get('Parsed-SessionId');
        var queryId = req.body.queryId || uuid.v4();
        save.writeGeoJSON(
            userName,
            sessionId,
            queryId,
            req.body.type || 'UNKNOWN',
            geoJSON,
            function(err, results){
                if (err){
                    res.status(500);
                    res.send(err);
                } else {
                    res.status(200);
                    res.send(geoJSON);
                }
            }
        );
    });

//    app.get('/results.csv', auth.verifyUser, auth.verifySessionHeaders, function(req, res){
//        download.pipeCSVToResponse(res.get('Parsed-User'), res.get('Parsed-SessionId'), res);
//    });

    app.head('/results.csv', auth.verifyUser, function(req, res){
        var idArray = req.query.ids.split(",");
        query.getCountByQuery(null, config.index.data, null, {query:{"terms":{"queryId":idArray}}}, function(err, results){
            if (err){
                res.status(500);
                res.send(err);
            } else {
                res.status(results.count === 0 ? 204 : 200); // 204 = No Content
                res.send();
            }
        });

    });

    app.get('/results.csv', auth.verifyUser, function(req, res){
        download.pipeCSVToResponseForQuery(res.get('Parsed-User'), req.query.ids.split(","), res);
    });

    app.delete('/clear', auth.verifyUser, auth.verifySessionHeaders, function(req, res){
       purge.deleteRecordsForUserSessionId(res.get('Parsed-User'), res.get('Parsed-SessionId'), function(err, results){
           res.status(err ? 500 : 200);
           res.send(err ? err : results);
       });
    });

    app.delete('/clear/:queryId', auth.verifyUser, auth.verifySessionHeaders, function(req, res){
        purge.deleteRecordsByQueryId(res.get('Parsed-User'), res.get('Parsed-SessionId'),
            req.params.queryId, function(err, results){
            res.status(err ? 500 : 200);
            res.send(err ? err : results);
        });
    });

    app.get('/metadata/user', auth.verifyUser, function(req, res){
        metadata.getMetadataByUserId(res.get('Parsed-User'), function(err, results){
            res.status(err ? 500 : 200);
            res.send(err ? err : results);
        });
    });

    app.get('/metadata/session', auth.verifyUser, auth.verifySessionHeaders, function(req, res){
        metadata.getMetadataBySessionId(res.get('Parsed-User'), res.get('Parsed-SessionId'), function(err, results){
            res.status(err ? 500 : 200);
            res.send(err ? err : results);
        });
    });

    app.get('/metadata/query/:id', auth.verifyUser, function(req, res){
        metadata.getMetadataByQueryId(res.get('Parsed-User'), req.params.id, function(err, results){
            res.status(err ? 500 : 200);
            res.send(err ? err : results);
        });
    });
};