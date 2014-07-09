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
        stopDrawing: function(args) {
            context.sandbox.emit('map.draw.stop', args);
        },
        publishExtent: function(args) {
            context.sandbox.emit('map.view.extent', args);
        },
        publishCoordinates: function(args){
            context.sandbox.emit('map.coordinates', args);
        }
    };

    return exposed;

});