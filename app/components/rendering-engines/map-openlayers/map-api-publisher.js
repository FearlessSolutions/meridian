define([
], function () {

	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        publishMessage: function(params) {
            context.sandbox.emit('message.publish', params); 
        },
        stopDrawing: function(params) {
            context.sandbox.emit('map.draw.stop', params);
        },
        publishExtent: function(params) {
            context.sandbox.emit('map.view.extent', params);
        },
        publishCoordinates: function(params){
            context.sandbox.emit('map.coordinates', params);
        }
    };

    return exposed;

});