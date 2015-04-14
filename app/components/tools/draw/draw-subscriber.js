define([
	'./draw',
    './draw-publisher'
], function (drawTool, drawPublisher) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('draw.tool.close', drawTool.close);
            context.sandbox.on('draw.tool.close', drawPublisher.deactivateDrawTool);
            context.sandbox.on('draw.tool.open', drawTool.open);
            context.sandbox.on('map.draw.stop', drawTool.bboxAdded);
        }
    };	

    return exposed;
});