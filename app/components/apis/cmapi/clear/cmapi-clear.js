define([
	'./cmapi-clear-publisher'
], function (publisher) {
	var context,
        sendError;
    var exposed = {
        init: function(thisContext, errorChannel) {
            context = thisContext;
            sendError = errorChannel;
            publisher.init(context);
        },
        receive: function(channel, message) {
            clear();
        }
    };

    function clear(){
        publisher.publishClear();
    }
    return exposed;
});