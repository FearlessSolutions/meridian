var cors = require('./cors');

exports.init = function(context){

    var app = context.app;

    app.all('*', cors.enableCors);

    context.sandbox.cors = cors;
};