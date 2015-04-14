define([
	'./draw'
], function (drawTool) {
    var context,
        params;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('draw.tool.close', drawTool.close);
            context.sandbox.on('draw.tool.open', drawTool.open);
            context.sandbox.on('map.draw.stop', drawTool.bboxAdded);
            context.sandbox.on('map.feature.draw', drawTool.test, params);
        }
    };	

    return exposed;
});