define([
], function () {
	var context,
        parent;

	return {
        init: function(thisContext, thisParent) {
            context = thisContext;
            parent = thisParent;
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
            console.log("BOOM");
            context.sandbox.emit('map.zoom.maxExtent', args);
        },
        zoomToLayer: function(args) {
            context.sandbox.emit('map.zoom.toLayer', args);
        },
        zoomToFeatures: function(args) {
            console.log("BOOM");
            context.sandbox.emit('map.view.center.feature', args);
        },
        centerOnBounds: function(args) {
            context.sandbox.emit('map.zoom.toLocation', args);
        }
    };

});