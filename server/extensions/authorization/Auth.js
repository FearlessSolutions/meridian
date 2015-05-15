exports.verifyUser = function(req, res, next){
    var headers = req.headers;
    if (!headers || headers.ssl_client_verify !== 'SUCCESS' || !headers.ssl_client_s_dn){
        res.status(403);
        res.send("Must have a pkcs12 certificate in your browser");
        return;
    }

    res.set('Parsed-User', headers.ssl_client_s_dn.split('/CN=')[1]);
    next();
};

exports.verifySessionHeaders = function(req, res, next){
    if (!req.headers['x-meridian-session-id'] && !req.query['x-meridian-session-id']){
        res.status(403);
        res.send("Must provide a x-meridian-session-id header or query param");
        return;
    }
    res.set('Parsed-SessionId', req.headers['x-meridian-session-id'] || req.query['x-meridian-session-id']);
    next();
};