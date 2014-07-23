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
        }
    };

    return exposed;
});