define([
	'./cmapi-clear-publisher'
], function (publisher) {
	var context,
        sendError;
    var exposed = {
        "init": function(thisContext, errorChannel) {
            context = thisContext;
            sendError = errorChannel;
            publisher.init(context);
        },
        "receive": function(channel, message) {
            clear();
        },
        "clear": function(){
            var queryId;

            for(queryId in context.sandbox.dataStorage.datasets){
                if(context.sandbox.dataStorage.datasets[queryId] === context.sandbox.cmapi.DATASOURCE_NAME){
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