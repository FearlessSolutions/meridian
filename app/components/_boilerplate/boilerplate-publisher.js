define([
], function () {

	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        publishMessage: function(params) {
            // The 'emit' function is used to publish to the specified channel with a payload of params
            context.sandbox.emit('message.publish', params); 
        }
    };

    return exposed;

});