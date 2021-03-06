define([
	'./cmapi-clear-mediator'
], function (mediator) {
	var context,
        sendError,
        exposed;

    exposed = {
        init: function(thisContext, errorChannel) {
            context = thisContext;
            sendError = errorChannel;
            mediator.init(context, exposed);
        },
        receive: function(channel, message) {
           mediator.publishClear();
        },
        clear: function(){
            clear();
        }
    };

    function clear(){
        var queryId;

        for(queryId in context.sandbox.dataStorage.datasets){
            if(context.sandbox.dataStorage.datasets[queryId].dataService === context.sandbox.cmapi.DATASOURCE_NAME){
                delete context.sandbox.dataStorage.datasets[queryId];
            }
        }

        context.sandbox.ajax.clear();
    }

    return exposed;
});