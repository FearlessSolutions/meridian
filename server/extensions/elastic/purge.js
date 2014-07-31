var config,
    client;

exports.init = function(context){
    config = context.sandbox.config.getConfig();
    client = context.sandbox.elastic.client.newClient();
}

exports.deleteRecordsByQueryId = function(user, sessionId, queryId, callback){
    client.deleteByQuery({
        index: "_all",
        routing: user+""+sessionId,
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
        routing: user+""+sessionId,
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