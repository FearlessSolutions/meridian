var express = require('express');
var connect = require('connect');
var https = require('https');
var fs = require('fs');
var Busboy = require('busboy'); //TODO replace with connect-busboy on connect upgrade

var app = express();

var options = {
    pfx: fs.readFileSync('server/certs/localhost.p12'),
    rejectUnauthorized: false,
    requestCert: true
};

// Launch vanilla https server
https.createServer(options, app).listen(3000);

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

// Server static content
app.use('/', express.static(__dirname + '/app'));
app.use('/cmapi', express.static(__dirname + '/tests/pubsub/cmapi'));
app.use('/basic', express.static(__dirname + '/app/modes/basic'));
app.use('/basic-with-settings', express.static(__dirname + '/app/modes/basic-with-settings'));
app.use('/embedded', express.static(__dirname + '/app/modes/embedded'));
app.use('/dashboard', express.static(__dirname + '/app/modes/dashboard'));
app.use('/admin', express.static(__dirname + '/app/modes/admin'));


// Initiate routes
require('./server/app').init(app);
