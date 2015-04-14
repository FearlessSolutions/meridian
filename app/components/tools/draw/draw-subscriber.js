define([
	'./draw',
], function (drawTool) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('draw.tool.close', drawTool.close);
            context.sandbox.on('draw.tool.open', drawTool.open);
            context.sandbox.on('map.draw.stop', drawTool.bboxAdded);
            context.sandbox.on('data.clear.all', drawTool.clear);
            context.sandbox.on('menu.opening', drawTool.handleMenuOpening);
            context.sandbox.on('data.requery', drawTool.populateQueryFromParams);
        }
    };	

    return exposed;
});