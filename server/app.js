/**
 * Express app is set up in the top level folder and passed down. This file is for
 * defining all of the required routes
 *
 * @param app
 */


const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();

const certs = require('certs/certs');

// Launch vanilla https server
https.createServer(
    {
        key: certs.key,
        cert: certs.cert
    },
    app
).listen(443); //You must run as root to listen on this port

// Enable parsing of post bodies
app.use(bodyParser.json()); //TODO large size
app.use(bodyParser.urlencoded({
    extended: true
}));

module.exports = app;



    // Extensions

    // use('extensions/display-names');
    //
    // // Components
    // use('components/mock');
    // use('components/fake');

