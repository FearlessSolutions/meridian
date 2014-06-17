var platform = require('platform');
var auth = require('./Auth');

exports.init = function(app){

    app.get('/echo', auth.verifyUser, function(req, res){
        res.send({
            'fullName': res.get('Parsed-User'),
            'userName': "8675309",
            'user-agent': platform.parse(req.headers['user-agent'])
        });
    });
};