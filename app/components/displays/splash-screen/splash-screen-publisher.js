define([
], function () {

	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        publishMessage: function(args) {
            context.sandbox.emit('message.publish', args); 
        }
    };

    return exposed;

});