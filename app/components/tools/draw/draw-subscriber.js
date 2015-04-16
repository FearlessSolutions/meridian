define([
	'./draw'
], function (drawTool) {
    var context,
        params;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('draw.tool.close', drawTool.reset);
            context.sandbox.on('draw.tool.open', drawTool.open);
            context.sandbox.on('map.draw.stop', drawTool.copyShapetoLayer)
        }
    };	

    return exposed;
});