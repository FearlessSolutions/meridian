define([
], function () {
	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        createLayer: function(args) {
            context.sandbox.emit('map.layer.create', args); 
        },
        removeLayer: function(args) {
            context.sandbox.emit('map.layer.delete', args);
        },
        hideLayer: function(args) {
            context.sandbox.emit('map.layer.hide', args); 
        },
        showLayer: function(args) {
            context.sandbox.emit('map.layer.show', args); 
        },
        publishMessage: function(params) {
            context.sandbox.emit('message.publish', params); 
        }
    };

    return exposed;
});