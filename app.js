var express = require('express');
var connect = require('connect');
var https = require('https');
var fs = require('fs');

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

// Server static content
app.use('/', express.static(__dirname + '/app'));

// Initiate routes
require('./server/app').init(app);