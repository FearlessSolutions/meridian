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
        drawBBox: function() {
            context.sandbox.emit('map.draw.start.rectangle');
        },
        removeBBox: function() {
            context.sandbox.emit('map.draw.clear');
        },
        executeQuery: function(params) {
            context.sandbox.emit('query.execute', params);
        },
        clear: function(){
            context.sandbox.emit("data.clear.all");
        },
        closeQueryTool: function(params) {
            context.sandbox.emit('draw.tool.close');
        },
        openQueryTool: function(params) {
            context.sandbox.emit('draw.tool.open');
        }
    };

    return exposed;
});