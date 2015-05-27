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
        plotFeatures: function(params) {
            context.sandbox.emit('map.features.plot', params);
        },
        drawBBox: function() {
            context.sandbox.emit('map.draw.start');
        },
        removeShapes: function() {
            context.sandbox.emit('map.draw.removeShape', params);
        },
        executeQuery: function(params) {
            context.sandbox.emit('query.execute', params);
        },
        clear: function(){
            context.sandbox.emit("data.clear.all");
        },
        closeQueryTool: function(params) {
            context.sandbox.emit('query.tool.close');
        },
        openQueryTool: function(params) {
            context.sandbox.emit('query.tool.open');
        }
    };

    return exposed;
});