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
        publishOpening: function(params){
            context.sandbox.emit('menu.opening', params);
        },
        getExtent: function(params) {
            context.sandbox.emit('map.get.extent', params);
        },
        drawBBox: function() {
            context.sandbox.emit('map.draw.start');
        },
        removeBBox: function() {
            context.sandbox.emit('map.draw.clear');
        },
        executeQuery: function(params) {
            context.sandbox.emit('query.execute', params);
        },
        clear: function(){
            context.sandbox.emit("system.clear");
        }
    };

    return exposed;
});