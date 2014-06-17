define([
	'./event-counter'
], function (eventCountTool) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('data.add', eventCountTool.addPoints);
            context.sandbox.on('map.layer.hide', eventCountTool.hideLayer);
            context.sandbox.on('map.layer.hide.all', eventCountTool.hideAll);
            context.sandbox.on('map.layer.show', eventCountTool.showLayer);
            context.sandbox.on('system.clear', eventCountTool.clear);
        }
    };	

    return exposed;
});