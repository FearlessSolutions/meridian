define([
	'./query'
], function (queryTool) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('map.view.extent', queryTool.populateCoordinates);
            context.sandbox.on('map.draw.bbox.added', queryTool.bboxAdded);
            context.sandbox.on('system.clear', queryTool.clear);
            context.sandbox.on('menu.opening', queryTool.handleMenuOpening);
        }
    };	

    return exposed;
});