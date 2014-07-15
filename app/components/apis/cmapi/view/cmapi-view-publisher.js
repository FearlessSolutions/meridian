define([
], function () {
	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        publishMessage: function(args) {
            context.sandbox.emit('message.publish', args); 
        },
        publishSetCenter: function(args){
            context.sandbox.emit('map.center.set', args);
        },
        publishZoomToLayer: function(args){
            context.sandbox.emit('map.zoom.toLayer', args);
        },
        publishCenterOnBounds: function(args){
            context.sandbox.emit('map.zoom.toLocation', args);
        }
    };

    return exposed;
});