var save = require('./save');
var query = require('./query');

exports.getMetadataByQueryId = function(queryId, callback){
    query.getMetadataByQueryId(queryId, function(err, meta){
        if (err){
            callback(err);
        } else {
            callback(null, meta._source);
        }
    });
};

exports.getMetadataBySessionId = function(sessionId, callback){
    query.getMetadataBySessionId(sessionId, function(err, meta){
        if (err) {
            callback(err);
        } else {
            var ret = {};
            meta.hits.hits.forEach(function(ele){
                ret[ele._source.queryId] = ele._source;
            });
            callback(null, ret);
        }
    });
};

exports.saveMetadata = function(userName, sessionId, queryId, metadata, callback){
    save.writeMetadata(userName, sessionId, queryId, metadata, callback);
};