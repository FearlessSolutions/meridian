//Make Node things relative to here
require('app-module-path').addPath(__dirname);

const express = require('express');

const app = require('server/app');

//// Server static content
app.use('/', express.static(`${__dirname}/app`));

require('server/extensions/gazetteer');

require('server/components/mock/mockDb');
