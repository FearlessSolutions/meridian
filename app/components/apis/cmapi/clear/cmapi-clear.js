define([
	'./cmapi-clear-publisher',
	'./cmapi-clear-subscriber'
], function (publisher, subscriber) {
	var context,
        sendError;
    var exposed = {
        init: function(thisContext, errorChannel) {
            context = thisContext;
            sendError = errorChannel;
            publisher.init(context);
            subscriber.init(context, exposed);
        },
        receive: function(channel, message) {
            clear();
        },
        clear: function(){
            var queryId;

            for(queryId in context.sandbox.dataStorage.datasets){
                if(context.sandbox.dataStorage.datasets[queryId].dataService === context.sandbox.cmapi.DATASOURCE_NAME){
                    delete context.sandbox.dataStorage.datasets[queryId];
                }
            }

            context.sandbox.ajax.clear();
        }
    };

    function clear(){
        publisher.publishClear();
    }

    return exposed;
});