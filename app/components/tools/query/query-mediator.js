define([
	'./query'
], function (queryTool) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('query.tool.close', queryTool.close);
            context.sandbox.on('query.tool.open', queryTool.open);
            context.sandbox.on('map.draw.stop', queryTool.bboxAdded);
            context.sandbox.on('data.clear.all', queryTool.clear);
            context.sandbox.on('menu.opening', queryTool.handleMenuOpening);
            context.sandbox.on('data.requery', queryTool.populateQueryFromParams);
            context.sandbox.on('query.execute', queryTool.validateBookmark);
        },
        publishMessage: function(params) {
            context.sandbox.emit('message.publish', params); 
        },
        publishOpening: function(params){
            context.sandbox.emit('menu.opening', params);
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
            context.sandbox.emit("data.clear.all");
        },
        closeQueryTool: function(params) {
            context.sandbox.emit('query.tool.close');
        },
        openQueryTool: function(params) {
            context.sandbox.emit('query.tool.open');
        },
        createBookmark: function(params) {
            context.sandbox.emit('bookmark.create', params);
        }
    };	

    return exposed;
});