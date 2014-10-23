define([
], function () {
	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        publishCreateLayer: function(args) {
            context.sandbox.emit('map.layer.create', args); 
        },
        publishRemoveLayer: function(args) {
            context.sandbox.emit('map.layer.delete', args);
        },
        publishHideLayer: function(args) {
            context.sandbox.emit('map.layer.hide', args); 
        },
        publishShowLayer: function(args) {
            context.sandbox.emit('map.layer.show', args); 
        },
        publishMessage: function(params) {
            context.sandbox.emit('message.publish', params); 
        },
    };

    return exposed;
});