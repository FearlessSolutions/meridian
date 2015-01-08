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
                    resultChunk = JSON.stringify(resultChunk.features);
                    if(!started){
                        started = true;
                        res.write('{"type": "FeatureCollection","features": [');
                        res.write(resultChunk.replace(/^\[/, '').replace(/\]$/, ''));//Remove []s
                    } else{
                        res.write(',');
                        res.write(resultChunk.replace(/^\[/, '').replace(/\]$/, ''));//Remove []s
                    }


                } else {
                    done = true;
                }

                //If done and this was the last thread, end res, otherwise, decrement mutex
                if(done && mutex === 1){
                    if(started){
                        res.write(']}'); //Close the file, but only if there is already something there
                    }
                    res.end();
                } else{
                    mutex--;
                }
            },
            incrementMutex
        );
    });
};
