var config,
    client;

exports.init = function(context){
    config = context.sandbox.config.getConfig();
    client = context.sandbox.elastic.client.newClient();
};

exports.deleteMetadataByQueryId = function(queryId, callback){
    client.delete({
        index: config.index.metadata,
        type: "metadata",
        id: queryId
    }, callback);
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