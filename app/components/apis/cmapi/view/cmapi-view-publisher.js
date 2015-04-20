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
        setCenter: function(args) {
            context.sandbox.emit('map.center.set', args);
        },
        zoomIn: function(args) {
            context.sandbox.emit('map.zoom.in', args);
        },
        zoomOut: function(args) {
            context.sandbox.emit('map.zoom.out', args);
        },
        zoomToMaxExtent: function(args) {
            context.sandbox.emit('map.zoom.maxExtent', args);
        },
        zoomToLayer: function(args) {
            context.sandbox.emit('map.zoom.toLayer', args);
        },
        centerOnBounds: function(args) {
            context.sandbox.emit('map.zoom.toLocation', args);
        }
    };

    return exposed;
});