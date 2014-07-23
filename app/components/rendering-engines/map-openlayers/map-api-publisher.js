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
        publishMousePosition: function(params) {
            context.sandbox.emit('mouse.position.change', params);
        }
    };

    return exposed;

});