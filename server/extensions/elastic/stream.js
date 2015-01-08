var client ;

exports.init = function(context){
    client = context.sandbox.elastic.client.getClient();
};

exports.stream = function(routing, index, type, query, pageSize, pageCallback){

    var getPage = function(routing, index, type, query, start, pageSize, pageCallback){

        var req = {
            index: index,
            body: query
        };

        if (type){ req.type = type; }
        if (routing){ req.routing = routing; }
        req.body.from = start;
        req.body.size = pageSize;

        client.search(req).then(function(resp){
            pageCallback(null, resp);
            var numRecordsReturned = resp.hits.hits.length;
            if (numRecordsReturned > 0){
                getPage(routing, index, type, query, start + pageSize, pageSize, pageCallback);
            }
        }, function(err){
            pageCallback(err, null, null);
        });

    };

    getPage(routing, index, type, query, 0, pageSize, pageCallback);

};