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
        publishZoom: function(args){
            context.sandbox.emit('map.center.set', args);
        },
        publishCenterMap: function(args){
            context.sandbox.emit('map.center.set', args);
        },
        publishCenterOnBounds: function(args){
            context.sandbox.emit('map.zoom.toLocation', args);
        }
    };

    return exposed;
});