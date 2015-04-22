var express = require('express'),
    connect = require('connect'),
    http = require('http'),
    fs = require('fs'),
    Busboy = require('busboy'), //TODO replace with connect-busboy on connect upgrade
    app = express();

// Launch vanilla https server
app.listen(3000);

// Enable parsing of post bodies
app.use(connect.json());
app.use(connect.urlencoded());

/**
 * Copy of connect-busboy/.index.js
 * This should make it so that we do not have to upgrade connect for now.
 * TODO upgrade connect, use connect-busboy, and remove this.
 * @type {exports}
 */

app.use(function(req, res, next){
    var options = {};
    var RE_MIME = /^(?:multipart\/.+)|(?:application\/x-www-form-urlencoded)$/i;

    var hasBody = function(req){
        var encoding = 'transfer-encoding' in req.headers,
            length = 'content-length' in req.headers
                && req.headers['content-length'] !== '0';
        return encoding || length;
    };

    var mime = function(req){
        var str = req.headers['content-type'] || '';
        return str.split(';')[0];
    };

    if (req.busboy
        || req.method === 'GET'
        || req.method === 'HEAD'
        || !hasBody(req)
        || !RE_MIME.test(mime(req)))
        return next();

    var cfg = {};
    for (var prop in options)
        cfg[prop] = options[prop];
    cfg.headers = req.headers;

    req.busboy = new Busboy(cfg);

    if (options.immediate) {
        process.nextTick(function() {
            req.pipe(req.busboy);
        });
    }

    next();
});

// Initiate routes
require('./server/app').init(app);
