var platform = require('platform');
var gaz = require('./Gaz');

var auth;

exports.init = function(context){

    auth = context.sandbox.auth;

    context.app.get('/gaz', auth.verifyUser, function(req, res){
        gaz.query(req, function (response){
        	if(response.status === 200){
        		res.status(200);
        		res.send(response.response);
        	} else {
        		res.status(500);
        		res.send(response);
        	}
        });
    });
};