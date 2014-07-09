define([
	'./query'
], function (queryTool) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('map.draw.stop', queryTool.bboxAdded);
            context.sandbox.on('system.clear', queryTool.clear);
            context.sandbox.on('menu.opening', queryTool.handleMenuOpening);
        }
    };	

    return exposed;
});