define([
	'./boilerplate'
], function (boilerplate) {

    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;

            // The 'on' function subscribes to the specified channel and calls dummyFunction
            // If there are params passed along the channel, then those are passed to dummyFunction
            context.sandbox.on('map.zoom.in', boilerplate.dummyFunction);
        },
        publishMessage: function(params) {
            // The 'emit' function is used to publish to the specified channel with a payload of params
            context.sandbox.emit('message.publish', params); 
        }
    };	

    return exposed;

});