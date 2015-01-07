var uuid = require('node-uuid'),
    Stream = require('stream'),
    EventStream = require('event-stream'),
    fileDownload = require('./file-download');
//var _ = require('underscore');

/**
 * @param app
 */
exports.init = function(context){
    var query = context.sandbox.elastic.query,
        app = context.app,
        auth = context.sandbox.auth,
        config = context.sandbox.config.getConfig(),
        transform = context.sandbox.transform;

    fileDownload.init(context);

    app.head('/results.csv', auth.verifyUser, function(req, res){
        var idArray = req.query.ids.split(',');
        query.getCountByQuery(
            null,
            config.index.data,
            null,
            {
                query:{
                    terms:{
                        queryId:idArray
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
        fileDownload.pipeCSVToResponseForQuery(res.get('Parsed-User'), req.query.ids.split(","), res);
    });















    app.get('/results5.csv', auth.verifyUser, function(req, res){
        var userName = res.get('Parsed-User'),
            sessionId = req.query.sessionId; //It is done this way to allow file opening in a new window.
        console.log("toCSV", userName, sessionId);

        // Response prep
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename=results.csv');
        res.write('\ufeff');
        query.streamQuery(userName, {query:{"match":{"sessionId":sessionId}}}, 100, function(err, results) {
//            console.log(results);

            console.log("stuff");

            if(results.hits.hits.length === 0){
                console.log("ending");
                res.end();
            }else{
                try {
//                    transform.toCSV(resultsToGeoJSON(results), res);
                    console.log("*************STREAMING")
//                    transform.toCSV(resultsToGeoJSON(results), process.stdout);
//                    transform.toCSV(resultsToGeoJSON(results), res);
//                    res.write("There is something here");
                }catch(err){
                    res.end();
                }
            }
        });


//            download.pipeCSVToResponseForQuery(res.get('Parsed-User'), req.query.ids.split(','), res);
    });
};

/**
 * Turns database results into normal geoJSON
 * @param results
 */
function resultsToGeoJSON(results){
    var collection = {
        type: "FeatureCollection",
        features: []
    };

    results.hits.hits.forEach(function(feature){
//        console.log(feature._source);
        collection.features.push(feature._source);
    });

    return collection;
}