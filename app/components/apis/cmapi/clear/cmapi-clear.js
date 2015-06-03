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
            clear();
        }
    };

    function clear(){
        context.sandbox.dataStorage.clear();
        context.sandbox.ajax.clear();
        mediator.publishClear();
    }

    return exposed;
});