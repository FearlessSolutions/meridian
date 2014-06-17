var cors = require('./cors');

exports.init = function(app){
    app.all('*', cors.enableCors);
};