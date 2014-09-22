var stream = require('./stream');
var _ = require('underscore');

var config,
    client;

exports.init = function(context){
    config = context.sandbox.config.getConfig();
    client = context.sandbox.elastic.client.newClient();
};

exports.updateRecord = function(userName, sessionId, type, updateMap, callback){
    var bulkRequest = [];

    _.each(updateMap, function(updateObj, id){
        bulkRequest.push({
            "update":{
                "_index": config.index.data,
                "_type": type,
                "_id": id,
                "_routing": userName+""+sessionId
            }
        });
        bulkRequest.push({
            "doc": updateObj
        });
    });

    client.bulk({
        "body": bulkRequest
    });
};

exports.executeQuery = function(userName, sessionId, query, callback){

    var newQuery = {
        "query": {
            "filtered": {
                "query": query.query,
                "filter": {
                    "term": {
                        "userId": userName,
                        "sessionId": sessionId
                    }
                }
            }
        }
    };

    if (query.sort) {newQuery.sort = query.sort; }

    getJSONByQuery(userName+""+sessionId, config.index.data, null, newQuery, callback);

};

exports.getResultsByQueryId = function(userName, sessionId, queryId, callback){

    var routing = userName+""+sessionId;

    var query = {
        "query":{
            "bool": {
                "must": [
                    {
                        "term": {
                            "userId": userName
                        }
                    },
                    {
                        "term": {
                            "sessionId": sessionId
                        }
                    },
                    {
                        "term": {
                            "queryId": queryId
                        }
                    }
                ]
            }

        }
    };

    var results = [];
    stream.stream(routing, config.index.data, null, query, 250, function(err, page){
        if (err){
            callback(err, results);
        } else if (page.hits.hits.length === 0){
            callback(null, results);
        } else {
            _.each(page.hits.hits, function(result){
                results.push(result._source);
            });
        }
    });

}

exports.executeFilter = function(userId, sessionId, queryId, filter, callback){
    getJSONByQuery(userId+""+sessionId, config.index.data, null, filter, function(err, results){
        callback(results);
    });
};

exports.streamQuery = function(userName, query, pageSize, pageCallback){

    var newQuery = {
        "query": {
            "filtered": {
                "query": query.query,
                "filter": {
                    "term": {
                        "userId": userName
                    }
                }
            }
        }
    };

    stream.stream(null, config.index.data, null, newQuery, pageSize, pageCallback);
};

exports.getByFeatureId = function(userName, sessionId, featureId, callback){
    var routingStr = userName+""+sessionId;
    getJSONById(routingStr, config.index.data, null, featureId, callback);
};

exports.getMetadataByQueryId = function(userId, queryId, callback){
    getJSONById(null, config.index.metadata, null, queryId, function(err, results){
        if (err){
            callback(err, null);
        } else if (results._source.userId !== userId){
            callback("Metadata found but it does not belong to " + userId, null)
        } else {
            callback(null, results);
        }
    });
};

exports.getMetadataBySessionId = function(userId, sessionId, callback){
    var query = {
        "query":{
            "bool": {
                "must": [
                    {
                        "term": {
                            "userId": userId
                        }
                    },
                    {
                        "term": {
                            "sessionId": sessionId
                        }
                    }
                ]
            }

        }
    };
    getJSONByQuery(null, config.index.metadata, null, query, callback);
};

exports.getMetadataByUserId = function(userId, callback){
    var query = {
        "query":{
            "match":{
                "userId":userId
            }
        }
    };
    getJSONByQuery(null, config.index.metadata, null, query, callback);
};

/**
 * Returns the feature count of a user session
 * @param username
 * @param sessionId
 * @param callback
 */
exports.getCountBySessionId = function(username, sessionId, callback){
    var query = {
        "query": {
            "filtered": {
                "filter": {
                    "term": {
                        "userId": username,
                        "sessionId": sessionId
                    }
                }
            }
        }
    };

    getCountBySessionId(username+""+sessionId, config.index.data, query, callback);
};


var getJSONByQuery = function(routing, index, type, query, callback){

    var searchObj = {};
    searchObj.index = index;
    if (routing) { searchObj.routing = routing; }
    searchObj.body = query;


    client.search(searchObj).then(function(resp){
        callback(null, resp);
    }, function(err){
        callback(err, null);
    });
};

var getJSONById = function(routing, index, type, id, callback){

    var req = {
        "index": index,
        "type": type || '_all',
        "id": id
    };

    if (routing){ req.routing = routing; }

    client.get(req).then(function(resp){
        callback(null, resp);
    }, function(err){
        callback(err, null);
    });
};

/**
 * Returns the feature count of a user session
 * @param routing username+sessionId
 * @param index data
 * @param body the limiting query (at least username and session)
 * @param callback returns the feature count of the session
 */
var getCountBySessionId = function(routing, index,body, callback){
    var req = {
        "index": index,
        "routing": routing,
        "body": body
    };

    client.count(req).then(function(resp){
        callback(null, resp);
    }, function(err){
        callback(err, null);
    });
};
