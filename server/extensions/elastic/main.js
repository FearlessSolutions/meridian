var query = require('./query');
var save = require('./save');
var download = require('./download');
var mapping = require('./mapping');
var client = require('./client');
var stream = require('./stream');

var uuid = require('node-uuid');

exports.init = function(context){

    var app = context.app;

    context.sandbox.elastic = {
        query: query,
        save: save,
        download: download,
        mapping: mapping,
        client: client,
        stream: stream
    };

    // Init sub-modules as necessary
    context.sandbox.elastic.client.init(context);
    context.sandbox.elastic.mapping.init(context);
    context.sandbox.elastic.query.init(context);
    context.sandbox.elastic.save.init(context);
    context.sandbox.elastic.stream.init(context);

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

    app.get('/feature/:id', auth.verifyUser, auth.verifySessionHeaders, function(req, res){
        var userName = res.get('Parsed-User');
        var sessionId = res.get('Parsed-SessionId');
        query.getByFeatureId(userName, sessionId, req.params.id, function(err, response){
            if (err){
                res.status(500);
                res.send(err);
            } else {
                res.status(200);
                res.send(response._source);
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
        save.writeGeoJSON(userName, sessionId, req.body.queryId || uuid.v4(),
            req.body.type || 'UNKNOWN', geoJSON, function(err, results){
                if (err){
                    res.status(500);
                    res.send(err);
                } else {
                    res.status(200);
                    res.send(results);
                }
            });
    });

    app.get('/results.csv', auth.verifyUser, auth.verifySessionHeaders, function(req, res){
        download.pipeCSVToResponse(res.get('Parsed-User'), res.get('Parsed-SessionId'), res);
    });
};