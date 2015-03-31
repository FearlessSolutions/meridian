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
            //context.sandbox.on('data.finished', queryTool.validateBookmark);
        }
    };	

    return exposed;
});