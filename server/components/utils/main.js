// Standard NodeJS Libraries
var fs = require('fs');

// NPM Libraries
var _ = require('underscore');

/**
 * Entry point for initialized the application
 *
 * @param app - Express application to add endpoints if needed
 */
exports.init = function(context){
    var app = context.app,
        auth = context.sandbox.auth,
        query = context.sandbox.elastic.query;

    /**
     * Endpoint for getting the number of features in a user's current session
     *
     * Middleware:
     *      auth.verifyUser - ensure the user has a valid test cert
     *
     *      auth.verifySessionHeaders - Ensure x-meridian-session-id header is set
     *
     * Body:
     *      none
     */
    app.get("/getCount", auth.verifyUser, auth.verifySessionHeaders, function(req, res){

        // Get the required parameters
        var sessionId = res.get('Parsed-SessionId'),
            username = res.get('Parsed-User');

        query.getCountBySessionId(username, sessionId, function(err, resp){
            if(err){
                res.status(500);
                res.send(err);
            }else{
                res.status(200);
                res.send({
                    "count": resp.count
                });
            }
        });
    });
};
