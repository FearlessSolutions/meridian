define([
], function () {

	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        publishMessage: function(args) {
            // The 'emit' function is used to publish to the specified channel with a payload of args
            context.sandbox.emit('message.publish', args); 
        }
    };

    return exposed;

});