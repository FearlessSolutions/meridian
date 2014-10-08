var config,
    client;

exports.init = function(context){
    config = context.sandbox.config.getConfig();
    client = context.sandbox.elastic.client.newClient();
};

exports.deleteRecordsByQueryId = function(user, sessionId, queryId, callback){
    client.deleteByQuery({
        index: "_all",
        routing: user,
        body: {
            "query": {
                "bool": {
                    "must": [
                        {
                            "term": {
                                "sessionId": sessionId
                            }
                        },
                        {
                            "term": {
                                "userId": user
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
        }
    }, callback);
};

exports.deleteRecordsByIndices = function(user, indices, callback){

    var body = [];

    indices.forEach(function(index){
        body.push({
            "delete": {
                "_index": index.index._index,
                "_type": index.index._type,
                "_id": index.index._id,
                "_routing": user
            }
        });
    });

    client.bulk({
        "body": body
    }, callback);
};

exports.deleteRecordsForUserSessionId = function(user, sessionId, callback){
    client.deleteByQuery({
        index: "_all",
        routing: user,
        body: {
            "query": {
                "bool": {
                    "must": [
                        {
                            "term": {
                                "sessionId": sessionId
                            }
                        },
                        {
                            "term": {
                                "userId": user
                            }
                        }
                    ]
                }
            }
        }
    }, callback);
};