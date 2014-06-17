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
        publishOpening: function(args){
            context.sandbox.emit('menu.opening', args);
        },
        getExtent: function(args) {
            context.sandbox.emit('map.get.extent', args);
        },
        drawBBox: function() {
            context.sandbox.emit('map.draw.bbox.start');
        },
        removeBBox: function() {
            context.sandbox.emit('map.draw.bbox.remove');
        },
        executeQuery: function(args) {
            context.sandbox.emit('query.execute', args);
        },
        clear: function(){
            context.sandbox.emit("system.clear");
        }
    };

    return exposed;
});