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
        stopDrawingRectangle: function(params) {
            context.sandbox.emit('map.draw.stop.rectangle', params);
            context.sandbox.emit('map.draw.deactivate');
        },
        publishMousePosition: function(params) {
            context.sandbox.emit('mouse.position.change', params);
        },
        updateEventCounter: function(params) {
            context.sandbox.emit('eventcounter.update', params);
        },
        publishMapClick: function(params){
            context.sandbox.emit('map.click', params);
        }
    };

    return exposed;

});